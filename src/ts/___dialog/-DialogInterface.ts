abstract class DialogInterface {
	dialog: HTMLElement;
	back: HTMLElement;

	constructor(_dialog: HTMLElement, _back: HTMLElement){
		this.dialog = _dialog;
		this.back = _back;
	}

	
	focus():void{
		navigation.focus(this.dialog);
	}

	close() :boolean{
		return dialogManager.disposeDialog(this);
	}

	backClicked(ev:Event):void{
		if(ev==null || ev.target == this.back)
			this.close();
	}

}