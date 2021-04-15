//~!! See end of file below class, dialog registers itself !!~//
class _dialog_optionsDialog_ extends DialogInterface {

	constructor(_dialog: HTMLElement, _back: HTMLElement){
		super(_dialog,_back);

		EbyName('remove',this.dialog).onclick = this.remove_onclick.bind(this);
		EbyName('delete',this.dialog).onclick = this.delete_onclick.bind(this);
		EbyName('attributes',this.dialog).onclick = this.attributes_onclick.bind(this);
		EbyName('copy',this.dialog).onclick = this.copy_onclick.bind(this);
		EbyName('references',this.dialog).onclick = this.references_onclick.bind(this);
		EbyName('convert',this.dialog).onclick = this.convert_onclick.bind(this);
		EbyName('pin',this.dialog).onclick = this.pin_onclick.bind(this);
		EbyName('setBoardId',this.dialog).onclick = this.setBoardId_onclick.bind(this);

		
		EbyName('preferences',this.dialog).onclick = this.preferences_onclick.bind(this);

		
		EbyName('board-title',this.dialog).innerText = '"'+dialogManager.boardID+'":'+pb.boards[dialogManager.boardID].name;
		
		this.focus();
	}
	focus():void{
		navigation.focus(EbyName('remove',this.dialog));
	}

  remove_onclick(event :Event) :void{
    let refCount = Board.countReferences(dialogManager.boardID);
    if(refCount<=1 && confirm('This is the last reference to this board, really remove it? (Will delete the board and remove children, which may delete them too)')==false) return;

	 if(dialogManager.boardView.parent)
	 	removeBoardByIndex(dialogManager.boardView.parent.id, dialogManager.boardView.index);
	else
	 	throw new Error('remove_onclick boardView has no parent!!!');
		 
	 dialogManager.boardView = null; // just to let them know
    this.close();
  }
  delete_onclick(event :Event) :void{
    if(confirm('Really delete this board, all references to it and its content (content will be removed, not deleted)?')==false) return;
    deleteBoard(dialogManager.boardID);
	 boardsUpdated(UpdateSaveType.SaveNow);
	 
	 dialogManager.boardView = null; // just to let them know
    this.close();
  }
  copy_onclick(event :Event) :void{
    window.prompt("Copy to clipboard: Ctrl+C, Enter", dialogManager.boardID);
    this.close();
  }
  preferences_onclick(event :Event) :void{
	dialogManager.openDialog('preferencesDialog',dialogManager.boardID,dialogManager.boardView);
    this.close();
  }
  pin_onclick(event :Event) :void{
	  if('pins' in pb.attributes == false)
		  pb.attributes['pins'] = [];
		let id = dialogManager.boardID;
		let ind = pb.attributes['pins'].indexOf(id);
		if(ind != -1){
			pb.attributes['pins'].splice(ind,1);
		}else{
			pb.attributes['pins'].push(id);
		}
		sync.dirty.pbAttr = true;
		boardsUpdated(UpdateSaveType.SaveNow);
		sidebar.genBtns();
  }
  setBoardId_onclick(event :Event) :void{
		const oldId = dialogManager.boardID;
		let newId = window.prompt("Enter new id, should be 8 chars:",oldId);
		if(newId == null || oldId == newId) return;
		if(newId in pb.boards){
			window.alert('ID already exists.');
			return;
		}
		pb.boards[newId] = Board.clone(pb.boards[oldId]);
		let changedBoards = new Set() as Set<BoardId>;
		for(let b in pb.boards){
			if(Array.isArray(pb.boards[b].content) && typeof pb.boards[b].content !== 'string'){
			   for(let i = 0; i < pb.boards[b].content.length; i++){
					if(pb.boards[b].content[i] == oldId){
						pb.boards[b].content[i] = newId;
						changedBoards.add(b);
					}
				}
			}
		}
		delete pb.boards[oldId];

		changedBoards.add(newId);
	   changedBoards.forEach(v=>sync.dirty.bChanged.add(v));	
		sync.dirty.bRemoved.add(oldId);
		sync.saveDirty();
		
		this.close();
		if(board == oldId)
			set_board(newId);
		else
			draw();
  }
  convert_onclick(event :Event) :void{
	  const id = dialogManager.boardID;
	  if(id==null) return;
	  //Board: get all lists contents, append to yourself (yes with already existing lists), and turn to list.
	  if(pb.boards[id].type == BoardType.Board){
			let newContent = pb.boards[id].content.slice() as BoardId[]; //copy array
			//content is all list
			(pb.boards[id].content as BoardId[]).forEach(listId=>{
				newContent = newContent.concat(pb.boards[listId].content as BoardId[]) //concat content from each list
			});

			pb.boards[id].content = newContent;
			pb.boards[id].type = BoardType.List;
			sync.dirty.bChanged.add(id);
			boardsUpdated(UpdateSaveType.SaveNow);
	  }
	  //List: make yourself a board, make a new list and add to yourself. add all contents to it.
	  else if(pb.boards[id].type == BoardType.List){
		let content = pb.boards[id].content.slice() as BoardId[]; //copy array

		let listId = newList(id,pb.boards[id].name);
		pb.boards[listId].content = content;

		pb.boards[id].content = [listId];

		pb.boards[id].type = BoardType.Board;
		boardsUpdated(UpdateSaveType.SaveNow,null,[id,listId]);
	  }
	  else return;
    this.close();
  }
  attributes_onclick() :void{
	  dialogManager.openDialog('attributesDialog',dialogManager.boardID,dialogManager.boardView);
	  this.close();
  }
  references_onclick(event :Event) :void{ //////////////////TODO move this to separate dialog.. also this is a situation where one dialog opens a differeont one..
    let brdID = dialogManager.boardID;
    let brdView = dialogManager.boardView;
    this.close();
    /* //////////////////////TODO implement this
    
    if(brdAttr(dialogManager.boardID,'references') == 1) return alert('This is the only reference');
  
    let listReferences = [];
  
    //go thru every board get references
    let ids = Object.keys(pb.boards);
  
    for(let i = 0; i < ids.length; i++)
      if(pb.boards[ids[i]].type == BoardType.List)
        if(pb.boards[ids[i]].content.includes(dialogManager.boardID))
          listReferences.push(ids[i]);
        
    
  
    let boardReferences = {};
  
    //go thru each board, see if it includes any of the listReferences
    for(let i = 0; i < ids.length; i++)
      if(pb.boards[ids[i]].type == BoardType.Board)
        for(let j = 0; j < listReferences.length; j++)
          if(pb.boards[ids[i]].content.includes(listReferences[j]))
            boardReferences[ids[i]] = null; //just some value
  
  
  
    let btnTemplate = templateFChild('referencesDialogBtn');
    let list = EbyId('referencesDialogList');
  
    //clear previous buttons
    while (list.firstChild) 
      list.removeChild(list.firstChild)
    
  
    let modal = $('#referencesDialog')
    let brds = Object.keys(boardReferences)
  
    for(let i = 0; i < brds.length; i++){
      let el = btnTemplate.cloneNode(true)
      //modal[0].appendChild(el);
  
      list.appendChild(el)
  
      set_dataId(el, brds[i])
  
      if(brds[i] == "")
        $(el).text('Main Board')
      else
        $(el).text('List(s) on Board ' + brds[i])
    }
  
    set_dataId(modal[0], brd);
    (<JQuery<any> &{modal:any}> modal).modal('show');
    */
  }
  extras_onclick() :void{
    //showExtras();////////////////////////////////////TODO/////////////////////////////////////////
  }

}
allDialogs.optionsDialog = _dialog_optionsDialog_;