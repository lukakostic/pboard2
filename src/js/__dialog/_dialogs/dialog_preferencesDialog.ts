//~!! See end of file below class, dialog registers itself !!~//
class _dialog_preferencesDialog_ implements DialogInterface {
	dialog : HTMLElement;
	back : HTMLElement;

	currentPreferences :any;
	fields :HTMLElement;
	templates :HTMLElement;

	constructor(_back: HTMLElement, _dialog: HTMLElement){
		this.dialog = _dialog;
		this.back = _back;

		this.fields = EbyName('fields',this.dialog);
		this.templates = EbyName('fieldTemplates',this.dialog);

		EbyName('saveBtn',this.dialog).onclick = this.save_onclick.bind(this);
		this.currentPreferences = Object.assign({},pb.preferences);  //clone
		this.build();

		this.focus();
	}
	focus():void{
		navigation.focus(this.dialog);
	}
	backClicked(ev:Event):void{
		if(ev==null || ev.target == this.back){
			this.save(true);
		}
	}
	close() :boolean{
		return dialogManager.disposeDialog(this);
	}

	build():void{
		const mk = (name:string)=>{
			let el = EbyName(name,this.templates).cloneNode(true) as HTMLElement;
			this.fields.appendChild(el);
			return el;
		}; 
		function mkDiv(text:string){
			let el = mk('div');
			el.innerHTML = text;
		}
		/* 0 - string, 1 - number */
		function mkInput(type:0|1,value:any,oninput:Function){
			let el = mk('input') as HTMLInputElement;
			el.value = value;
			el.oninput = oninput as any;
		}

		for(let f in this.currentPreferences){
			mkDiv(f);
			if(typeof this.currentPreferences[f] === 'number'){
				mkInput(1,this.currentPreferences[f],function(this:_dialog_preferencesDialog_,f:string,event:Event){
					this.currentPreferences[f] = parseFloat((event.target as HTMLInputElement).value);
				}.bind(this,f));
			}
		}
	}

	save_onclick():void{
		this.save(true);
	}

	save(force:boolean=true){
		pb.preferences = Object.assign({},this.currentPreferences);
		boardsUpdated(UpdateSaveType.SaveNow);
		this.close();
	}

}
dialogs.preferencesDialog = _dialog_preferencesDialog_;