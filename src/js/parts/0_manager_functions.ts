
//Called only once
function htmlLoaded() :void{
  //html.find(); //find static html elements
  
  _Header_.init();
  _DialogManager_.init();
  _Navigation_.init();

  storage.OnStorageLoad(StorageType.None); //None/Local/Cache storage loaded
}

 //set full url and push to history
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
   pb.boards[""] = new Board(BoardType.List,"",[],{},"");
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


/* generate required type based on board type */
function generateView(_id :string, _parent : View|null, _index :number) :AlbumView|ListView|TileView|null {
  //log('GenerateView ' + _id, _parent);
  let type = pb.boards[_id].type;
  if(_parent == null){  ////////// Main View
     if(type == BoardType.List)
        return new ListView(_id, _parent, _index);
     if(type == BoardType.Text)
        throw "Trying to open text fullscreen";
     
     return new AlbumView(_id, _parent, _index);
  }
  
  //////////////// Not Main view
  if(viewMode == ViewMode.Board){
    /////////////////////TODO maybe i should remove the second check, it looks cool to have lists in lists..
    if(type == BoardType.List && _parent == mainView)
        return new ListView(_id, _parent, _index);
    return new TileView(_id, _parent, _index);
  }else if(viewMode == ViewMode.List){
    return new TileView(_id, _parent, _index);
  }
  
  return null;
}


function openOptionsDialog(id :string, view :View) :void{
  dialogManager.openDialog('optionsDialog',id,view);
}
function openTextBoard(id :string, view :View) :void{
  dialogManager.openDialog('textEditor',id,view);
}
 
 function moveBoards(
   fromId:string, fromIndex:number,
   toId:string, toIndex:number,
   length:number = 1
 ){
   let boards = pb.boards[fromId].content.splice(fromIndex,length);
   pb.boards[toId].content.splice(toIndex,0, ...boards);
 
   boardsUpdated([fromId,toId],true);
 }

 
//Called when a new board is added, deleted, or changed
//usually you pass parentId and boardId
/*structural:Were there changes in the tree structure or just attributes/text/content*/
/* save: 0 = dont save, 1 = saveAll, 2 = save.dirty=true */
function boardsUpdated(boards :Array<string>, structural :boolean,save: 0|1|2 = 1) :void{
  if(structural)pageOpened();
  else{
    for(let i =0;i<boards.length;i++)
      mainView.renderById(boards[i]);
  }
  //save == 0 = dont save
  if(save==1)
    sync.saveAll(); // save now
  else if(save == 2)
    sync.save.dirty = true; //auto save
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