//Static html elements
let html = {
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

    this.extrasDialog = EbyId('extrasDialog')
    this.extrasTitle = EbyId('extrasTitle')
    this.extrasContent = EbyId('extrasContent')
    this.extrasBack = EbyId('extrasBack')

    this.boardTitle = EbyId('boardTitle')
    this.boardDescription = EbyId('boardDescription')
  }
}