let storage :_Storage_ = null;
class _Storage_ implements StorageInterface {
  type : StorageTypeT;

  static init(storageType :StorageTypeT):void{if(storage==null)storage = new _Storage_(storageType);}

  constructor(storageType :StorageTypeT){
    this.type = storageType;
    _Sync_.init(); //so both are initialized
  }

  OnStorageLoad(_storageType :StorageTypeT) :void{
    if(this.type != _storageType) return;
    
    board = boardFromUrl();
      
    dbg('Storage loaded, initial reset or load');
    
    if(this.type == StorageType.None) // Since we just loaded None type
      return resetPB();

    if(sync.loadCachedContent() == false) //load from cache or reset
      resetPB();
    else
      draw(); //draw cache opened
    
    sync.loadAll(); //sync with cloud
  
    sync.start(true, false); // dont want to auto load
  
  }



  //file: name, body
  fileUpload(file :string, callback:Function=null) :void{
	if(this.type == StorageType.Drive)
	  return storage_gDrive.fileUpload(file,callback);
	if(this.type == StorageType.ElectronLocal)
		return storage_electronLocal.fileUpload(file,callback);

	throw new Error('NO STORAGE?!?!??!');
  }


  //If downloaded, pass contents. Else pass null to callback
  fileDownload(callback:(content:string)=>any) :void{
    if(this.type == StorageType.Drive)
		return storage_gDrive.fileDownload(callback);
	if(this.type == StorageType.ElectronLocal)
		return storage_electronLocal.fileDownload(callback);
		
		
	throw new Error('NO STORAGE?!?!??!');
  }

}

