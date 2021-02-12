function showBoardBoardDialog(event, id = null) {
    if (event.srcElement == null)
        event.srcElement = event.target;
    if (ui.dragItem != null && (event.srcElement == ui.dragItem[0] || event.srcElement.parentNode == ui.dragItem[0]))
        return;
    if (id == null)
        id = dataId(event.srcElement.parentNode);
    set_board(id);
}
function listTitleClicked(event) {
    if (event.srcElement == null)
        event.srcElement = event.target;
    let titleText = event.srcElement;
    $(titleText).focus();
    try {
        document.execCommand('selectAll', false, null);
    }
    catch (e) { }
    log('Title click');
}
function listTitleBlur(event) {
    if (event.srcElement == null)
        event.srcElement = event.target;
    let titleText = event.srcElement;
    log('Title blur');
}
function newReferenceBtn(event) {
    let refer = window.prompt("Write/Paste id of board to reference:");
    if (refer == null)
        return;
    if (pb.boards[refer] == null) {
        alert("ID doesn't exist :(");
        return;
    }
    if (pb.boards[refer].type == BoardType.List) {
        alert("Cant embed lists into boards.");
        return;
    }
    if (event.srcElement == null)
        event.srcElement = event.target;
    let lst = event.srcElement.parentNode.parentNode.parentNode;
    let lstId = dataId(lst);
    pb.boards[lstId].content.push(refer);
    clearBoards(lst);
    ui.loadList(lst, lstId);
    pb.boards[refer].attributes['references']++;
    hideOptionsDialog();
    sync.saveAll();
}
