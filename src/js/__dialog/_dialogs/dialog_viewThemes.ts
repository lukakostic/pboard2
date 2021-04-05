//~!! See end of file below class, dialog registers itself !!~//
class _dialog_viewThemes_ implements DialogInterface {
	dialog : HTMLElement;
	back : HTMLElement;

	constructor(_back: HTMLElement, _dialog: HTMLElement){
		this.dialog = _dialog;
		this.back = _back;

		EbyNameAll('b',this.dialog).forEach( b=>
			(b as HTMLElement).onclick = this.choice_onclick.bind(this)
		);

		
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

  choice_onclick(event :Event) :void{ /////////ViewTheme name is in textContent of button
	 let theme = (event.target as HTMLElement).innerText;
	 if(theme in ViewTheme == false)
	 	throw new Error('bad viewTheme!');
	 pb.boards[dialogManager.boardID].attributes.viewTheme = (ViewTheme as any)[theme];
	 boardsUpdated(UpdateSaveType.SaveNow);
    this.close();
  }

}
dialogs.viewThemes = _dialog_viewThemes_;