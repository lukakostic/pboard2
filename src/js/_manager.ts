/* Main script tying everything together */

//base site url
let siteUrl :string = "https://lukakostic.github.io/pb/";
if(url().includes("file:///")){ //If local.
  window.location.hash = ""; //so we can get base url
  siteUrl = url();
}

//currently open PBoard object
let pb :PBoard = null;

//currently open board id (from url)
let board :string = "";

let currentVersion :number = 3.1;

console.log(currentVersion," : ", 'Dialogs');  ///Version log and minor version

//Enforce single instance of pboard across tabs?
/*
let singleInstanceHash = null;

function singleInstanceCheck(){
  //Check if only one instance of pboard is open
  if(singleInstanceHash != null){
    let c = getCookie('singleInstanceHash');
    if( c != singleInstanceHash)
      alert('Multiple instances of pboard open, close or the save can get corrupted or data lost. ['+c+']!=['+singleInstanceHash+']');
  }
  singleInstanceHash = Math.random();
  setCookie('singleInstanceHash', singleInstanceHash);
}
*/

//set_board on url change
window.onhashchange = function(){
  set_board(boardFromUrl(url()));
};

//get full url
function url() :string{
  return window.location.href;
}

//set full url, push to history
function set_url(value :string) :void{
  boardHistory.add(value);
  window.location.href = value;
}

//set current board, push to history
function set_board(id :string) :void{
  log("set_board('" + id + "')");
  board = id;
  boardHistory.add(id);
  window.location.hash = id;
  pageOpened();
}


function resetData() :void{
  logw("resetData()");
  pb = new PBoard("", currentVersion);
  //main board
  pb.boards[""] = new Board(BoardType.List,"",[],{references:99999999999,main:true},""); /////////////////TODO change to PBoard ?
  set_board("");
}

function buildPBoard() :string{
  extensions.invoke('buildPBoard');
  let saveFile = {
    syncTime: sync.lastSyncTime,  
    pb: pb
  };
  return JSON.stringify(saveFile);
}

function loadPBoard(content :string, checkTime :boolean = true) :boolean/*successfly loaded?*/ {
  log('content:');
  
  logw(content);

  extensions.invoke('loadPBoard');
  let saveFile = updateSaveFile(JSON.parse(content));
  
  if(checkTime && sync.lastSyncTime != null && sync.lastSyncTime >= saveFile.syncTime)
    return false;
  
  sync.flashLoadingIndicator();

  sync.lastSyncTime = saveFile.syncTime;
  pb = saveFile.pb;
  
  pageOpened();

  return true;
}



//Set attribute of board by id
function set_brdAttr(id :string, attr:string|number, val :any) :void{
  pb.boards[id].attributes[attr] = val;
}

//Set attribute of board by id, if it already doesnt have it
function set_brdAttrIfNull(id :string, attr :string|number, val :any) :boolean{
  if((attr in pb.boards[id].attributes) == false){
      set_brdAttr(id,attr,val);
      return true;
  }
  return false;
}

//Get attribute of board by id
function brdAttr(id :string, attr :string|number) :any{
  return pb.boards[id].attributes[attr];
}

//Get attribute of board by id, or if it doesnt exist return val
function brdAttrOrDef(id :string, attr :string|number, val :any) :any{
  if(attr in pb.boards[id].attributes)
      return brdAttr(id,attr);
  return val;
}


//Delete attribute of board by id
function delBrdAttr(id :string, attr :string|number) :void{
  delete pb.boards[id].attributes[attr];
}