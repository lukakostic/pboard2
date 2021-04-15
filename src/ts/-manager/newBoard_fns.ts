function newText(parentId :BoardId, name:string|null = null) :string{
  if(name==null) name="";

  let brd = new Board(BoardType.Text,name,"");
  pb.boards[brd.id] = brd;
  pb.boards[parentId].content.push(brd.id);
  boardsUpdated(UpdateSaveType.SaveNow,null,[parentId,brd.id]);
  
  return brd.id;
}


function newBoard(parentId :BoardId, name:string|null = null) :string{
  if(name==null) name="";//name="Board";

  let brd = new Board(BoardType.Board,name,[],{description:''});
  pb.boards[brd.id] = brd;
  pb.boards[parentId].content.push(brd.id); //Add to parent list
  boardsUpdated(UpdateSaveType.SaveNow,null,[parentId,brd.id]);

  return brd.id;
}


function newList(parentId :BoardId, name:string|null = null) :string{
  if(name==null) name="";//name="List";

  let brd = new Board(BoardType.List,name,[]);
  pb.boards[brd.id] = brd;
  pb.boards[parentId].content.push(brd.id);
  boardsUpdated(UpdateSaveType.SaveNow,null,[parentId,brd.id]);

  return brd.id;
}


function newReference(parentId :BoardId, id :string|null = null) :string|null{
  if(id == null){
    id = window.prompt("Write/Paste id of board to reference:");

    if(id==null) return null;
    if(pb.boards[id] == null){ alert("ID doesn't exist :("); return null; }
    //if(pb.boards[id].type == BoardType.List){alert("Cant embed lists into boards."); return null;}
  }

  pb.boards[parentId].content.push(id);
  boardsUpdated(UpdateSaveType.SaveNow,null,[parentId]);

  return id;
}