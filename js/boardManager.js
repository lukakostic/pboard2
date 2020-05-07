let url = window.location.href;

let historyStack = [];
let project,board; //project.boards = hashmap of all board objects: [id]:board, board = current id

let extensionListeners = {
  newPage: [],
  pre_newPage: [],
  saveAll: [],
  pre_saveAll: [],
  loadAll: [],
  pre_loadAll: [],
  reloadHTML: [],
  draw: []
};

let static = {};

let htmlBackup = document.createElement('template');
htmlBackup.innerHTML = document.body.outerHTML;


let textSave = false;
let autosave = null; //interval, set after loading settings.

function OnStorageLoad(){
  let storage = new StorageManager(); //DropboxManager.fromUrl(url);

  if(storage == null){
    window.location.href = siteUrl + "login/";
    return;
  }

  
  resetData();

  loadAll(()=>{
    newPageOpened();
  });

  autosave = setInterval(()=>{
    if(textSave){
        textSave = false;
        saveAll();
    }
  },project.preferences['textEditorAutoSaveInterval']*1000);
}


function invokeListeners(listener = ""){
  
  for(let i = 0; i < extensionListeners[listener].length; i++){
    if(extensionListeners[listener]) extensionListeners[listener][i]();
  }
  extensionListeners[listener] = [];
}

function urlFromBoardId(boardId){
  return siteUrl + "#" + boardId;
}

function load(content){
  project = updateProject(JSON.parse(content));
}

function loadFromContent(content){
  resetData();
  load(content);
  newPageOpened();
}

function loadURL(newUrl, forceRefresh = false){
  url = newUrl;
  window.location.hash = getHashFromUrl(url);
  if(forceRefresh) window.location.href = url;
  else{
    newPageOpened();
  }
}

function loadBoardId(boardToLoad, forceRefresh = false){
  loadURL(urlFromBoardId(boardToLoad, forceRefresh));
}

function resetData(){
  project = new Project("", curVer);
  //main board
  project.boards[""] = new Board(boardTypes.List,"",[],{references:99999999999,main:true},""); //////////////////////////////////////// change to ListBoard ?
  board = "";
}

function saveAll(callback = null, log = null) {
  try{ 
    invokeListeners('pre_saveAll');

    startSavingIndicator();

    let contents = buildProject();

    storage.filesUpload({ path: '/' + 'pboard.pb', contents: contents , mode:'overwrite'},()=>{
      if(callback!=null) callback();
      stopSavingIndicator();
    
      invokeListeners('saveAll');
    
    },
    (msg)=>{
      if(msg.type == 'error') bootbox.alert(JSON.stringify(msg.msg));
      if(log)log(msg);
    });

    
  }catch(e){bootbox.alert(e.message);}
}

function buildProject(){
  return JSON.stringify(project);
}

function loadAll(callback = null, log = null) {
    try{

      invokeListeners('pre_loadAll');
    
      storage.filesDownload({ path: '/' + 'pboard.pb' },function loaded(contents){

      if (contents != null) {
        
        load(contents);
    
        invokeListeners('loadAll');
    
        //bootbox.alert(contents);
      }else{
        resetData();
      }
        
      if(callback) callback();

    },
    (msg)=>{
      if(msg.type == 'error') bootbox.alert(JSON.stringify(msg.msg) + '');
      if(log)log(msg);
    });

  }catch(e){bootbox.alert(e.message);}
}

function newText(){
  
  let parent = event.srcElement.parentNode.parentNode.parentNode; ////////////// replace by find parent thing?

  let el = static.textBrdTemplate.cloneNode(true);

  let brd = new Board(boardTypes.Text,"Text","",{references:1});

  project.boards[brd.id]=brd;
  project.boards[getDataId(parent)].content.push(brd.id); //Add to parent list

  parent.appendChild(el);
  loadTextBoard(el,brd.id);

  el.getElementsByClassName('textBtn')[0].click(); ////////////////////////// auto open

  fixListUI(parent);
  saveAll();
}

function newBoard(){

  let parent = event.srcElement.parentNode.parentNode.parentNode; ////////////// replace by find parent thing?

  let el = static.boardBrdTemplate.cloneNode(true);

  let atr = {description:'Description',references:1};
  let brd = new Board(boardTypes.Board,"Board",[],atr);

  project.boards[brd.id]=brd;
  project.boards[getDataId(parent)].content.push(brd.id); //Add to parent list

  parent.appendChild(el);
  loadBoardBoard(el,brd.id);

  
  fixListUI(parent);

  el.getElementsByClassName('textBtn')[0].click(); // load board on add, might not want to do this.

  saveAll(()=>{
    //el.getElementsByClassName('textBtn')[0].click(); // load board on add, might not want to do this. and to be moved to before saving?
  });
}

function newList(){

  let el = static.listTemplate.cloneNode(true);

  let inp = event.srcElement.firstElementChild;
  let name = inp.value;

  let titleText = el.getElementsByClassName("title-text")[0];
//  $(titleText).val(name);
  $(titleText).html(name); //we assume its div at start
  //$(titleText).prop("readonly",true);
  titleText.addEventListener('click',listTitleClicked,true);
  titleText.onblur = ()=>{listTitleBlur();};

  let brd = new Board(boardTypes.List,name,[],{references:1});
  project.boards[brd.id]=brd;
  project.boards[board].content.push(brd.id);

  static.contentAlbum.appendChild(el);
  setDataId(el, brd.id);

  
  fixNewListUI();
  fixAlbumUI();

  makeDraggable();
  $(inp).val(''); //clear new list textbox

  saveAll();
}