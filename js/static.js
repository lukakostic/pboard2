
//Base site url
let siteUrl = "https://lukakostic.github.io/pboard/"


//Full url
function url(){
    return window.location.href
}
function set_url(value){
    pushBoardHistory(value)
    window.location.href = value
}

//Current board (from url): siteUrl#<boardId>
function board(){
    return boardFromUrl(url())
}
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

function popBoardHistory(){
    return boardHistory.pop()
}

//Static html elements
let static = null // set in ui.js