
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



//set currently open board, push to history
function set_board(id :BoardId) :void{
	dbg("set_board('"+id+"')");
	if(pb.boards[id] == null) id = "";
	board = id;
	boardHistory.add(id);
	window.location.hash = id;
	draw();
	navigation.focus(header.headerTitle, true);
 }


/////////////////////////////////////////Board rearranging:

function moveBoards(
  fromId:BoardId, fromIndex:number,
  toId:BoardId, toIndex:number,
  length:number = 1,
  updateBoards = true
):void{
  let boards = pb.boards[fromId].content.splice(fromIndex,length);
  pb.boards[toId].content.splice(toIndex,0, ...boards);

  if(updateBoards) boardsUpdated(UpdateSaveType.SaveNow);
}
//Less verbose moving:
function moveBoardTo(boardIndex:number,endIndex:number,parentId :BoardId = null):void{
	if(parentId === null) parentId = board;
	let len = pb.boards[parentId].content.length;
	let newPos = endIndex;
	if(newPos>=len)newPos=len-1;
	if(newPos<0)newPos = 0;
	moveBoards(parentId,boardIndex,parentId,newPos,1,true);
}
function moveBoardShift(boardIndex:number,shift:number,parentId :BoardId = null):void{
	moveBoardTo(boardIndex, boardIndex+shift, parentId);
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
 


//~~~~~~~~~~~~~~~~~~~~~~~~~ Board Opening and dialogs {

function openBoard(id :BoardId, view :View) :void{
	//console.log("board of id: " + id + " clicked");
	
	if(pb.boards[id].type == BoardType.Text)
		return openTextBoard(id,view);
	
	/// For board open it full window
	/// For list open it full window
	set_board(id);
}


function openOptionsDialog(id :BoardId, view :View) :void{
	dialogManager.openDialog('optionsDialog',id,view);
}
function openTextBoard(id :BoardId, view :View) :void{
	dialogManager.openDialog('textEditor',id,view);
}


//~~~~~~~~~~~~~~~~~~~~~~~~~ Board Opening and dialogs }


//~~~~~~~~~~~~~~~~~~~~~~~~~ URL ops {

//set_board on url change
window.addEventListener('hashchange',()=>{
	dbg('hashChange',window.location.hash);
  if(boardFromUrl() != board) //if not already open
    set_board(boardFromUrl());
});

function urlFromBoard(boardId :BoardId) :string{
	dbg('urlFromBoard',siteUrl + '#' + boardId);
  return siteUrl + "#" + boardId;
}
function boardFromUrl(_url :string = null) :string{
	dbg('boardFromUrl',_url);
  if(_url === null) _url = window.location.href;
  return _url.replace(siteUrl,'').replace('#','');
}

//~~~~~~~~~~~~~~~~~~~~~~~~~ URL ops }



//~~~~~~~~~~~~~~~~~~~~~~~~~ Board attribute ops {
//Setters:
//Set attribute of board by id
function set_brdAttr(id :BoardId, attr:string|number, val :any) :void{
	pb.boards[id].attributes[attr] = val;
 }
 //Set attribute of board by id, if it already doesnt have it
 function set_brdAttrIfNull(id :BoardId, attr :string|number, val :any) :boolean{
	if((attr in pb.boards[id].attributes) == false){
			set_brdAttr(id,attr,val);
			return true;
	}
	return false;
 }
 
 //Getters:
 //Get attribute of board by id
 function brdAttr(id :BoardId, attr :string|number) :any{
	return pb.boards[id].attributes[attr];
 }
 //Get attribute of board by id, or if it doesnt exist return val
 function brdAttrOrDef(id :BoardId, attr :string|number, val :any) :any{
	if(attr in pb.boards[id].attributes)
			return brdAttr(id,attr);
	return val;
 }
 
 //Delete attribute:
 function delBrdAttr(id :BoardId, attr :string|number) :void{
	delete pb.boards[id].attributes[attr];
 }
 
 //~~~~~~~~~~~~~~~~~~~~~~~~~ Board attribute ops }


 