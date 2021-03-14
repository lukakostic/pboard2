

//Static html elements
let html :{
  //textBrdTemplate :HTMLTemplateElement;
  //boardBrdTemplate :HTMLTemplateElement;
  //listTemplate :HTMLTemplateElement;

  //boardAlbum :HTMLElement;
  //listAlbum :HTMLElement;
  //mainList :HTMLElement;

  list2Template:HTMLTemplateElement; /* rename to listTemplate after removing references to old one */
  tileTemplate :HTMLTemplateElement;

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
  //textBrdTemplate: null,
  //boardBrdTemplate: null,
  //listTemplate: null,

  //boardAlbum: null,

  //listAlbum: null,
  //mainList: null,

  list2Template: null, /* rename to listTemplate after removing references to old one */
  tileTemplate: null,

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
    /*
    this.textBrdTemplate = templateFChild('text-template');
    this.boardBrdTemplate = templateFChild('board-template');
    this.listTemplate = templateFChild('list-template');

    this.boardAlbum = EbyId('multi-list-board');

    this.listAlbum = EbyId('single-list-board');
    this.mainList = EbyId('main-list');
    */

    this.tileTemplate = templateFChild('tile-template');

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