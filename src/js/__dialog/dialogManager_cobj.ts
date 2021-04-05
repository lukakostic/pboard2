//dialogs add themselves here, then dialogManager takes them. Should be a static property of _DialogManager_ but js is shit
let dialogs: {[index:string]:(new(back:HTMLElement,dialog:HTMLElement)=>DialogInterface)} = {};

let dialogManager :_DialogManager_ = null;
class _DialogManager_{
  boardID :BoardId|null;
  boardView :View;
  dialogs :DialogInterface[];

  static init():void{ if(dialogManager==null) dialogManager = new _DialogManager_(); }

  constructor(){
    this.boardID = null; //Id of currently open board in some dialog
    this.boardView = null;
    this.dialogs = []; //Dialog objects add themselves here as properties
  }

	openDialog(dialogName :string, boardId :BoardId, boardView :View) :void{
		if(dialogName in dialogs == false) return;
		this.boardID = boardId;
		this.boardView = boardView;
		
		//this.closeDialog(false, true); //close and reset all first
		let back = EbyName('_dialogBack_', html.dialogTemplates).cloneNode(true) as HTMLElement;
		html.dialogs.appendChild(back);
		let dialogEl = EbyName('dialog_'+dialogName, html.dialogTemplates).cloneNode(true)  as HTMLElement;
		back.appendChild(dialogEl);

		let dialog = new dialogs[dialogName](back,dialogEl);
		back.addEventListener('click', dialog.backClicked.bind(dialog) ,false);

		this.dialogs.push(dialog);
	}

	backClicked() :void{
		if(this.dialogs.length == 0)return;
		this.dialogs[this.dialogs.length-1].backClicked(null);
	}
	//close all
	closeDialog(all :boolean) :void{
		if(all)
			for(let i = this.dialogs.length-1; i>-1; i++){
				if(this.dialogs[i].close() == false) break; //If any refuses
			}
		else if(this.dialogs.length>0)
			this.dialogs[this.dialogs.length-1].close();
	}
	disposeDialog(dialog:DialogInterface):boolean{
		let ind = this.dialogs.indexOf(dialog);
		dialog.dialog = dialog.dialog.remove() as null;
		dialog.back = dialog.back.remove() as null;
		this.dialogs.splice(ind,1);
		if(this.dialogs.length == 0){ //all closed
			navigation.focusView(this.boardView);

			this.boardID = null;
			this.boardView = null;
		}else{
			this.dialogs[this.dialogs.length-1].focus();
		}
		return true;
	}
}