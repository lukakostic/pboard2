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
function set_board(value /*id*/:string) :void{
  log("set_board('" + value + "')");
  board = value;
  boardHistory.add(value);
  window.location.hash = value;
  pageOpened();
}



function resetData() :void{
  logw("resetData()");
  pb = new PBoard("", currentVersion); //currentVersion in updater.js
  //main board
  pb.boards[""] = new Board(BoardType.List,"",[],{references:99999999999,main:true},""); //////////////////////////////////////// change to ListBoard ?
  set_board("");
}

function buildPBoard() :string{
  extensions.invoke('buildPBoard');
  let saveFile :{
    syncTime :number;
    pb: PBoard;
  } = {
    syncTime: sync.lastSyncTime,  
    pb: pb
  };
  return JSON.stringify(saveFile);
}

function loadPBoard(content :string, checkTime :boolean = true) :boolean/*successfly loaded?*/ {
  
  log('content:');
  
  logw(content);

  extensions.invoke('loadPBoard');
  let saveFile = updater.updateSaveFile(JSON.parse(content));
  
  if(checkTime && sync.lastSyncTime != null && sync.lastSyncTime >= saveFile.syncTime)
    return false;
  
  sync.flashLoadingIndicator();

  sync.lastSyncTime = saveFile.syncTime;
  pb = saveFile.pb;
  
  draw();

  return true;
}




//Entry point
//Init drive api and listen for signIn changes
function OnStorageLoad() :void{
  htmlLoaded();

  gapi.load('client:auth2', ()=>{
    gapi.client.init(driveAPI_Creds).then(()=>{
      //Listen for sign in changes and call updateSigninStatus, as well as call the initial one
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, (error)=>{
      
      alog(error);
      goLogin(); //error initing drive, probably not logged in
    });
  });

}

//after Entry point
//Logged in (or not). Lets load everything up!
function updateSigninStatus(isSignedIn :boolean) :void{

  if(isSignedIn == false)
    goLogin();
  else{
    
    board = boardFromUrl(url());

    
    logw('initial reset or load');
    
    if(sync.loadCachedContent() == false) //load from cache or reset
      resetData();
    else
      pageOpened(); //draw cache opened
    

    sync.loadAll(); //sync with cloud

    sync.start(false); ///////////////DONT AUTO SAVE/LOAD

  }
}