const StorageType = {
  // 0 is local, none, cache ? Idk
  None: 0,
  Drive: 1
};

let storage = {

  type: StorageType.None, ////////// Storage type /////////////TODO change to drive?

  StorageLoaded(_storageType :number) :void{
    if(this.type != _storageType) return;
    
    board = boardFromUrl(url());
      
    logw('Storage loaded, initial reset or load');
    
    if(this.type == StorageType.None)
      return resetData();

    if(sync.loadCachedContent() == false) //load from cache or reset
      resetData();
    else
      pageOpened(); //draw cache opened
    
    sync.loadAll(); //sync with cloud
  
    sync.start(false); ///////////////DONT AUTO SAVE/LOAD
  
  },


  fileIdByName(name, callback) :void{
    if(this.type == StorageType.Drive)
      return drive_storage.fileIdByName(name,callback);
  },


  //file: name, body
  fileUpload(file, callback=null) :void{
    if(this.type == StorageType.Drive)
      return drive_storage.fileUpload(file,callback);
  },


  //If downloaded, pass contents. Else pass null to callback
  fileDownload(name, callback) :void{
    if(this.type == StorageType.Drive)
      return drive_storage.fileDownload(name,callback);
  },


  fileDelete(name, callback=null) :void{
    if(this.type == StorageType.Drive)
      return drive_storage.fileDelete(name,callback);
  }

}

