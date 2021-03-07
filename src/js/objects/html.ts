

//Static html elements
let html :{
  textBrdTemplate :HTMLTemplateElement;
  boardBrdTemplate :HTMLTemplateElement;
  listTemplate :HTMLTemplateElement;

  boardAlbum :HTMLElement;
  listAlbum :HTMLElement;
  mainList :HTMLElement;

  loadingIndicator :HTMLElement;
  savingIndicator :HTMLElement;

  header :HTMLElement;

  extrasDialog :HTMLElement;
  extrasTitle :HTMLElement;
  extrasContent :HTMLElement;
  extrasBack :HTMLElement;

  boardTitle :HTMLInputElement;
  boardDescription :HTMLInputElement;

  find :Function;
} = {
  textBrdTemplate: null,
  boardBrdTemplate: null,
  listTemplate: null,

  boardAlbum: null,
  listAlbum: null,
  mainList: null,

  loadingIndicator: null,
  savingIndicator: null,

  header: null,

  extrasDialog: null,
  extrasTitle: null,
  extrasContent: null,
  extrasBack: null,

  boardTitle: null,
  boardDescription: null,


  find(){
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