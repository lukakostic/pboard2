//~!! See end of file below class, dialog registers itself !!~//
class _dialog_optionsDialog_ implements DialogInterface {
	dialog : HTMLElement;
	back : HTMLElement;

	constructor(_back: HTMLElement, _dialog: HTMLElement){
		this.dialog = _dialog;
		this.back = _back;

		EbyName('remove',this.dialog).onclick = this.remove_onclick.bind(this);
		EbyName('delete',this.dialog).onclick = this.delete_onclick.bind(this);
		EbyName('attributes',this.dialog).onclick = this.attributes_onclick.bind(this);
		EbyName('copy',this.dialog).onclick = this.copy_onclick.bind(this);
		EbyName('references',this.dialog).onclick = this.references_onclick.bind(this);
		EbyName('convert',this.dialog).onclick = this.convert_onclick.bind(this);

		
		EbyName('board-title',this.dialog).innerText = '"'+dialogManager.boardID+'":'+pb.boards[dialogManager.boardID].name;
		
		this.focus();
	}
	focus():void{
		navigation.focus(EbyName('remove',this.dialog));
	}
	backClicked(ev:Event):void{
		if(ev==null || ev.target == this.back)
			this.close();
	}
	close() :boolean{
		return dialogManager.disposeDialog(this);
	}

  remove_onclick(event :Event) :void{
    let refCount = Board.countReferences(dialogManager.boardID);
    if(refCount<=1 && confirm('This is the last reference to this board, really remove it? (Will delete the board)')==false) return;

	 if(dialogManager.boardView.parent)
	 	pb.boards[dialogManager.boardView.parent.id].content.splice(dialogManager.boardView.index,1);
	 else
	 	throw new Error('remove_onclick boardView has no parent!!!');

    if(refCount<=1) //is now 0
      Board.deleteBoardById(dialogManager.boardID);

	 boardsUpdated(UpdateSaveType.SaveNow);
	 
	 dialogManager.boardView = null; // just to let them know
    this.close();
  }
  delete_onclick(event :Event) :void{
    if(confirm('Really delete this board, all references to it and its content (content will be removed, not deleted)?')==false) return;
    Board.deleteBoardById(dialogManager.boardID);
	 boardsUpdated(UpdateSaveType.SaveNow);
	 
	 dialogManager.boardView = null; // just to let them know
    this.close();
  }
  copy_onclick(event :Event) :void{
    window.prompt("Copy to clipboard: Ctrl+C, Enter", dialogManager.boardID);
    this.close();
  }
  convert_onclick(event :Event) :void{
	  let id = dialogManager.boardID;
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
			boardsUpdated(UpdateSaveType.SaveNow);
	  }
	  //List: make yourself a board, make a new list and add to yourself. add all contents to it.
	  else if(pb.boards[id].type == BoardType.List){
		let content = pb.boards[id].content.slice() as BoardId[]; //copy array

		let listId = newList(id,pb.boards[id].name);
		pb.boards[listId].content = content;

		pb.boards[id].content = [listId];

		pb.boards[id].type = BoardType.Board;
		boardsUpdated(UpdateSaveType.SaveNow);
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
dialogs.optionsDialog = _dialog_optionsDialog_;