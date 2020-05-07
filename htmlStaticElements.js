function getStaticHtml(){
    static = {
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
    extrasBack : EbyId('extrasBack')
}}