
let pb :PBoard = null; //currently open PBoard
let board :string = ""; //currently open board (id)


window.addEventListener('error',(error)=>
alert("!!ERROR!!\n\n"+error.message));




//Enforce single instance of pboard across tabs? How to sync them? How to sync across 2 open-at-same-time devices?
/*
let singleInstanceHash = null;

setInterval(()=>{
  //singleInstanceCheck()////////////
},500);

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




function moveBoards(
  fromId:string, fromIndex:number,
  toId:string, toIndex:number,
  length:number = 1,
  updateBoards = true
){
  let boards = pb.boards[fromId].content.splice(fromIndex,length);
  pb.boards[toId].content.splice(toIndex,0, ...boards);

  if(updateBoards) boardsUpdated(UpdateSaveType.SaveNow);
}



//~~~~~~~~~~~~~~~~~~~~~~~~~ Board attribute ops {
//Setters:
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

//Getters:
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

//Delete attribute:
function delBrdAttr(id :string, attr :string|number) :void{
  delete pb.boards[id].attributes[attr];
}

//~~~~~~~~~~~~~~~~~~~~~~~~~ Board attribute ops }


//set currently open board, push to history
function set_board(id :string) :void{
  dbg("set_board('%s')",id);
  board = id;
  boardHistory.add(id);
  window.location.hash = id;
  draw();
  navigation.focus(header.headerTitle, true);
}
 
//Load from either saveFile or JSON format
function loadSaveFile(saveFile :SaveFile|string, checkTime :boolean = true) :boolean/*successfly loaded?*/ {

  if(typeof saveFile === 'string')
    saveFile = JSON.parse(saveFile) as SaveFile;

  console.debug('loadSaveFile',saveFile);
  extensions.invoke('loadSaveFile');

  saveFile = updateSaveFile(saveFile);
  if(saveFile === null) return false; //outdated
  
  if(checkTime && sync.lastSyncTime != null && sync.lastSyncTime >= saveFile.syncTime) //old, we have newer
    return false;
  
  sync.flashLoadingIndicator();

  sync.lastSyncTime = saveFile.syncTime;
  pb = saveFile.pb;
  
  draw();
  
  return true;
}

function resetPB() :void{
  console.debug("resetPB()");
  pb = new PBoard("", currentVersion);
  pb.boards[""] = new Board(BoardType.List,"",[],{},"");  //main board
  set_board("");
}


function buildPBoard() :string{
  extensions.invoke('buildPBoard');
  let saveFile :SaveFile = {
    syncTime: sync.lastSyncTime,  
    pb: pb
  };
  return JSON.stringify(saveFile);
}


function openBoard(id :string, view :View) :void{
  //console.log("board of id: " + id + " clicked");

  //// For textual open textDialog by id (you just pass id to open it! )
  if(pb.boards[id].type == BoardType.Text){
     openTextBoard(id,view);
     return;
  }
  /// For board open it full window
  /// For list open it full window
  set_board(id);
}

 
//Called when a new board is added, deleted, or changed
//usually you pass parentId and boardId
/*structural:Were there changes in the tree structure or just attributes/text/content*/
type UpdateSaveTypeT = number;
const UpdateSaveType = {
  DontSave: 0,
  SaveNow: 1,
  AutoSave: 2
};
//if boards == null, redraw from root. If not null then draw only those
function boardsUpdated(save: UpdateSaveTypeT, boardToRedraw :string|null = null) :void{

  if(pb.boards[board] == null) set_board(""); //in case board we were viewing got deleted

  if(boardToRedraw !== null)
    mainView.renderById(boardToRedraw);
  else
    mainView.render();
  
  //save == 0 = dont save
  if(save == UpdateSaveType.SaveNow)
    sync.saveAll(); // save now
  else if(save == UpdateSaveType.AutoSave)
    sync.setDirty(); //auto save
}
 




//~~~~~~~~~~~~~~~~~~~~~~~~~ URL ops {

//set_board on url change
window.addEventListener('hashchange',()=>{
  if(boardFromUrl() != board) //if not already open
    set_board(boardFromUrl());
});

function urlFromBoard(boardId :string) :string{
  return siteUrl + "#" + boardId;
}
function boardFromUrl(_url :string = null) :string{
  if(_url === null) _url = window.location.href;
  return _url.replace(siteUrl,'').replace('#','');
}

//~~~~~~~~~~~~~~~~~~~~~~~~~ URL ops }



function openOptionsDialog(id :string, view :View) :void{
  dialogManager.openDialog('optionsDialog',id,view);
}
function openTextBoard(id :string, view :View) :void{
  dialogManager.openDialog('textEditor',id,view);
}
 