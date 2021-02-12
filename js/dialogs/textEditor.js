let textBoardAtStart = null;
let textBoardGettingEdited = null;
function showTextBoardDialog(event) {
    if (event.srcElement == null)
        event.srcElement = event.target;
    if (ui.dragItem != null && (event.srcElement == ui.dragItem[0] || event.srcElement.parentNode == ui.dragItem[0]))
        return;
    let textBtn = event.srcElement;
    let brdId = dataId(textBtn.parentNode);
    let brd = pb.boards[brdId];
    textBoardAtStart = JSON.stringify(brd);
    textBoardGettingEdited = brdId;
    if (brd == null)
        alert('Text board modal: brd == null');
    $('#textBoardDialogTitle').val(brd.name);
    let text = $('#textBoardDialogText');
    text.val(brd.content);
    let modal = $('#textBoardDialog');
    set_dataId(modal[0], brd.id);
    modal.modal('show');
    setTimeout(() => {
        ui.expandInput(text[0]);
        EbyId('textBoardDialogTitle').select();
    }, 10);
}
function closeTextBoardDialog() {
    EbyId('textBoardDialog').click();
}
function textCloseClicked(event = null) {
    if (JSON.stringify(pb.boards[textBoardGettingEdited]) != textBoardAtStart)
        sync.saveAll();
}
function textBackClicked(event) {
    if (event.target.id != 'textBoardDialog')
        return;
    textCloseClicked();
}
function textTitleChanged(event) {
    let brdId = EbyId('textBoardDialog').getAttribute('data-id');
    if (event.srcElement == null)
        event.srcElement = event.target;
    pb.boards[brdId].name = event.srcElement.value;
    ui.loadAllBoardsByDataId(brdId);
    sync.save.dirty = true;
}
function textDescriptionChanged(event) {
    let brdId = EbyId('textBoardDialog').getAttribute('data-id');
    if (event.srcElement == null)
        event.srcElement = event.target;
    pb.boards[brdId].content = event.srcElement.value;
    ui.loadAllBoardsByDataId(brdId);
    sync.save.dirty = true;
}
