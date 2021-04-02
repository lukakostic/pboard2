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