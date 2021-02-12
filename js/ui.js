let ui = {
    dragOld: null, dragNew: null, dragItem: null, oldDragIndex: null, newDragIndex: null,
    dragStartTime: -999,
    autoUI: null,
    htmlLoaded: function () {
        this.autoUI = setInterval(() => {
            document.body.style.setProperty("width", "100vw");
            if (window.innerWidth > 1250)
                html.listAlbum.style.width = '1250px';
            else
                html.listAlbum.style.width = '100%';
            if (pb != null) {
                let brdName = pb.boards[board].name;
                if (brdName == "")
                    brdName = "PBoard";
                else
                    brdName += " - PBoard";
                document.title = brdName;
            }
        }, 100);
        html.find();
        EbyId('homeBtn').onclick = goHome;
        EbyId('upBtn').onclick = goUp;
        EbyId('saveBtn').onclick = () => { sync.saveAll(null, true); };
        EbyId('loadBtn').onclick = () => { sync.loadAll(); };
    },
    pageOpened: function () {
        log("pageOpened()");
        extensions.invoke('pre_newPage');
        this.draw();
        extensions.invoke('newPage');
        extensions.execute();
    },
    loadBoardBackgroundImage: function () {
        let brdEl = EbyId('main');
        brdEl.style.backgroundImage = "url('" + brdAttr(board, 'background') + "')";
        brdEl.style.repeatMode = "no-repeat";
        brdEl.style.backgroundSize = "cover";
    },
    startSavingIndicator: function () {
        html.savingIndicator.style.display = 'block';
    },
    stopSavingIndicator: function () {
        html.savingIndicator.style.display = 'none';
    },
    startLoadingIndicator: function () {
        html.loadingIndicator.style.display = 'block';
    },
    stopLoadingIndicator: function () {
        html.loadingIndicator.style.display = 'none';
    },
    expandInputAll: function () {
        let expandoInputs = EbyClass('expandInput');
        for (let i = 0; i < expandoInputs.length; i++)
            this.expandInput(expandoInputs[i]);
    },
    expandInput: function (el) {
        el.style.height = '1px';
        el.style.height = (1 + el.scrollHeight) + 'px';
        el.parentNode.style.height = el.style.height;
    },
    clearLists: function () {
        log('clearLists()');
        let lists = EbyClass('list');
        for (let j = lists.length - 1; j > -1; j--)
            if (lists[j].id == "")
                $(lists[j]).remove();
    },
    makeDraggable: function () {
        let draggableLists = $('.draggableList');
        if (draggableLists.length !== 0)
            draggableLists.sortable({
                items: '.draggable',
                start: (event, drag) => {
                    log('drag start');
                    ui.dragItem = drag.item;
                    ui.oldDragIndex = elementIndex(ui.dragItem[0]);
                    ui.dragNew = ui.dragOld = drag.item.parent();
                    ui.dragStartTime = (new Date()).getTime();
                },
                stop: (event, drag) => {
                    log('drag stop');
                    setTimeout(() => {
                        ui.newDragIndex = elementIndex(ui.dragItem[0]);
                        pb.boards[dataId(ui.dragOld[0])].content.splice(ui.oldDragIndex - 1, 1);
                        pb.boards[dataId(ui.dragNew[0])].content.splice(ui.newDragIndex - 1, 0, dataId(ui.dragItem[0]));
                        let clickItem = null;
                        if (((new Date()).getTime() - ui.dragStartTime) < 200 && ui.newDragIndex == ui.oldDragIndex) {
                            clickItem = ui.dragItem.find('div');
                        }
                        else
                            sync.saveAll();
                        ui.dragItem = null;
                        if (clickItem != null)
                            clickItem.click();
                    }, 50);
                },
                change: (event, drag) => {
                    log('drag change');
                    if (drag.sender)
                        ui.dragNew = drag.placeholder.parent();
                    ui.fixListUI(ui.dragNew[0]);
                },
                connectWith: ".draggableList"
            }).disableSelection();
        let draggableAlbums = $('.draggableAlbum');
        if (draggableAlbums.length !== 0)
            draggableAlbums.sortable({
                items: '.draggableList',
                start: (event, drag) => {
                    log('drag list start');
                    ui.dragItem = drag.item;
                    ui.oldDragIndex = elementIndex(ui.dragItem[0]);
                    ui.dragStartTime = (new Date()).getTime();
                },
                stop: (event, drag) => {
                    log('drag list stop');
                    setTimeout(() => {
                        ui.newDragIndex = elementIndex(ui.dragItem[0]);
                        pb.boards[board].content.splice(ui.oldDragIndex, 1);
                        pb.boards[board].content.splice(ui.newDragIndex, 0, dataId(ui.dragItem[0]));
                        ui.dragItem = null;
                        sync.saveAll();
                    }, 50);
                },
                change: (event, ui) => {
                    log('drag list change');
                }
            }).disableSelection();
    },
    draw: function () {
        log('draw()');
        if (pb.boards[board].type == BoardType.Board)
            this.drawBoardAlbum();
        else if (pb.boards[board].type == BoardType.List)
            this.drawListAlbum();
        this.loadBoardBackgroundImage();
        this.makeDraggable();
        setTimeout(() => { ui.expandInputAll(); }, 200);
        setTimeout(() => { ui.expandInputAll(); }, 1000);
    },
    clearBoards: function (lst = null) {
        log('clearBoards(', lst, ')');
        let lists = [lst];
        if (lst == null)
            lists = qSelAll('.list:not([id])');
        logw('lists', lists);
        for (let j = 0; j < lists.length; j++) {
            let boards = qSelAll('.board:not([id])', lists[j]);
            for (let i = boards.length - 1; i > -1; i--)
                $(boards[i]).remove();
        }
    },
    fixNewListUI: function () {
        let newlist = EbyId('newlist');
        newlist.parentNode.appendChild(newlist);
    },
    fixAlbumUI: function () {
        let album = EbyId('boardAlbum');
        let columnWidth = 310;
        if (album) {
            album.style.setProperty('width', ((columnWidth * album.childElementCount) + 10 + 8).toString() + 'px');
            return album;
        }
        return null;
    },
    fixListUI: function (listEl = null) {
        if (listEl != null) {
            let newPanel = EbyClass('newPanel', listEl)[0];
            newPanel.parentNode.appendChild(newPanel);
        }
        else {
            let album = this.fixAlbumUI();
            let lists = EbyClass('list', album)[0];
            for (let i = 0; i < lists.length; i++)
                if (lists[i].id == "")
                    this.fixListUI(lists[i]);
        }
    },
    drawBoardAlbum: function () {
        log('drawBoardAlbum()');
        html.listAlbum.classList.add('d-none');
        html.boardAlbum.classList.remove('d-none');
        this.clearLists();
        html.boardTitle.value = pb.boards[board].name;
        html.boardDescription.value = brdAttr(board, 'description');
        for (let l = 0; l < pb.boards[board].content.length; l++) {
            let listEl = html.listTemplate.cloneNode(true);
            html.boardAlbum.appendChild(listEl);
            this.loadList(listEl, pb.boards[board].content[l]);
        }
        $(html.boardTitle).select();
        this.fixAlbumUI();
        this.fixNewListUI();
    },
    drawListAlbum: function () {
        log('drawListAlbum()');
        html.boardAlbum.classList.add('d-none');
        html.listAlbum.classList.remove('d-none');
        this.clearBoards(html.mainList);
        html.boardTitle.value = pb.boards[board].name;
        html.boardDescription.value = brdAttr(board, 'description');
        this.loadList(html.mainList, board);
        this.fixListUI(html.mainList);
    },
    loadTextBoard: function (textBoardEl, brd) {
        log('loadTextBoard(', textBoardEl, "'" + JSON.stringify(brd) + "'", ')');
        if (typeof brd === 'string' || brd instanceof String)
            brd = pb.boards[brd];
        set_dataId(textBoardEl, brd.id);
        $(EbyClass('textBtn', textBoardEl)[0]).contents()[1].nodeValue = brd.name;
        if (brd.content.length > 0)
            EbyClass('descriptionIcon', textBoardEl)[0].classList.remove('d-none');
        else
            EbyClass('descriptionIcon', textBoardEl)[0].classList.add('d-none');
        this.loadBackground(textBoardEl, brd.id);
    },
    loadBackground: function (brdEl, id) {
        brdEl.style.backgroundImage = "url('" + brdAttr(id, 'background') + "')";
        brdEl.style.repeatMode = "no-repeat";
        brdEl.style.backgroundSize = "cover";
    },
    loadBoardBoard: function (boardBoardEl, brd) {
        log('loadBoardBoard(', boardBoardEl, "'" + JSON.stringify(brd) + "'", ')');
        if (typeof brd === 'string' || brd instanceof String)
            brd = pb.boards[brd];
        set_dataId(boardBoardEl, brd.id);
        $(EbyClass('textBtn', boardBoardEl)[0]).contents()[0].nodeValue = brd.name;
        this.loadBackground(boardBoardEl, brd.id);
    },
    loadList: function (listEl, brd) {
        log('loadList(', listEl, "'" + JSON.stringify(brd) + "'", ')');
        if (typeof brd === 'string' || brd instanceof String)
            brd = pb.boards[brd];
        titleText = EbyClass('title-text', listEl)[0];
        titleText.addEventListener('click', listTitleClicked, true);
        titleText.onblur = (event) => { listTitleBlur(event); };
        $(titleText).html(brd.name);
        set_dataId(listEl, brd.id);
        for (let i = 0; i < brd.content.length; i++) {
            let brd2 = pb.boards[brd.content[i]];
            if (brd2.type == BoardType.Text) {
                let el = html.textBrdTemplate.cloneNode(true);
                listEl.appendChild(el);
                this.loadTextBoard(el, brd2);
            }
            else if (brd2.type == BoardType.Board) {
                let el = html.boardBrdTemplate.cloneNode(true);
                listEl.appendChild(el);
                this.loadBoardBoard(el, brd2);
            }
        }
        this.fixListUI(listEl);
    },
    loadAllBoardsByDataId: function (brdId) {
        let boardEls = EbyClass('board');
        for (let i = 0; i < boardEls.length; i++)
            if (dataId(boardEls[i]) == brdId) {
                if (pb.boards[brdId].type == BoardType.Text)
                    this.loadTextBoard(boardEls[i], brdId);
                else if (pb.boards[brdId].type == BoardType.Board)
                    this.loadBoardBoard(boardEls[i], brdId);
            }
    },
};
