//~!! See end of file below class, dialog registers itself !!~//
class _dialog_viewThemes_ extends DialogInterface {

	constructor(_dialog: HTMLElement, _back: HTMLElement){
		super(_dialog,_back);

		EbyNameAll('b',this.dialog).forEach( b=>
			(b as HTMLElement).onclick = this.choice_onclick.bind(this)
		);

		EbyName('board-title',this.dialog).innerText = '"'+dialogManager.boardID+'":'+pb.boards[dialogManager.boardID].name;
		
		this.focus();
	}

	focus():void{
		navigation.focus(EbyName('remove',this.dialog));
	}

  choice_onclick(event :Event) :void{ /////////ViewTheme name is in textContent of button
	 let theme = (event.target as HTMLElement).innerText;
	 if(theme in ViewTheme == false)
	 	throw new Error('bad viewTheme!');
	 pb.boards[dialogManager.boardID].attributes.viewTheme = (ViewTheme as any)[theme];
	 boardsUpdated(UpdateSaveType.SaveNow,null,[dialogManager.boardID]);
    this.close();
  }

}
allDialogs.viewThemes = _dialog_viewThemes_;