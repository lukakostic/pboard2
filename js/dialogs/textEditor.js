
function showTextBoardDialog(event){
    console.log(event)
    console.log('drag',ui.dragItem[0], '!=',ui.dragItem!=null)
    console.log(event.srcElement==ui.dragItem[0], '||',event.srcElement.parentNode == ui.dragItem[0])
    if(event.srcElement == null) event.srcElement = event.target
    if(ui.dragItem!=null && ( event.srcElement==ui.dragItem[0] || event.srcElement.parentNode == ui.dragItem[0])) return
    console.log('showTextBoard')
    let textBtn = event.srcElement
    let brd = project.boards[dataId(textBtn.parentNode)]

    if(brd==null) alert('Text board modal: brd == null')

    $('#textBoardDialogTitle').val(brd.name)
    let text = $('#textBoardDialogText')
    text.val(brd.content)
    let modal = $('#textBoardDialog')
    set_dataId(modal[0],brd.id)
    modal.modal('show')

    //can do without timeout, but set timeout to like 0.8 seconds if you add 'modal fade' instead of just 'modal'
    setTimeout(()=>{
        ui.expandInput(text[0])
        EbyId('textBoardDialogTitle').select()
    },10)
}

function closeTextBoardDialog(){
    EbyId('textBoardDialog').click()
}

function textCloseClicked(event){
    sync.saveAll()
}

function textBackClicked(event){
    if(event.target.id != 'textBoardDialog') return

    //alert('closing back??'); //save now?
    textCloseClicked()
}

function textTitleChanged(event){
    
    //alert("Text title changed");
    let brdId = EbyId('textBoardDialog').getAttribute('data-id')
    if(event.srcElement == null) event.srcElement = event.target
    project.boards[brdId].name = event.srcElement.value

    ui.loadAllBoardsByDataId(brdId)

    sync.save.dirty = true 
}

function textDescriptionChanged(event){

    //alert("Text description changed");
    let brdId = EbyId('textBoardDialog').getAttribute('data-id')
    if(event.srcElement == null) event.srcElement = event.target
    project.boards[brdId].content = event.srcElement.value

    ui.loadAllBoardsByDataId(brdId)

    sync.save.dirty = true
}