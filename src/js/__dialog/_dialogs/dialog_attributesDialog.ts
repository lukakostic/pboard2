//~!! See end of file below class, dialog registers itself !!~//
class _dialog_attributesDialog_ implements DialogInterface {
	dialog : HTMLElement;
	back : HTMLElement;

	attributes :HTMLElement;
	templates :HTMLElement;

	constructor(_back: HTMLElement, _dialog: HTMLElement){
		this.dialog = _dialog;
		this.back = _back;

		this.attributes = EbyName('attributes',this.dialog);
		this.templates = EbyName('attributeTemplates',this.dialog);

		
		EbyName('board-title',this.dialog).innerText = '"'+dialogManager.boardID+'":'+pb.boards[dialogManager.boardID].name;
		
		this.genFields();
	}
	focus():void{
		navigation.focus(this.dialog);
	}
	backClicked(ev:Event):void{
		if(ev==null || ev.target == this.back)
			this.close();
	}
	close() :boolean{
		return dialogManager.disposeDialog(this);
	}

  choice_onclick(event :Event) :void{ /////////ViewTheme name is in textContent of button
	 const theme = (event.target as HTMLElement).innerText;
	 if(theme in ViewTheme == false)
	 	throw new Error('bad viewTheme!');
	 pb.boards[dialogManager.boardID].attributes.viewTheme = (ViewTheme as any)[theme];
	 boardsUpdated(UpdateSaveType.SaveNow);
    this.close();
  }

  makeField(type:string, id:string, value:string, enabled:boolean, ...options :any[]):HTMLElement{
	const att_ = (name:string)=>{
		let el = EbyName('att-'+name,this.templates).cloneNode(true) as HTMLElement;
		this.attributes.appendChild(el);
		return el;
	};  
	const att = {
		att_button : (onclick:any)=>{
			let el = att_('button');
			if(id!='') el.setAttribute('data-name',id);
			el.innerHTML = value;
			el.onclick = onclick;
			if(enabled) el.style.backgroundColor = "lightgreen";
			return el;
		}
	};

	let el = (att as any)['att_'+type](...options);
	return el;
  }

  genFields():void{
	  const id = dialogManager.boardID;
	  this.attributes.innerHTML = '';
	  /*Noter*/
	  this.makeField('button','noter',
	  'Noter textEditor: '+(('noter' in pb.boards[id].attributes)?'ON':'OFF'),
	  'noter' in pb.boards[id].attributes,()=>{
		  if('noter' in pb.boards[id].attributes){
				delete pb.boards[id].attributes['noter'];
		  }else{
				pb.boards[id].attributes['noter'] = 1;
		  }
		  boardsUpdated(UpdateSaveType.SaveNow,id);
		  this.genFields();
	  });
	  this.focus();
  }
}
dialogs.attributesDialog = _dialog_attributesDialog_;