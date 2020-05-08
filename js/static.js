
let web = {

    //Base site url
    siteUrl: "https://lukakostic.github.io/pboard/",

    //Full url
    get url(){
        return window.location.href
    },
    set url(value){
        this.pushBoardHistory(value)
        window.location.href = value
    },

    //Current board (from url): siteUrl#<boardId>
    get board(){
        return getBoardFromUrl(this.url)
    },
    set board(value){
        window.location.hash = value
        newPageOpened()
    },

    //Only board IDs
    boardHistory: [],
    lastBoardHistory(){
        return this.boardHistory.slice(-1)[0]
    },
    //Add board to history, skip if already last
    pushBoardHistory(boardIdOrUrl){
        let bId = this.getBoardFromUrl(boardIdOrUrl)
        if(bId != this.lastBoardHistory())
            this.boardHistory.push(bId)
    },

    //Static html elements
    static: {
        textBrdTemplate : getTemplateFChild('textBoardTemplate'),
        boardBrdTemplate : getTemplateFChild('boardBoardTemplate'),
        listTemplate : getTemplateFChild('listTemplate'),
    
        contentAlbum : EbyId('contentAlbum'),
        mainContentAlbum: EbyId('mainContentAlbum'),
        mainList : EbyId('main-list'),
    
        loadingIndicator : EbyId('loadingIndicator'),
        savingIndicator : EbyId('savingIndicator'),
    
        header : EbyId('header'),
        headerMain : EbyId('headerMain'),
    
        extrasDialog : EbyId('extrasDialog'),
        extrasTitle : EbyId('extrasTitle'),
        extrasContent : EbyId('extrasContent'),
        extrasBack : EbyId('extrasBack'),
    },
  }