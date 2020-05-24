
let dragOld, dragNew, dragItem, oldDragIndex, newDragIndex

let singleInstanceHash = null

//UI calculations, singleInstance check
let autoUI = 
setInterval(()=>{
  //Fix this piece of shit mobile web dev crap
  document.body.style.setProperty("width","100vw")

  //Resize main board so it doesnt take whole screen width, rather just the middle 'document' area
  //Makes it easier to focus and see the boards than if they are spread thru whole width
  if(window.innerWidth>1250)
    static.listAlbum.style.width = '1250px'
  else
    static.listAlbum.style.width = '100%'

    //Make tab title same as board name
    if(project != null){ //If loaded
    let brdName = project.boards[board()].name
    if(brdName == "") brdName = "PBoard"
    else brdName += " - PBoard"
    document.title = brdName
    }

    //Check if only one instance of pboard is open
    if(singleInstanceHash != null){
      let c = getCookie('singleInstanceHash')
      if( c != singleInstanceHash)
        alert('Multiple instances of pboard open, close or the save can get corrupted or data lost. ['+c+']!=['+singleInstanceHash+']')
    }
    singleInstanceHash = Math.random()
    setCookie('singleInstanceHash', singleInstanceHash)

},100)


//Auto load on url change
window.onhashchange = function(){set_board(board())}

/*
function reloadHTML(){
  
  document.body.outerHTML = static.htmlBackup.innerHTML
  uiToFunctions() //set home and up btns

  invokeListeners('reloadHTML')
    
}
*/
function htmlLoaded(){
  static = {
    textBrdTemplate: templateFChild('textBoardTemplate'),
    boardBrdTemplate: templateFChild('boardBoardTemplate'),
    listTemplate: templateFChild('listTemplate'),

    boardAlbum: EbyId('boardAlbum'),
    listAlbum: EbyId('listAlbum'),
    mainList: EbyId('main-list'),

    loadingIndicator: EbyId('loadingIndicator'),
    savingIndicator: EbyId('savingIndicator'),

    header: EbyId('header'),
    headerMain: EbyId('headerMain'),

    extrasDialog: EbyId('extrasDialog'),
    extrasTitle: EbyId('extrasTitle'),
    extrasContent: EbyId('extrasContent'),
    extrasBack: EbyId('extrasBack'),
  }

  EbyId('homeBtn').onclick = home
  EbyId('upBtn').onclick = up
  //EbyId('convertBtn').onclick = ConvertBoard;
  //EbyId('saveBtn').onclick = SaveAll;
  //EbyId('loadBtn').onclick = LoadAll;

  //static.loadingIndicator.style.display = 'none'
}

function pageOpened(){
  log("pageOpened()")

  invokeListeners('pre_newPage')

  //reloadHTML()


  
  if(board() == ""){
    static.header.style.display = 'none'
    static.headerMain.style.display = 'block'
  }else{
    static.header.style.display = 'block'
    static.headerMain.style.display = 'none'
  }

  //clearBoards()
  //clearLists()
  draw()

  invokeListeners('newPage')

  executeExtensions()
}

function executeExtensions(){
  log('executeExtensions()')
  let extensions = brdAttrOrDef(board(),'extensions',[])
  for(let i = 0; i < extensions.length; i++){
    if(extensions[i].on){
      log('executing extension ' + extensions[i].id)
      eval(project.extensions[extensions[i].id].code)
    }
  }
}

function loadBoardBackgroundImage(){
  let brdEl = EbyId('main')
  
  brdEl.style.backgroundImage = "url('"+brdAttr(board(),'background')+"')"
  brdEl.style.repeatMode = "no-repeat"
  brdEl.style.backgroundSize = "cover"
}



function startSavingIndicator(){
  static.savingIndicator.style.display = 'block'
}
function stopSavingIndicator(){
  static.savingIndicator.style.display = 'none'
}

function startLoadingIndicator(){
  static.loadingIndicator.style.display = 'block'
}
function stopLoadingIndicator(){
  static.loadingIndicator.style.display = 'none'
}

function expandInputAll(){
  let expandoInputs = EbyClass('expandInput')
  for (let i = 0; i < expandoInputs.length; i++)
    expandInput(expandoInputs[i])
}

function expandInput(el){
  el.style.height = '1px'
  el.style.height = (1+el.scrollHeight)+'px'
  el.parentNode.style.height = el.style.height
}

function clearLists(){
  log('clearLists()')
  let lists = EbyClass('list')
    
  for(let j = lists.length-1; j > -1; j--)
    if (lists[j].id == "")
      $(lists[j]).remove()
  
}

