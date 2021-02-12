//@flow


function boardTitleChanged(event){
    // $FlowIgnore[extra-arg]
    log('board title changed')
    
    if(event.srcElement == null) event.srcElement = event.target
    pb.boards[board].name = event.srcElement.value

    ui.loadAllBoardsByDataId(board)

    sync.save.dirty = true
}

function boardDescriptionChanged(event){
    // $FlowIgnore[extra-arg]
    log('board description changed')

    if(event.srcElement == null) event.srcElement = event.target
    set_brdAttr(board,'description',event.srcElement.value)

    ui.loadAllBoardsByDataId(board)

    sync.save.dirty = true
}

function listTitleChanged(event){
    // $FlowIgnore[extra-arg]
    log('list title changed')

    if(event.srcElement == null) event.srcElement = event.target
    let listId = event.srcElement.parentNode.parentNode.getAttribute('data-id')
    pb.boards[listId].name = $(event.srcElement).text()

    sync.save.dirty = true
}