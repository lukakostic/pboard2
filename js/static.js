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
let static = null
function setStaticHtml(){
    static = {
        textBrdTemplate: templateFChild('textBoardTemplate'),
        boardBrdTemplate: templateFChild('boardBoardTemplate'),
        listTemplate: templateFChild('listTemplate'),

        boardAlbum: EbyId('boardAlbum'),
        listAlbum: EbyId('listAlbum'),
        mainList: EbyId('main-list'),

        loadingIndicator: EbyId('loadingIndicator'),
        savingIndicator: EbyId('savingIndicator'),

        header: EbyId('header'),
        headerMain: EbyId('headerMain'),

        extrasDialog: EbyId('extrasDialog'),
        extrasTitle: EbyId('extrasTitle'),
        extrasContent: EbyId('extrasContent'),
        extrasBack: EbyId('extrasBack'),
    }
}