function makeDraggable(){

  //make boards draggable
  $('.draggableList').sortable({
    items: '.draggable',
    start: (event, ui)=>{
      log('drag start')
        dragItem = ui.item
        oldDragIndex = elementIndex(dragItem[0])
        dragNew = dragOld = ui.item.parent()
    },
    stop: (event, ui)=>{
      log('drag stop')
      //With a delay so that dragging a board doesnt click its button at end
      setTimeout(()=>{
        //actually move the board
        newDragIndex = elementIndex(dragItem[0])

        
          project.boards[dataId(dragOld[0])].content.splice(oldDragIndex-1,1)
          project.boards[dataId(dragNew[0])].content.splice(newDragIndex-1,0,dataId(dragItem[0]))
        
        dragItem = null
        saveAll()

      },50)
    },
    change: (event, ui)=>{  
      log('drag change')
        if(ui.sender) dragNew = ui.placeholder.parent()
        fixListUI(dragNew[0])
    },
    connectWith: ".draggableList"
}).disableSelection()



  //make lists draggable
  $('.draggableAlbum').sortable({
    items: '.draggableList',
    start: (event, ui)=>{
      log('drag list start')
        dragItem = ui.item
        oldDragIndex = elementIndex(dragItem[0])
    },
    stop: (event, ui)=>{
      log('drag list stop')
      //With a delay so that dragging a board doesnt click its button at end
      setTimeout(()=>{
        //actually move the board
        newDragIndex = elementIndex(dragItem[0])

        
          project.boards[board()].content.splice(oldDragIndex,1)
          project.boards[board()].content.splice(newDragIndex,0,dataId(dragItem[0]))
        
        dragItem = null
        saveAll()

      },50)
    },
    change: (event, ui)=>{
      log('drag list change')
      //if(ui.sender) dragNew = ui.placeholder.parent();
        
      //fixNewListUI();
    }
}).disableSelection()

/*
$(".textBtn").each(function() {

  this.addEventListener("mousedown", function(t) {
    $(this.parentNode).trigger("mousedown",t);
    $(this.parentNode).trigger("onmousedown",t);
  },true);
  this.addEventListener("mouseup", function(t) {
    $(this.parentNode).trigger("mouseup",t);
    $(this.parentNode).trigger("onmouseup",t);
  },true);
  
  this.addEventListener("onmousedown", function(t) {
    $(this.parentNode).trigger("mousedown",t);
    $(this.parentNode).trigger("onmousedown",t);
  },true);
  this.addEventListener("onmouseup", function(t) {
    $(this.parentNode).trigger("mouseup",t);
    $(this.parentNode).trigger("onmouseup",t);
  },true);

});
*/
}

function draw(){
  log('draw()')
  if(board()!="") drawBoard()
  else drawMain()

  loadBoardBackgroundImage()
  makeDraggable()

  setTimeout(()=>{expandInputAll()},200)
  setTimeout(()=>{expandInputAll()},1000)
}
  
function clearBoards(lst = null) {
  log('clearBoards(',lst,')')

  let lists = [lst]
  if(lst == null) lists = qSelAll('.list:not([id])')

  logw('lists', lists)
  
  for(let j = 0; j < lists.length; j++){

    let boards = qSelAll('.board:not([id])',lists[j])//lists[j].childNodes
    for (let i = boards.length-1; i > -1; i--)
      $(boards[i]).remove()
    

  }
}

function fixListUI(listEl=null){
  if(listEl!=null){
    let newPanel = EbyClass('newPanel',listEl)[0]
    newPanel.parentNode.appendChild(newPanel)
  }else{
    let album = fixAlbumUI()
    let lists = EbyClass('list', album)[0]
    for(let i = 0; i<lists.length; i++)
      if(lists[i].id=="") fixListUI(lists[i])
    
  }
}

function fixNewListUI(){
  let newlist = EbyId('newlist')
  newlist.parentNode.appendChild(newlist)
}

function fixAlbumUI(){
  let album = EbyId('boardAlbum')
  let columnWidth = 310 //px //300 + 5*2 margin
  if(album){
    album.style.setProperty('width',((columnWidth*album.childElementCount)+10 + 8).toString() + 'px') //add some space for album pad (2 * 5px atm) + some extra just in case
    
    return album
  }
  return null
}

function drawBoard(){
log('drawBoard()')
  static.listAlbum.classList.add('d-none')
  static.boardAlbum.classList.remove('d-none')
  
  clearLists()
  //clearBoards()

  EbyId('boardTitle').value = project.boards[board()].name
  EbyId('boardDescription').value = brdAttr(board(),'description')


  //fill lists & boards
  for(let l = 0; l < project.boards[board()].content.length; l++){

    let listEl = static.listTemplate.cloneNode(true)
    static.boardAlbum.appendChild(listEl)

    
    loadList(listEl,project.boards[board()].content[l])

    

  }

  
  EbyId('boardTitle').select() //autopop

  fixAlbumUI()
  fixNewListUI()
}

