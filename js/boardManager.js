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

let storage = null; //drive api, set after loading drive api


function OnStorageLoad(){
    //Load drive api
    gapi.load('client:auth2', ()=>{
      gapi.client.init({
              apiKey: 'AIzaSyDXQ9Z_V5TSX-yepF3DYKVjTIWVwpwuoXU',
              clientId: '644898318398-d8rbskiha2obkrrdfjf99qcg773n789i.apps.googleusercontent.com',
              discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
              scope: 'https://www.googleapis.com/auth/drive.metadata.readonly' //space separated
          }).then(()=>{
              // Listen for sign-in state changes.
              gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          
              // Handle the initial sign-in state.
              updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          }, function(error) {
              alert(JSON.stringify(error, null, 2));
              goLogin();
          });
  });


}

function updateSigninStatus(isSignedIn){
  

  if(isSignedIn == false)
    goLogin();
  else{
    
    //if != null : already loaded, connection regained. Refresh page?

    if(storage == null){
      storage = new StorageManager();
      
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

  }
}

function goLogin(){
  window.location.href = siteUrl + "login/";
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

    storage.fileUpload({ path: '/', name: 'pboard.pb', contents: contents},()=>{
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
    
      storage.fileDownload( '/' + 'pboard.pb' ,function loaded(contents){

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