
function showTextBoardDialog(){
    if(dragItem!=null && ( event.srcElement==dragItem[0] || event.srcElement.parentNode == dragItem[0])) return

    var textBtn = event.srcElement
    var brd = project.boards[dataId(textBtn.parentNode)]

    if(brd==null) alert('Text board modal: brd == null')

    $('#textBoardDialogTitle').val(brd.name)
    let text = $('#textBoardDialogText')
    text.val(brd.content)
    let modal = $('#textBoardDialog')
    set_dataId(modal[0],brd.id)
    modal.modal('show')

    //can do without timeout, but set timeout to like 0.8 seconds if you add 'modal fade' instead of just 'modal'
    setTimeout(()=>{
        expandInput(text[0])
        EbyId('textBoardDialogTitle').select()
    },10)
}

function closeTextBoardDialog(){
    EbyId('textBoardDialog').click()
}

function textCloseClicked(){
    if(textSave) saveAll() ////////[NOTICE] what if save fails?

    textSave = false
}

function textBackClicked(){
    if(event.target.id != 'textBoardDialog') return

    //alert('closing back??'); //save now?
    textCloseClicked()
}

function textTitleChanged(){
    
    //alert("Text title changed");
    let brdId = EbyId('textBoardDialog').getAttribute('data-id')
    project.boards[brdId].name = event.srcElement.value

    loadAllBoardsByDataId(brdId)

    textSave = true //saveAll();
}

function textDescriptionChanged(){

    //alert("Text description changed");
    let brdId = EbyId('textBoardDialog').getAttribute('data-id')
    project.boards[brdId].content = event.srcElement.value

    loadAllBoardsByDataId(brdId)

    textSave = true //saveAll();
}