//~!! See end of file below class, dialog registers itself !!~//
class _dialog_preferencesDialog_ extends DialogInterface {

	currentPreferences :any;
	fields :HTMLElement;
	templates :HTMLElement;

	constructor(_dialog: HTMLElement, _back: HTMLElement){
		super(_dialog,_back);

		this.fields = EbyName('fields',this.dialog);
		this.templates = EbyName('fieldTemplates',this.dialog);

		EbyName('saveBtn',this.dialog).onclick = this.save_onclick.bind(this);
		this.currentPreferences = Object.assign({},pb.preferences);  //clone
		this.build();

		this.focus();
	}
	backClicked(ev:Event):void{
		if(ev==null || ev.target == this.back){
			this.save(true);
		}
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
		(pb as any).preferences = Object.assign({},this.currentPreferences);
		sync.dirty.pbData = true;
		boardsUpdated(UpdateSaveType.SaveNow);
		this.close();
	}

}
allDialogs.preferencesDialog = _dialog_preferencesDialog_;