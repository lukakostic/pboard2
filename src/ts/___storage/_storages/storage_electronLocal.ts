////Calls self at end!
declare let require: Function; //3rd party, node.js

class _Storage_ElectronLocal_ implements StorageSegmentedInterface {
	ipcRenderer:any; //electron

	constructor(){
		if(typeof require === 'undefined') return;
		const { ipcRenderer } = require('electron');
		this.ipcRenderer = ipcRenderer;

		this.OnStorageLoad();
	}

	OnStorageLoad() :void{
      storage.OnStorageLoad(StorageType.ElectronLocal, this);
	}

	
	fileUpload(path :string, contents :string, callback:Function = null) :void{
		this.ipcRenderer.sendSync('pb_fileUpload',{path,contents});
		if(callback) callback();
	}

	fileDownload(path :string, callback:Function) :void{
		let contents = this.ipcRenderer.sendSync('pb_fileDownload',{path});
		if(callback) callback(contents);
	}

	fileDelete(path :string, callback :Function = null) :void {
		this.ipcRenderer.sendSync('pb_fileDelete',{path});
		if(callback) callback();
	}

	makeFolder(name :string, callback: Function):void {
		this.ipcRenderer.sendSync('pb_makeFolder',{name});
		if(callback) callback();
	}

	savePartial(partialStructuredObject:any, callback: Function):void {
		dbg2('electron_savePartial', partialStructuredObject);
		this.ipcRenderer.sendSync('pb_savePartial',{obj:partialStructuredObject});
		if(callback) callback();
	}
/*
	saveAll(structuredObject:StructuredSave, callback: Function):void {
		this.ipcRenderer.sendSync('pb_saveAll',{structuredObject});
		if(callback) callback();
	}
*/
	loadAll(callback: Function):void {
		let structuredObj = this.ipcRenderer.sendSync('pb_loadAll',{});
		if(callback) callback(structuredObj);
	}
	
	saveAllPacked(name :string, contents:jsonStr, callback: Function):void {
		this.ipcRenderer.sendSync('pb_saveAllPacked',{name, contents});
		if(callback) callback();
	}
	loadAllPacked(name :string, callback: Function):void {
		let content = this.ipcRenderer.sendSync('pb_loadAllPacked',{name});
		if(callback) callback(content);
	}
}
waitCall(()=>
	new _Storage_ElectronLocal_()
); //Since local but we wait for other js