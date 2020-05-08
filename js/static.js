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