//~!! See end of file below class, dialog gets added to unregisteredDialogs !!~//
class _dialog_optionsDialog_ implements DialogInterface {
  isOpen : boolean;
  dialog : HTMLElement;

  constructor(){
    this.isOpen = false;
    this.dialog = null;
  }
  init() :void{
     this.isOpen = false;
     this.dialog = EbyId('dialog_optionsDialog');

     EbyName('remove',this.dialog).onclick = this.remove_onclick.bind(this);
     EbyName('delete',this.dialog).onclick = this.delete_onclick.bind(this);
     EbyName('copy',this.dialog).onclick = this.copy_onclick.bind(this);
     EbyName('references',this.dialog).onclick = this.references_onclick.bind(this);
     EbyName('extras',this.dialog).onclick = this.extras_onclick.bind(this);
  }
  open() :void{
     this.isOpen = true;
     this.dialog.classList.toggle('hidden', false);
     
     navigation.focus(EbyName('remove',this.dialog));
  }
  //save == null when autoclose
  close() :void{
     this.dialog.classList.toggle('hidden', true);
     this.isOpen = false;
     dialogManager.closeDialog(false,false);
  }

  remove_onclick(event :Event) :void{
    let refCount = Board.countReferences(dialogManager.boardID);
    if(refCount<=1 && confirm('This is the last reference to this board, really remove it? (Will delete the board)')==false) return;

    if(pb.boards[board].type == BoardType.Board){
      pb.boards[board].content.splice(dialogManager.boardView.index-1,1); //////?????/////TODO test it out, not sure about index
    }else if(pb.boards[board].type == BoardType.List){
      pb.boards[board].content.splice(dialogManager.boardView.index,1); //////?????/////TODO test it out, not sure about index
    }
  
  
    if(refCount<=1) //is now 0
      Board.deleteBoardById(dialogManager.boardID);

    boardsUpdated(UpdateSaveType.SaveNow);
    this.close();
  }
  delete_onclick(event :Event) :void{
    if(confirm('Really delete this board, all references to it and its content (content will be removed, not deleted)?')==false) return;
    Board.deleteBoardById(dialogManager.boardID);
    boardsUpdated(UpdateSaveType.SaveNow);
    this.close();
  }
  copy_onclick(event :Event) :void{
    window.prompt("Copy to clipboard: Ctrl+C, Enter", dialogManager.boardID);
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
unregisteredDialogs['optionsDialog'] = new _dialog_optionsDialog_();