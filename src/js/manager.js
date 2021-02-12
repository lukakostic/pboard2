//@flow

/* Main script tying everything together */

//base site url
let siteUrl = "https://lukakostic.github.io/pboard/"

//currently open PBoard object
let pb = null

//currently open board id (from url)
let board = ""

//Enforce single instance of pboard across tabs?
/*
let singleInstanceHash = null

function singleInstanceCheck(){
  //Check if only one instance of pboard is open
  if(singleInstanceHash != null){
    let c = getCookie('singleInstanceHash')
    if( c != singleInstanceHash)
      alert('Multiple instances of pboard open, close or the save can get corrupted or data lost. ['+c+']!=['+singleInstanceHash+']')
  }
  singleInstanceHash = Math.random()
  setCookie('singleInstanceHash', singleInstanceHash)
}
*/

//set_board on url change
window.onhashchange = function(){
  set_board(boardFromUrl(url()))
}

//get full url
function url(){
  return window.location.href
}

//set full url, push to history
function set_url(value){
  boardHistory.add(value)
  window.location.href = value
}

//set current board, push to history
function set_board(value){
  // $FlowIgnore[extra-arg]
  log("set_board('" + value + "')")
  board = value
  boardHistory.add(value)
  window.location.hash = value
  ui.pageOpened()
}



function resetData(){
  // $FlowIgnore[extra-arg]
  logw("resetData()")
  pb = new PBoard("", currentVersion) //currentVersion in updater.js
  //main board
  pb.boards[""] = new Board(BoardType.List,"",[],{references:99999999999,main:true},"") //////////////////////////////////////// change to ListBoard ?
  set_board("")
}


function buildPBoard(){
  extensions.invoke('buildPBoard')
  let saveFile = {
    syncTime: sync.lastSyncTime,  
    pb: pb,
  }
  return JSON.stringify(saveFile)
}

function loadPBoard(content,checkTime = true){
  // $FlowIgnore[extra-arg]
  log('content:')
  // $FlowIgnore[extra-arg]
  logw(content)

  extensions.invoke('loadPBoard')
  let saveFile = updater.updateSaveFile(JSON.parse(content))
  
  if(checkTime && sync.lastSyncTime != null && sync.lastSyncTime >= saveFile.syncTime)
    return false
  
  sync.flashLoadingIndicator()

  sync.lastSyncTime = saveFile.syncTime
  pb = saveFile.pb
  
  ui.draw()

  return true
}




//Entry point
//Init drive api and listen for signIn changes
function OnStorageLoad(){
  ui.htmlLoaded()

  gapi.load('client:auth2', ()=>{
    gapi.client.init(driveAPI_Creds).then(()=>{
      //Listen for sign in changes and call updateSigninStatus, as well as call the initial one
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
    }, (error)=>{
      // $FlowIgnore[extra-arg]
      alog(error)
      goLogin() //error initing drive, probably not logged in
    })
  })

}

//after Entry point
//Logged in (or not). Lets load everything up!
function updateSigninStatus(isSignedIn){

  if(isSignedIn == false)
    goLogin()
  else{
    
    board = boardFromUrl(url())

    // $FlowIgnore[extra-arg]
    logw('initial reset or load')
    
    if(sync.loadCachedContent() == false) //load from cache or reset
      resetData()
    else ui.pageOpened() //draw cache opened
    

    sync.loadAll() //sync with cloud

    sync.start(false) ///////////////DONT AUTO SAVE/LOAD

  }
}