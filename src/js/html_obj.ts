//Static html elements, lazy initialization (only when requested)
const html = {
	_e : {} as {[index:string]:HTMLElement}, //where elements are actually cached
	_(id:string,template:boolean=false):HTMLElement{ //lazy getter
		let v = this._e[id];
		return v?v: this._e[id]=(template?templateFChild(id):EbyId(id));
	},

	//Elements:

	get main (){return this._('main')},

	get albumTemplate (){return this._('album-template',true)},
	get list2Template (){return this._('list-template',true)},
	get tileTemplate (){return this._('tile-template',true)},

	get tabStart (){return this._('tabStart')},
	get tabEnd (){return this._('tabEnd')},

	get loadingIndicator (){return this._('loadingIndicator')},
	get savingIndicator (){return this._('savingIndicator')},

	get extrasDialog (){return this._('extrasDialog')},
	get extrasTitle (){return this._('extrasTitle')},
	get extrasContent (){return this._('extrasContent')},
	get extrasBack (){return this._('extrasBack')},
};