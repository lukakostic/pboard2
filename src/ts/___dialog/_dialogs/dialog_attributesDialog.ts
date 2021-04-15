//~!! See end of file below class, dialog registers itself !!~//
class _dialog_attributesDialog_ extends DialogInterface {
	attributes :HTMLElement;
	templates :HTMLElement;

	constructor(_dialog: HTMLElement, _back: HTMLElement){
		super(_dialog,_back);

		this.attributes = EbyName('attributes',this.dialog);
		this.templates = EbyName('attributeTemplates',this.dialog);

		
		EbyName('board-title',this.dialog).innerText = '"'+dialogManager.boardID+'":'+pb.boards[dialogManager.boardID].name;
		
		this.genFields();
	}

  choice_onclick(event :Event) :void{ /////////ViewTheme name is in textContent of button
	 const theme = (event.target as HTMLElement).innerText;
	 if(theme in ViewTheme == false)
	 	throw new Error('bad viewTheme!');
	 pb.boards[dialogManager.boardID].attributes.viewTheme = (ViewTheme as any)[theme];
	 boardsUpdated(UpdateSaveType.SaveNow,null,[dialogManager.boardID]);
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
		  boardsUpdated(UpdateSaveType.SaveNow,id,[id]);
		  this.genFields();
	  });
	  this.focus();
  }
}
allDialogs.attributesDialog = _dialog_attributesDialog_;