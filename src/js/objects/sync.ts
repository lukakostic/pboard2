
let sync = {

  fileName: 'pboard.pb',
  //fileId not yet used
  fileId: null, //Use this fileId instead of looking for fileId by file name. Speeds up saving and loading since it doesnt need to find fileId
  
  lastSyncTime: -1, //if older than cloud one, load the cloud version
  syncedOnline: false, //synced from online (non cache) at least once

  syncSkips: 0, //if not in focus, see the load interval
  syncSkipsTimes: 5, //how many times to skip if not in focus

  save: {
    dirty: false, //when something changes and needs saving
    interval: null,
  },
  
  load: {
    interval: null,
  },
  

  setSyncTime() :void{
    this.lastSyncTime = (new Date()).getTime();
  },

  flashLoadingIndicator() :void{
    startLoadingIndicator();
    setTimeout(()=>{
      stopLoadingIndicator();
    },2000);
  },

  //loads pb from cookies, if it exists, else returns false
  loadCachedContent() :boolean{
    return false; ////////////////////////TODO add option to disable cache? allow? idk.
    let contents :string|null = window.localStorage.getItem('cached');
    if(contents == null || contents == undefined) return false;
    
    if(loadPBoard(contents))
     logw('loading from cache');
    else
      logw('not loading from cache');
    extensions.invoke('loadCached');
    return true;
  },

  saveCachedContent(contents) :void{
    window.localStorage.setItem('cached',contents);
    //setCookie('cached', contents)
  },

  saveAll(callback = null, really=false) :void{ ////Added the really? option
    if(really == false) return; //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    try{

      extensions.invoke('pre_saveAll');
      
      
      sync.setSyncTime();
      let contents = buildPBoard();
      
      
      log('saveAll ',contents);
      
      if(sync.syncedOnline == false)
        return console.warn('Wont save: Not once synced with online. Wait or refresh.');
      

      startSavingIndicator();

      sync.saveCachedContent(contents);

      storage.fileUpload({name: sync.fileName, body: contents},()=>{
  
        if(callback!=null) callback();
        stopSavingIndicator();
        extensions.invoke('saveAll');
        
        sync.save.dirty = false;
      })
  
    }catch(e){ alog(e); }
  },

  loadAll(callback = null) :void{
      try{
  
        extensions.invoke('pre_loadAll')
        //startLoadingIndicator()
  
        storage.fileDownload(sync.fileName , (contents)=>{
  
          sync.syncedOnline = true
          if (contents != null && contents != '') {
            
            
            log('loading contents ',contents)
            loadPBoard(contents)
            extensions.invoke('loadAll')
        
          }else{
            
            logw('loaded null, resetting')
            resetData()
          } 
            
          if(callback) callback(contents)
          //stopLoadingIndicator()
        })
  
    }catch(e){ alog(e) }
  },

  

  start(doAutoLoadSave = true) :void{

    if(doAutoLoadSave == false || pb.preferences['autoLoadInterval'].toString()=="0") return;

    this.save.interval = setInterval(()=>{
      if(sync.save.dirty == false) return;
      
      sync.save.dirty = false;
      
      log('sync save');
      sync.saveAll();
      
    }, pb.preferences['autoSaveInterval']*1000);

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

}