

//Static html elements
let html = {
  textBrdTemplate :HTMLTemplateElement = null,
  boardBrdTemplate :HTMLTemplateElement = null,
  listTemplate :HTMLTemplateElement = null,

  boardAlbum :HTMLElement = null,
  listAlbum :HTMLElement = null,
  mainList :HTMLElement = null,

  loadingIndicator :HTMLElement = null,
  savingIndicator :HTMLElement = null,

  header :HTMLElement = null,

  extrasDialog :HTMLElement = null,
  extrasTitle :HTMLElement = null,
  extrasContent :HTMLElement = null,
  extrasBack :HTMLElement = null,

  boardTitle :HTMLElement = null,
  boardDescription :HTMLElement = null,


  find: function(){
    this.textBrdTemplate = templateFChild('textBoardTemplate');
    this.boardBrdTemplate = templateFChild('boardBoardTemplate');
    this.listTemplate = templateFChild('listTemplate');

    this.boardAlbum = EbyId('boardAlbum');
    this.listAlbum = EbyId('listAlbum');
    this.mainList = EbyId('main-list');

    this.loadingIndicator = EbyId('loadingIndicator');
    this.savingIndicator = EbyId('savingIndicator');

    this.header = EbyId('header');

    this.extrasDialog = EbyId('extrasDialog');
    this.extrasTitle = EbyId('extrasTitle');
    this.extrasContent = EbyId('extrasContent');
    this.extrasBack = EbyId('extrasBack');

    this.boardTitle = EbyId('boardTitle');
    this.boardDescription = EbyId('boardDescription');
  }
}