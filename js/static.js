/* Commonly used methods (often with side effects) and objects */

//Base site url
let siteUrl = "https://lukakostic.github.io/pboard/"


//Get full url
function url(){
    return window.location.href
}
//Set full url, push to history
function set_url(value){
    pushBoardHistory(value)
    window.location.href = value
}

//Get current board (from url): siteUrl#<boardId>
function board(){
    return boardFromUrl(url())
}
//Set current board, push to history
function set_board(value){
    log("set_board('" + value + "')")
    pushBoardHistory(value)
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
//Go to previous link in history
function popBoardHistory(){
    boardHistory.pop() //pop current
    return boardHistory.pop() //pop before current
}

//Static html elements
let static = {
    find: function(){
        this.textBrdTemplate = templateFChild('textBoardTemplate')
        this.boardBrdTemplate = templateFChild('boardBoardTemplate')
        this.listTemplate = templateFChild('listTemplate')

        this.boardAlbum = EbyId('boardAlbum')
        this.listAlbum = EbyId('listAlbum')
        this.mainList = EbyId('main-list')

        this.loadingIndicator = EbyId('loadingIndicator')
        this.savingIndicator = EbyId('savingIndicator')

        this.header = EbyId('header')
        this.headerMain = EbyId('headerMain')

        this.extrasDialog = EbyId('extrasDialog')
        this.extrasTitle = EbyId('extrasTitle')
        this.extrasContent = EbyId('extrasContent')
        this.extrasBack = EbyId('extrasBack')
    }
}