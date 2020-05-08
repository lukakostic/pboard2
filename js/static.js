//Base site url
let siteUrl = "https://lukakostic.github.io/pboard/"


//Full url
function url(){
    return window.location.href
}
function setUrl(value){
    pushBoardHistory(value)
    window.location.href = value
}

//Current board (from url): siteUrl#<boardId>
function board(){
    return boardFromUrl(url())
}
function setBoard(value){
    window.location.hash = value
    pageOpened()
}

//Only board IDs
let boardHistory = []
function lastBoardHistory(){
    return boardHistory.slice(-1)[0]
}
//Add board to history, skip if already last
function pushBoardHistory(boardIdOrUrl){
    let bId = boardFromUrl(boardIdOrUrl)
    if(bId != lastBoardHistory())
        boardHistory.push(bId)
}

//Static html elements
let static = {
    get textBrdTemplate(){return getTemplateFChild('textBoardTemplate')},
    get boardBrdTemplate(){return getTemplateFChild('boardBoardTemplate')},
    get listTemplate(){return getTemplateFChild('listTemplate')},

    get contentAlbum(){return EbyId('contentAlbum')},
    get mainContentAlbum(){return EbyId('mainContentAlbum')},
    get mainList(){return EbyId('main-list')},

    get loadingIndicator(){return EbyId('loadingIndicator')},
    get savingIndicator(){return EbyId('savingIndicator')},

    get header(){return EbyId('header')},
    get headerMain(){return EbyId('headerMain')},

    get extrasDialog(){return EbyId('extrasDialog')},
    get extrasTitle(){return EbyId('extrasTitle')},
    get extrasContent(){return EbyId('extrasContent')},
    get extrasBack(){return EbyId('extrasBack')},
}