
function boardTitleChanged(){
    log('board title changed')
    
    project.boards[board].name = event.srcElement.value

    ui.loadAllBoardsByDataId(board)

    sync.save.dirty = true
}

function boardDescriptionChanged(){
    log('board description changed')

    set_brdAttr(board,'description',event.srcElement.value)

    ui.loadAllBoardsByDataId(board)

    sync.save.dirty = true
}

function listTitleChanged(){
    log('list title changed')

    let listId = event.srcElement.parentNode.parentNode.getAttribute('data-id')
    project.boards[listId].name = $(event.srcElement).text()

    sync.save.dirty = true
}