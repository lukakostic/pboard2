/* return viewTye/class based on board type and parent */
function viewTypeForContext(id :BoardId, parent : View|null) :ViewTypeT|null{
	let type = pb.boards[id].type;

	if(parent == null){  ////////// Main View
		if(type == BoardType.List)
			return ViewType.ListView;
		if(type == BoardType.Board)
			return ViewType.AlbumView;
		return null;
	}
	
	//////////////// Not Main view
	if(parent.type == ViewType.AlbumView){
	  /////////////////////TODO maybe i should remove the second check, it looks cool to have lists in lists..
	  if(type == BoardType.List)
			return ViewType.ListView;
	  return ViewType.TileView;
	}
	else if(parent.type == ViewType.ListView)
	  return ViewType.TileView;
	
	return null;
}

/* generate view of some type */
function generateView(id :BoardId, parent : View|null, index :number) :AlbumView|ListView|TileView|null {
	//dbg('GenerateView ' + _id, _parent);
	
	let viewType = viewTypeForContext(id,parent);
	
	switch(viewType){
		case ViewType.TileView:
			return new TileView(id,parent,index);
		case ViewType.ListView:
			return new ListView(id,parent,index);
		case ViewType.AlbumView:
			return new AlbumView(id,parent,index);
	}

	return null;
 }