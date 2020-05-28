/* Main script tying everything together */

//base site url
let siteUrl = "https://lukakostic.github.io/pboard/"

//open Project object
let project = null

//open board id (from url)
let board = ""


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
  log("set_board('" + value + "')")
  board = value
  boardHistory.add(value)
  window.location.hash = value
  ui.pageOpened()
}


function goLogin(){
  set_url(siteUrl + "login/")
}

function goHome(){
  log('goHome')
  set_board("")
}

function goUp(){
  log('goUp')
  //boardHistory.pop() //since last url is yours

  let prev = boardHistory.prev()
  if(prev == null) prev = ""
  set_board(prev)
  //window.history.back();
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
    
    let prevUrl = boardFromUrl(url()) //Save url because resetData resets it, to load after it downloads data

    logw('initial reset or load')

    
    if(sync.loadCachedContent() == false)
      resetData()
    else set_board(prevUrl)
    

    sync.loadAll(function(prevUrl){

      logw("loadAll initial callback: -starting url: " + prevUrl)

      set_board(prevUrl) //go back to previous url
    }.bind(null,prevUrl))

    sync.start()

  }
}





function resetData(){
  logw("resetData()")
  project = new Project("", currentVersion) //currentVersion in updater.js
  //main board
  project.boards[""] = new Board(Board.Types.List,"",[],{references:99999999999,main:true},"") //////////////////////////////////////// change to ListBoard ?
  set_board("")
}


function buildProject(){
  extensions.invoke('buildProject')
  let saveFile = {
    syncTime: sync.lastSyncTime,  
    project: project,
  }
  return JSON.stringify(saveFile)
}

function loadProject(content,checkTime = true){
  extensions.invoke('loadProject')
  let saveFile = updater.updateSaveFile(JSON.parse(content))
  
  if(checkTime && sync.lastSyncTime != null && sync.lastSyncTime >= saveFile.syncTime)
    return false
  
  sync.flashLoadingIndicator()

  sync.lastSyncTime = saveFile.syncTime
  project = saveFile.project
  
  return true
}



function newText(event){
  
  if(event.srcElement == null) event.srcElement = event.target
  let parent = event.srcElement.parentNode.parentNode.parentNode ////////////// replace by find parent thing?

  let el = static.textBrdTemplate.cloneNode(true)

  let brd = new Board(Board.Types.Text,"Text","",{references:1})

  project.boards[brd.id] = brd
  project.boards[dataId(parent)].content.push(brd.id) //Add to parent list

  parent.appendChild(el)
  ui.loadTextBoard(el,brd.id)

  EbyClass('textBtn',el)[0].click() ////////////////////////// auto open

  ui.fixListUI(parent)
  sync.saveAll()
}

function newBoard(event){

  if(event.srcElement == null) event.srcElement = event.target
  let parent = event.srcElement.parentNode.parentNode.parentNode ////////////// replace by find parent thing?

  let el = static.boardBrdTemplate.cloneNode(true)

  let atr = {description:'Description',references:1}
  let brd = new Board(Board.Types.Board,"Board",[],atr)

  project.boards[brd.id] = brd
  project.boards[dataId(parent)].content.push(brd.id) //Add to parent list

  parent.appendChild(el)
  ui.loadBoardBoard(el,brd.id)

  
  ui.fixListUI(parent)

  EbyClass('textBtn', el)[0].click() // load board on add, might not want to do this.

  sync.saveAll(()=>{
    //el.getElementsByClassName('textBtn')[0].click(); // load board on add, might not want to do this. and to be moved to before saving?
  })
}

function newList(event){

  let el = static.listTemplate.cloneNode(true)

  if(event.srcElement == null) event.srcElement = event.target
  let inp = event.srcElement.firstElementChild
  let name = inp.value

  let titleText = EbyClass('title-text',el)[0]
//  $(titleText).val(name);
  $(titleText).html(name) //we assume its div at start
  //$(titleText).prop("readonly",true);
  titleText.addEventListener('click',listTitleClicked,true)
  titleText.onblur = (event)=>{listTitleBlur(event)}

  let brd = new Board(Board.Types.List,name,[],{references:1})
  project.boards[brd.id] = brd
  project.boards[board].content.push(brd.id)

  static.boardAlbum.appendChild(el)
  set_dataId(el, brd.id)

  
  ui.fixNewListUI()
  ui.fixAlbumUI()

  ui.makeDraggable() //should only make draggable new list and not all?
  $(inp).val('') //clear new list textbox

  sync.saveAll()
}