let SAVING_DISASBLED = false;
let CACHE_DISABLED = true;

let SAVE_FILENAME = 'pboard.pb';

let sync : _Sync_ = null;
class _Sync_ {

  fileName: string;

  lastSyncTime: number; //if older than cloud one, load the cloud version
  syncedOnline: boolean; //synced from online (non cache) at least once

  syncSkips: number; //if not in focus, see the load interval
  syncSkipsTimes: number; //how many times to skip if not in focus

  save :{dirty:boolean, interval:number|null};
  load :{interval:number|null};
  
  static init():void{if(sync==null)sync = new _Sync_();}

  constructor(){
    this.fileName = SAVE_FILENAME;

    this.lastSyncTime = -1; //if older than cloud one, load the cloud version
    this.syncedOnline = false; //synced from online (non cache) at least once
  
    this.syncSkips = 0; //if not in focus, see the load interval
    this.syncSkipsTimes = 5; //how many times to skip if not in focus

    
    this.save = {
      dirty: <boolean> false, //when something changes and needs saving
      interval: <number|null> null,
    }
    
    this.load = {
      interval: <number|null> null,
    }
  }


  start(autoSave = true, autoLoad = true) :void{

    if(autoSave && pb.preferences['autoSaveInterval']!='0')
    this.save.interval = setInterval(()=>{
      if(sync.save.dirty == false) return;
      
      sync.save.dirty = false;
      
      dbg('sync save');
      sync.saveAll();
      
    }, pb.preferences['autoSaveInterval']*1000);
    
    if(autoLoad && pb.preferences['autoLoadInterval']!='0')
    this.load.interval = setInterval(()=>{
      //let checksum = hash(buildPBoard())
      //dont do if not in focus, save bandwith
      if(document.hasFocus()){
        sync.syncSkips = sync.syncSkips-1;
      }else sync.syncSkips = 0;

      if(sync.syncSkips<=0){
        sync.syncSkips = sync.syncSkipsTimes;
        sync.loadAll();
      }
    }, pb.preferences['autoLoadInterval']*1000);
  }
  

  setSyncTime() :void{
    this.lastSyncTime = (new Date()).getTime();
  }

  flashLoadingIndicator() :void{
    startLoadingIndicator();
    setTimeout(()=>{
      stopLoadingIndicator();
    },2000);
  }

  //loads pb from cookies, if it exists, else returns false
  loadCachedContent() :boolean{
    if(CACHE_DISABLED) return false; ////////////////////////TODO add option to disable cache? allow? idk.
    let contents :string|null = window.localStorage.getItem('cached');
    if(contents == null || contents == undefined) return false;
    
    if(loadSaveFile(contents))
     dbg('loading from cache');
    else
      dbg('not loading from cache');
    extensions.invoke('loadCached');
    return true;
  }

  saveCachedContent(contents:string) :void{
	if(CACHE_DISABLED) return;
    window.localStorage.setItem('cached',contents);
    //setCookie('cached', contents)
  }
  setDirty():void{
	  this.save.dirty = true;
	  startDirtyIndicator();
  }
  saveAll(callback:Function = null) :void{ ////Added the really? option
    if(SAVING_DISASBLED) return;

    try{

      extensions.invoke('pre_saveAll');
		
		dbg('saveAll');
      
      this.setSyncTime();
      let saveFile = buildPBoard();
      
      
      if(this.syncedOnline == false)
        return dbgw('Wont save: Not once synced with online. Wait or refresh.');
      

      startSavingIndicator();

      this.saveCachedContent(saveFile);

      storage.fileUpload(saveFile,()=>{
  
        if(callback!=null) callback();
        stopSavingIndicator();
        extensions.invoke('saveAll');
        
		  sync.save.dirty = false;
		  
		});
  
    }catch(e){ throw e; }
  }

  loadAll(callback:Function = null) :void{
      try{
  
        extensions.invoke('pre_loadAll')
        startLoadingIndicator();
  
        storage.fileDownload((contents:string)=>{
			  stopLoadingIndicator();
          this.syncedOnline = true;
          if (contents != null && contents != '') {
            
            dbg('loadAll');
            loadSaveFile(contents);
            extensions.invoke('loadAll');
        
          }else{
            
            dbg('loaded null, resetting');
            resetPB();
          } 
            
          if(callback) callback(contents);
          //stopLoadingIndicator()
        });
  
    }catch(e){ throw e; }
  }

  

}