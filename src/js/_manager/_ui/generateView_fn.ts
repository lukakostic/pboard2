/* return viewTye/class based on board type and parent */
function viewTypeForContext(_id :BoardId, _parent : View|null) :ViewTypeT|null{
	//log('GenerateView ' + _id, _parent);
	let type = pb.boards[_id].type;
	if(_parent == null){  ////////// Main View
		if(type == BoardType.List)
			return ViewType.ListView;
		if(type == BoardType.Text)
			return null;
		
		return ViewType.AlbumView;
	}
	
	//////////////// Not Main view
	if(viewMode == ViewMode.Board){
	  /////////////////////TODO maybe i should remove the second check, it looks cool to have lists in lists..
	  if(type == BoardType.List && _parent == mainView)
			return ViewType.ListView;
	  return ViewType.TileView;
	}else if(viewMode == ViewMode.List){
	  return ViewType.TileView;
	}
	
	return null;
}

/* generate view of some type */
function generateView(_id :BoardId, _parent : View|null, _index :number) :AlbumView|ListView|TileView|null {
	//dbg('GenerateView ' + _id, _parent);
	
	let viewType = viewTypeForContext(_id,_parent);
	
	switch(viewType){
		case ViewType.TileView:
			return new TileView(_id,_parent,_index);
			break;
		case ViewType.ListView:
			return new ListView(_id,_parent,_index);
			break;
		case ViewType.AlbumView:
			return new AlbumView(_id,_parent,_index);
			break;
	}

	return null;
 }