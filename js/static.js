
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
Object.defineProperty(this, 'static', {
    _static: null,
    get:()=>{
        if(_static == null)
            getStatic()
        return this._static
    },
    set:(value)=>{_static = value}
})

function getStatic(){
    _static = {
        
        htmlBackup: document.createElement('template'),

        textBrdTemplate: templateFChild('textBoardTemplate'),
        boardBrdTemplate: templateFChild('boardBoardTemplate'),
        listTemplate: templateFChild('listTemplate'),

        contentAlbum: EbyId('contentAlbum'),
        mainContentAlbum: EbyId('mainContentAlbum'),
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
    
    _static.htmlBackup.innerHTML = document.body.outerHTML
}