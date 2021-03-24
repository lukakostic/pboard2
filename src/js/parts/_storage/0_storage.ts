const StorageType = {
  // 0 is local, none, cache ? Idk
  None: 0,
  Drive: 1
};
interface StorageInterface {
  OnStorageLoad(...args: any[]) :void,
  fileIdByName(name :string, callback :Function) :void,
  fileUpload(file /*?*/, callback: Function) :void,
  fileDownload(name :string, callback :Function) :void,
  fileDelete(name :string, callback :Function) :void,
}

let storage :_Storage_ = null;
class _Storage_ implements StorageInterface {
  type : number;

  static init(storageType :number):void{if(storage==null)storage = new _Storage_(storageType);}

  constructor(storageType :number){
    this.type = storageType;
    _Sync_.init(); //so both are initialized
  }

  OnStorageLoad(_storageType :number) :void{
    if(this.type != _storageType) return;
    
    board = boardFromUrl();
      
    logw('Storage loaded, initial reset or load');
    
    if(this.type == StorageType.None)
      return resetData();

    if(sync.loadCachedContent() == false) //load from cache or reset
      resetData();
    else
      pageOpened(); //draw cache opened
    
    sync.loadAll(); //sync with cloud
  
    sync.start(true, false); // dont want to auto load
  
  }


  fileIdByName(name, callback) :void{
    if(this.type == StorageType.Drive)
      return drive_storage.fileIdByName(name,callback);
  }


  //file: name, body
  fileUpload(file, callback=null) :void{
    if(this.type == StorageType.Drive)
      return drive_storage.fileUpload(file,callback);
  }


  //If downloaded, pass contents. Else pass null to callback
  fileDownload(name, callback) :void{
    if(this.type == StorageType.Drive)
      return drive_storage.fileDownload(name,callback);
  }


  fileDelete(name, callback=null) :void{
    if(this.type == StorageType.Drive)
      return drive_storage.fileDelete(name,callback);
  }

}

