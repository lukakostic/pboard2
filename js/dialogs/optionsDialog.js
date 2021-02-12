let optionsElement = null;
function showOptionsDialog(event, idEl = null) {
    if (event.srcElement == null)
        event.srcElement = event.target;
    optionsElement = event.srcElement;
    if (idEl == null)
        idEl = event.srcElement.parentNode;
    let modal = $('#optionsDialog');
    modal.modal('show');
}
function showBoardExtrasDialog() {
    extrasSelected = findFirstBoardId(optionsElement);
    if (extrasSelected == null)
        alert('Extras selected is null??');
    showExtras();
}
function showSeeReferencesDialog() {
    hideOptionsDialog();
    let Btn = optionsElement;
    if (dataId(Btn.parentNode) == "")
        return alert('No references');
    let brd = dataId(Btn.parentNode);
    if (brdAttr(brd, 'references') == 1)
        return alert('This is the only reference');
    let listReferences = [];
    let ids = Object.keys(pb.boards);
    for (let i = 0; i < ids.length; i++)
        if (pb.boards[ids[i]].type == BoardType.List)
            if (pb.boards[ids[i]].content.includes(brd))
                listReferences.push(ids[i]);
    let boardReferences = {};
    for (let i = 0; i < ids.length; i++)
        if (pb.boards[ids[i]].type == BoardType.Board)
            for (let j = 0; j < listReferences.length; j++)
                if (pb.boards[ids[i]].content.includes(listReferences[j]))
                    boardReferences[ids[i]] = null;
    let btnTemplate = templateFChild('referencesDialogBtn');
    let list = EbyId('referencesDialogList');
    while (list.firstChild)
        list.removeChild(list.firstChild);
    let modal = $('#referencesDialog');
    let brds = Object.keys(boardReferences);
    for (let i = 0; i < brds.length; i++) {
        let el = btnTemplate.cloneNode(true);
        list.appendChild(el);
        set_dataId(el, brds[i]);
        if (brds[i] == "")
            $(el).text('Main Board');
        else
            $(el).text('List(s) on Board ' + brds[i]);
    }
    set_dataId(modal[0], brd);
    modal.modal('show');
}
function hideOptionsDialog() {
    let modal = $('#optionsDialog');
    modal.modal('hide');
}
function removeClicked() {
    let idEl = optionsElement.parentNode;
    let isBoard = idEl.classList.contains('board');
    if (isBoard == false)
        idEl = idEl.parentNode;
    let id = dataId(idEl);
    if (brdAttr(id, 'references') <= 1 && confirm('This is the last reference to this board, really remove it? (Will delete the board)') == false)
        return;
    if (isBoard) {
        let ind = elementIndex(idEl) - 1;
        log('removed ind ' + ind);
        pb.boards[dataId(idEl.parentNode)].content.splice(ind, 1);
    }
    else {
        let ind = elementIndex(idEl);
        log('removed ind ' + ind);
        pb.boards[board].content.splice(ind, 1);
    }
    pb.boards[id].attributes['references']--;
    if (pb.boards[id].attributes['references'] <= 0)
        Board.deleteBoardById(id);
    hideOptionsDialog();
    ui.clearLists();
    ui.draw();
    sync.saveAll();
}
function deleteClicked() {
    if (confirm('Really delete this board, all references to it and its content (content will be removed, not deleted)?') == false)
        return;
    let idEl = optionsElement.parentNode;
    let isBoard = idEl.classList.contains('board');
    if (isBoard == false)
        idEl = idEl.parentNode;
    let id = dataId(idEl);
    Board.deleteBoardById(id);
    hideOptionsDialog();
    ui.clearLists();
    ui.draw();
    sync.saveAll();
}
function copyIdClicked() {
    let id = dataId(optionsElement.parentNode);
    window.prompt("Copy to clipboard: Ctrl+C, Enter", id);
    hideOptionsDialog();
}
function referencesDialogBtn(event) {
    if (event.srcElement == null)
        event.srcElement = event.target;
    showBoardBoardDialog(event, dataId(event.srcElement));
}
