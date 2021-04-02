////Calls self at end!
declare let require: Function; //3rd party, node.js

const storage_electronLocal : StorageInterface & {
	ipcRenderer:any
 } = {
	ipcRenderer: null, //electron

	OnStorageLoad() :void{
		if(typeof require === 'undefined') return;
		const { ipcRenderer } = require('electron');
		this.ipcRenderer = ipcRenderer;

      storage.OnStorageLoad(StorageType.ElectronLocal);
	},

	
	fileUpload(contents:string, callback:Function=null) :void{
		this.ipcRenderer.sendSync('synchronous-message', {cmd:'save', data:contents});
		setTimeout(()=>{
		if(callback) callback();
		},400);//So save icon stays a bit
	},

	fileDownload(callback:Function) :void{
		let contents = this.ipcRenderer.sendSync('synchronous-message', {cmd:'load'});
		if(callback) callback(contents);
	},
}
waitCall(
	storage_electronLocal.OnStorageLoad.bind(storage_electronLocal)
); //Since local but we wait for other js