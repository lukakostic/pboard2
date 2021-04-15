let ENABLE_NONLOADED_DRAW = false;

let storage :_Storage_ = null;
type storageFunctions = 
"fileUpload"|
"fileDownload"|
"fileDelete"|
"makeFolder"|
"savePartial"|
"saveAll"|
"loadAll"|
"saveAllPacked"|
"loadAllPacked";
class _Storage_ {
	//storages : StorageSegmentedInterface[]|StorageSimpleInterface[];
  type : StorageTypeT;
  storageInstance :StorageSegmentedInterface|StorageSimpleInterface = null;

  static init(storageType :StorageTypeT):void{if(storage==null)storage = new _Storage_(storageType);}

  constructor(storageType :StorageTypeT){
    this.type = storageType;
    _Sync_.init(); //so both are initialized
  }

  OnStorageLoad(_storageType :StorageTypeT, storageInstance :any) :void{
    if(this.type != _storageType) return;

	 dbg2("Storage OnStorageLoad");
    
	 this.storageInstance = storageInstance;
	 //this.storageInstance.OnStorageLoad();

    board = boardFromUrl();
	 console.log(board);
      
    dbg2('Storage loaded, initial reset or load');
    
    if(this.type == StorageType.None) // Since we just loaded None type
      return resetPB();

	 if(ENABLE_NONLOADED_DRAW){
		if(sync.loadCachedContent() == false) //load from cache or reset
			resetPB();
		else
			draw(); //draw cache opened
	 }

	 draw_initialLoaded = true;
    sync.loadAll(); //sync with cloud
  
    sync.start(true, false); // dont want to auto load
  
  }

  isSegmented():boolean{
	  return (this.type & StorageType.Segmented)==1;
  }

  callFn(fn_name:storageFunctions,...args:any):boolean{
	  dbg2('storage fn ' + fn_name);
	  if(fn_name in this.storageInstance == false) return false;
	  (this.storageInstance as any)[fn_name](...args);
	  return true;
  }

}

