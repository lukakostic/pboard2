let project

let extensionListeners = //arrays of callbacks
{
  newPage: [],
  pre_newPage: [],
  saveAll: [],
  pre_saveAll: [],
  loadAll: [],
  pre_loadAll: [],
  reloadHTML: [],
  draw: [],
}

let autosave = null //interval, set after loading settings.
let textSave = false //text changed, save

//Entry point
//Init drive api and listen for signIn changes
function OnStorageLoad(){
    gapi.load('client:auth2', ()=>{
      gapi.client.init(driveAPI_Creds).then(()=>{
        //Listen for sign in changes and call updateSigninStatus, as well as call the initial one
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
      }, (error)=>{
        log(error)
        goLogin() //error initing drive, probably not logged in
      })
  })

}

//after Entry point
//Logged in (or not). Lets load everything up!
function updateSigninStatus(isSignedIn){
  log('logged in: ' + isSignedIn)

  if(isSignedIn == false)
    goLogin()
  else{
    
    log('sending',1)
    gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)"
    }).then((response)=>{
      log('response',1)
      log(response.result.files)
    })
    log('sent',1)
    
    resetData()
    loadAll(()=>{
      pageOpened()
    })
    autosave = setInterval(()=>{
      if(textSave){
          textSave = false
          saveAll()
      }
    }, project.preferences['textEditorAutoSaveInterval']*1000)

  }
}

function goLogin(){
  set_url(siteUrl + "login/")
}


function invokeListeners(listener = ""){
  for(let i = 0; i < extensionListeners[listener].length; i++){
    if(extensionListeners[listener]) extensionListeners[listener][i]()
  }
  extensionListeners[listener] = []
}


function load(content){
  project = updateProject(JSON.parse(content))
}

function loadFromContent(content){
  resetData()
  load(content)
  pageOpened()
}

function resetData(){
  project = new Project("", curVer)
  //main board
  project.boards[""] = new Board(boardTypes.List,"",[],{references:99999999999,main:true},"") //////////////////////////////////////// change to ListBoard ?
  set_board("")
}

function saveAll(callback = null) {
  try{ 

    invokeListeners('pre_saveAll')
    startSavingIndicator()

    let contents = buildProject()

    storage.fileUpload({name: 'pboard.pb', contents: contents},()=>{

      if(callback!=null) callback()
      stopSavingIndicator()
      invokeListeners('saveAll')
    
    },(msg)=>{ log(msg) })

  }catch(e){ log(e) }
}

function buildProject(){
  return JSON.stringify(project)
}

function loadAll(callback = null) {
    try{

      invokeListeners('pre_loadAll')
      storage.fileDownload('pboard.pb' , (contents)=>{

      if (contents != null) {
        
        load(contents)
        invokeListeners('loadAll')
    
      }
      else resetData() 
        
      if(callback) callback()

    },(msg)=>{ log(msg) })

  }catch(e){ log(e) }
}

function newText(){
  
  let parent = event.srcElement.parentNode.parentNode.parentNode ////////////// replace by find parent thing?

  let el = static.textBrdTemplate.cloneNode(true)

  let brd = new Board(boardTypes.Text,"Text","",{references:1})

  project.boards[brd.id] = brd
  project.boards[dataId(parent)].content.push(brd.id) //Add to parent list

  parent.appendChild(el)
  loadTextBoard(el,brd.id)

  el.getElementsByClassName('textBtn')[0].click() ////////////////////////// auto open

  fixListUI(parent)
  saveAll()
}

function newBoard(){

  let parent = event.srcElement.parentNode.parentNode.parentNode ////////////// replace by find parent thing?

  let el = static.boardBrdTemplate.cloneNode(true)

  let atr = {description:'Description',references:1}
  let brd = new Board(boardTypes.Board,"Board",[],atr)

  project.boards[brd.id] = brd
  project.boards[dataId(parent)].content.push(brd.id) //Add to parent list

  parent.appendChild(el)
  loadBoardBoard(el,brd.id)

  
  fixListUI(parent)

  el.getElementsByClassName('textBtn')[0].click() // load board on add, might not want to do this.

  saveAll(()=>{
    //el.getElementsByClassName('textBtn')[0].click(); // load board on add, might not want to do this. and to be moved to before saving?
  })
}

function newList(){

  let el = static.listTemplate.cloneNode(true)

  let inp = event.srcElement.firstElementChild
  let name = inp.value

  let titleText = el.getElementsByClassName("title-text")[0]
//  $(titleText).val(name);
  $(titleText).html(name) //we assume its div at start
  //$(titleText).prop("readonly",true);
  titleText.addEventListener('click',listTitleClicked,true)
  titleText.onblur = ()=>{listTitleBlur()}

  let brd = new Board(boardTypes.List,name,[],{references:1})
  project.boards[brd.id] = brd
  project.boards[board].content.push(brd.id)

  static.contentAlbum.appendChild(el)
  set_dataId(el, brd.id)

  
  fixNewListUI()
  fixAlbumUI()

  makeDraggable()
  $(inp).val('') //clear new list textbox

  saveAll()
}