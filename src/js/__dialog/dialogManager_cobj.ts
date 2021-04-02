//dialogs add themselves here, then dialogManager takes them. Should be a static property of _DialogManager_ but js is shit
let unregisteredDialogs: {[index:string]:DialogInterface} = {};

let dialogManager :_DialogManager_ = null;
class _DialogManager_{
  boardID :BoardId|null;
  boardView :View;
  dialogs :{[index:string]:DialogInterface};

  dialogBack : HTMLElement;

  static init():void{ if(dialogManager==null) dialogManager = new _DialogManager_(); }

  constructor(){
    this.boardID = null; //Id of currently open board in some dialog
    this.boardView = null;
    this.dialogs = {}; //Dialog objects add themselves here as properties
    
    (this.dialogBack = EbyId('dialogBack'))
    .addEventListener('click', this.dialogBack_onclick.bind(this) ,false);

    this.registerDialogs();
  }

  registerDialogs() :void{ //register and init all unregistered dialogs
    for(let d in unregisteredDialogs){
      this.addDialog(d,unregisteredDialogs[d]);
      this.dialogs[d].init();
    }
  }

  dialogBack_onclick(event :Event) :void{
    if(event.target == this.dialogBack) //if no bubbling
      dialogManager.closeDialog(true,true); //backClicked =true
  }

 addDialog(name :string, dialog : DialogInterface) :void{
   this.dialogs[name] = dialog;
 }

 openDialog(dialog :string, boardId :BoardId, boardView :View) :void{
   //this.closeDialog(false, true); //close and reset all first
   this.dialogBack.classList.toggle('hidden', false);
   this.boardID = boardId;
   this.boardView = boardView;
   this.dialogs[dialog].open();
 }

 //close all
 closeDialog(backClicked :boolean, all :boolean) :void{
  if(all)
    for(let k in this.dialogs)
      if(this.dialogs[k].isOpen)
      this.dialogs[k].close(backClicked?null:false);

  this.dialogBack.classList.toggle('hidden', true);

  /*
  Close gets called twice (backclick, then dialog.close)
  if dialog edited boards, the board element will be changed (page draw)
  so if we focus now, it will still get changed in page draw :(
  */
 
  if(all == false){ //if all == false we are closing from dialog.close, so its the FIRST closing (backClick is second). So we still have our boardView
    if(this.boardView!=null)
        navigation.focusView(this.boardView);
    else
      navigation.focusDefault(); //reset
  }
  this.boardID = null;
  this.boardView = null;

 }
}