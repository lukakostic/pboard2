
let optionsElement = null


function showOptionsDialog(idEl = null){
    optionsElement = event.srcElement
    if(idEl == null) idEl = event.srcElement.parentNode

    let modal = $('#optionsDialog')
    //modal[0].setAttribute('data-id',idEl.getAttribute('data-id'));
    modal.modal('show')
}

function showBoardExtrasDialog(){
    extrasSelected = findFirstBoardId(optionsElement)
    if(extrasSelected == null)alert('Extras selected is null??')

    showExtras()
}

function showSeeReferencesDialog(){

    hideOptionsDialog()

    let Btn = optionsElement

    if(dataId(Btn.parentNode) == "") return alert('No references')
    let brd = dataId(Btn.parentNode)

    if(brdAttr(brd,'references') == 1) return alert('This is the only reference')

    let listReferences = []

    //go thru every board get references
    let ids = Object.keys(project.boards)

    for(let i = 0; i < ids.length; i++)
        if(project.boards[ids[i]].type == Board.Types.List)
            if(project.boards[ids[i]].content.includes(brd))
                listReferences.push(ids[i])
        
    

    let boardReferences = {}

    //go thru each board, see if it includes any of the listReferences
    for(let i = 0; i < ids.length; i++)
        if(project.boards[ids[i]].type == Board.Types.MultiBoard)
            for(let j = 0; j < listReferences.length; j++)
                if(project.boards[ids[i]].content.includes(listReferences[j]))
                    boardReferences[ids[i]] = null //just some value



    let btnTemplate = templateFChild('referencesDialogBtn')
    let list = EbyId('referencesDialogList')

    //clear previous buttons
    while (list.firstChild) 
        list.removeChild(list.firstChild)
    

    let modal = $('#referencesDialog')
    let brds = Object.keys(boardReferences)

    for(let i = 0; i < brds.length; i++){
        let el = btnTemplate.cloneNode(true)
        //modal[0].appendChild(el);

        list.appendChild(el)

        set_dataId(el, brds[i])

        if(brds[i] == "")
            $(el).text('Main Board')
        else
            $(el).text('List(s) on Board ' + brds[i])
    }

    set_dataId(modal[0], brd)
    modal.modal('show')


}

function hideOptionsDialog(){
    let modal = $('#optionsDialog')
    modal.modal('hide')
}

function removeClicked(){
    let idEl = optionsElement.parentNode
    let isBoard = idEl.classList.contains('board')
    if(isBoard == false) idEl = idEl.parentNode

    let id = dataId(idEl)

    if(brdAttr(id,'references')<=1 && confirm('This is the last reference to this board, really remove it? (Will delete the board)')==false) return

    if(isBoard){
        let ind = elementIndex(idEl)-1

        log('removed ind '+ ind)

        project.boards[dataId(idEl.parentNode)].content.splice(ind,1)
    }else{
        //is List
        //if(board == ""){
        //    delete project.boards[id].attributes['onMain']; 
        //}else{
            let ind = elementIndex(idEl)

            log('removed ind '+ ind)

            project.boards[board()].content.splice(ind,1)
        //}
    }

    project.boards[id].attributes['references']--

    if(project.boards[id].attributes['references']<=0)
        Board.deleteBoardById(id)

    hideOptionsDialog()
    clearLists()
    draw()

    saveAll()
}

function deleteClicked(){
    if(confirm('Really delete this board, all references to it and its content (content will be removed, not deleted)?')==false) return

    let idEl = optionsElement.parentNode
    let isBoard = idEl.classList.contains('board')
    if(isBoard == false) idEl = idEl.parentNode

    let id = dataId(idEl)

    Board.deleteBoardById(id)


    hideOptionsDialog()
    clearLists()
    draw()

    saveAll()
}

function copyIdClicked(){
    let id = dataId(optionsElement.parentNode)
    window.prompt("Copy to clipboard: Ctrl+C, Enter", id)

    hideOptionsDialog();
}


function referencesDialogBtn(){
    showBoardBoardDialog(dataId(event.srcElement))
}