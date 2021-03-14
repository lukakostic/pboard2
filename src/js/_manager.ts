/* Main script tying everything together */

//base site url
let siteUrl :string = "https://lukakostic.github.io/pb/";

//currently open PBoard object
let pb :PBoard = null;

//currently open board id (from url)
let board :string = "";

let currentVersion :number = 3.1;


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
    syncTime: <number> sync.lastSyncTime,  
    pb: <PBoard> pb
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
  
  draw();

  return true;
}