function drawMain(){
  log('drawMain()')
  static.boardAlbum.classList.add('d-none')
  static.listAlbum.classList.remove('d-none')

  clearBoards(static.mainList)

  loadList(static.mainList,"")

  

  /*
  let ids = Object.keys(project.boards);
  //fill boards
  for(let i = 0; i < ids.length; i++){
    if(project.boards[ids[i]].attributes['onMain'] == true){
      if(project.boards[ids[i]].type == Board.Types.Text){

        let el = static.textBrdTemplate.cloneNode(true);
        static.mainList.appendChild(el);
        loadTextBoard(el,project.boards[ids[i]]);
      
      }else if(project.boards[ids[i]].type == Board.Types.Board){

        let el = static.boardBrdTemplate.cloneNode(true);
        static.mainList.appendChild(el);
        loadBoardBoard(el,project.boards[ids[i]]);

      }
      
    }
  }
  */
  fixListUI(static.mainList)
}


function loadTextBoard(textBoardEl, brd){
  log('loadTextBoard(',textBoardEl,"'"+JSON.stringify(brd)+"'",')')

  if (typeof brd === 'string' || brd instanceof String)
  brd = project.boards[brd]

  set_dataId(textBoardEl, brd.id)

  $(EbyClass('textBtn',textBoardEl)[0]).contents()[1].nodeValue = brd.name
  
  if(brd.content.length>0) 
    EbyClass('descriptionIcon', textBoardEl)[0].classList.remove('d-none')
  else 
    EbyClass('descriptionIcon', textBoardEl)[0].classList.add('d-none')

  loadBackground(textBoardEl,brd.id)
}

function loadBackground(brdEl, id){
  brdEl.style.backgroundImage = "url('"+brdAttr(id,'background')+"')"
  brdEl.style.repeatMode = "no-repeat"
  brdEl.style.backgroundSize = "cover"
}

function loadBoardBoard(boardBoardEl, brd){
  log('loadBoardBoard(',boardBoardEl,"'"+JSON.stringify(brd)+"'",')')

  if (typeof brd === 'string' || brd instanceof String)
    brd = project.boards[brd]

  set_dataId(boardBoardEl, brd.id)
  $(EbyClass('textBtn',boardBoardEl)[0]).contents()[0].nodeValue = brd.name

  loadBackground(boardBoardEl, brd.id)
}

function loadList(listEl, brd){
  log('loadList(',listEl,"'"+JSON.stringify(brd)+"'",')')

  if (typeof brd === 'string' || brd instanceof String)
    brd = project.boards[brd]

  titleText = EbyClass('title-text',listEl)[0]

  //could cause issues with main board (probably not)?
  //can only be blur while as input, so turn to div
  //  titleText.outerHTML = titleText.outerHTML.replace('<input','<div').replace('</input>','</div>');
  //  titleText.onclick = ()=>{listTitleClicked(this)};
  //  titleText.onblur = null;


  titleText.addEventListener('click',listTitleClicked,true)
  titleText.onblur = ()=>{ listTitleBlur() }

//  $(titleText).val(brd.name);
  $(titleText).html(brd.name) //we assume its div at start
//  $(titleText).prop("readonly",true);
  set_dataId(listEl, brd.id)

  
  
  for(let i = 0; i < brd.content.length; i++){
    let brd2 = project.boards[brd.content[i]]
    if(brd2.type == Board.Types.Text){

      let el = static.textBrdTemplate.cloneNode(true)
      listEl.appendChild(el)
      loadTextBoard(el,brd2)
    
    }else if(brd2.type == Board.Types.Board){

      let el = static.boardBrdTemplate.cloneNode(true)
      listEl.appendChild(el)
      loadBoardBoard(el,brd2)

    }
  }
  fixListUI(listEl)

}

function loadAllBoardsByDataId(brdId){
  let boardEls = EbyClass('board')

  for(let i = 0; i < boardEls.length; i++)
      if(dataId(boardEls[i])==brdId){
          if(project.boards[brdId].type == Board.Types.Text)
           loadTextBoard(boardEls[i],brdId)
          else if(project.boards[brdId].type == Board.Types.Board)
           loadBoardBoard(boardEls[i],brdId)
      }
  
}

function home(){
  log('home')
  set_board("")
}

function up(){
  log('up')
  //boardHistory.pop() //since last url is yours

  let prev = popBoardHistory()
  if(prev == null) prev = ""
  set_board(prev)
  //window.history.back();
}