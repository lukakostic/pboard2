function newText(parentId :string, name:string|null = null) :string{
  if(name==null) name="";

  let brd = new Board(BoardType.Text,name,"");
  pb.boards[brd.id] = brd;
  pb.boards[parentId].content.push(brd.id);
  boardsUpdated([parentId,brd.id],true);
  
  return brd.id;
}


function newBoard(parentId :string, name:string|null = null) :string{
  if(name==null) name="Board";

  let brd = new Board(BoardType.Board,name,[],{description:''});
  pb.boards[brd.id] = brd;
  pb.boards[parentId].content.push(brd.id); //Add to parent list
  
  boardsUpdated([parentId,brd.id],true);

  return brd.id;
}


function newList(parentId :string, name:string|null = null) :string{
  if(name==null) name="List";

  let brd = new Board(BoardType.List,name,[]);
  pb.boards[brd.id] = brd;
  pb.boards[parentId].content.push(brd.id);
  boardsUpdated([parentId,brd.id],true);

  return brd.id;
}


function newReference(parentId :string, id :string|null = null) :string|null{
  if(id == null){
    id = window.prompt("Write/Paste id of board to reference:");

    if(id==null) return null;
    if(pb.boards[id] == null){ alert("ID doesn't exist :("); return null; }
    //if(pb.boards[id].type == BoardType.List){alert("Cant embed lists into boards."); return null;}
  }

  pb.boards[parentId].content.push(id);
  boardsUpdated([parentId, id],true);

  return id;
}