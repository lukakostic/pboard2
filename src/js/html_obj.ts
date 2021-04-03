//Static html elements, lazy initialization (only when requested)
const html = {
	_e : {} as {[index:string]:HTMLElement}, //where elements are actually cached
	_(id:string,template:boolean=false):HTMLElement{ //lazy getter
		let v = this._e[id];
		return v?v: this._e[id]=(template?templateFChild(id):EbyId(id));
	},
	__(id:string,fn:Function):HTMLElement{ //lazy getter with custom function
		let v = this._e[id];
		return v?v: this._e[id]=fn();
	},
	
	//Elements:

	get main (){return this._('main')},

	get albumTemplate (){return this._('album-template',true)},
	get list2Template (){return this._('list-template',true)},
	get tileTemplate (){return this._('tile-template',true)},

	get dialogs (){return this._('dialogs')},
	get dialogTemplates (){return this._('dialogTemplates')},

	get tabStart (){return this._('tabStart')},
	get tabEnd (){return this._('tabEnd')},

	get loadingIndicator (){return this._('loadingIndicator')},
	get savingIndicator (){return this._('savingIndicator')},
};