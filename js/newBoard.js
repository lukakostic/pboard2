function newText(event) {
    if (event.srcElement == null)
        event.srcElement = event.target;
    let parent = event.srcElement.parentNode.parentNode.parentNode;
    let el = html.textBrdTemplate.cloneNode(true);
    let brd = new Board(BoardType.Text, "Text", "", { references: 1 });
    pb.boards[brd.id] = brd;
    pb.boards[dataId(parent)].content.push(brd.id);
    parent.appendChild(el);
    ui.loadTextBoard(el, brd.id);
    EbyClass('textBtn', el)[0].click();
    ui.fixListUI(parent);
    sync.saveAll();
}
function newBoard(event) {
    if (event.srcElement == null)
        event.srcElement = event.target;
    let parent = event.srcElement.parentNode.parentNode.parentNode;
    let el = html.boardBrdTemplate.cloneNode(true);
    let atr = { description: 'Description', references: 1 };
    let brd = new Board(BoardType.Board, "Board", [], atr);
    pb.boards[brd.id] = brd;
    pb.boards[dataId(parent)].content.push(brd.id);
    parent.appendChild(el);
    ui.loadBoardBoard(el, brd.id);
    ui.fixListUI(parent)(EbyClass('textBtn', el)[0]).click();
    sync.saveAll(() => {
    });
}
function newList(event) {
    let el = html.listTemplate.cloneNode(true);
    if (event.srcElement == null)
        event.srcElement = event.target;
    let inp = event.srcElement.firstElementChild;
    let name = inp.value;
    let titleText = EbyClass('title-text', el)[0];
    $(titleText).html(name);
    titleText.addEventListener('click', listTitleClicked, true);
    titleText.onblur = (event) => { listTitleBlur(event); };
    let brd = new Board(BoardType.List, name, [], { references: 1 });
    pb.boards[brd.id] = brd;
    pb.boards[board].content.push(brd.id);
    html.boardAlbum.appendChild(el);
    set_dataId(el, brd.id);
    ui.fixNewListUI();
    ui.fixAlbumUI();
    ui.makeDraggable();
    $(inp).val('');
    sync.saveAll();
}
