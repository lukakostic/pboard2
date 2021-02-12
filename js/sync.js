//

let sync = {

  fileName: 'pboard.pb',
  //fileId not yet used
  fileId: null, //Use this fileId instead of looking for fileId by file name. Speeds up saving and loading since it doesnt need to find fileId
  
  lastSyncTime: null, //if older than cloud one, load the cloud version
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
  

  setSyncTime: function(){
    this.lastSyncTime = (new Date()).getTime()
  },

  flashLoadingIndicator: ()=>{
    ui.startLoadingIndicator()
    setTimeout(()=>{
      ui.stopLoadingIndicator()
    },2000)
  },

  //loads pb from cookies, if it exists, else returns false
  loadCachedContent: function(){
    let contents = window.localStorage.getItem('cached')
    if(contents == null || contents == undefined) return false
    
    if(loadPBoard(contents))
    // $FlowIgnore[extra-arg]
     logw('loading from cache')
     // $FlowIgnore[extra-arg]
    else logw('not loading from cache')
    extensions.invoke('loadCached')
    return true
  },

  saveCachedContent: (contents)=>{
    window.localStorage.setItem('cached',contents)
    //setCookie('cached', contents)
  },

  saveAll: function(callback = null){
    try{

      extensions.invoke('pre_saveAll')
      
      
      sync.setSyncTime()
      let contents = buildPBoard()
      
      // $FlowIgnore[extra-arg]
      log('saveAll ',contents)
      
      if(sync.syncedOnline == false)
        return console.warn('Wont save: Not once synced with online. Wait or refresh.')
      

      ui.startSavingIndicator()

      sync.saveCachedContent(contents)

      storage.fileUpload({name: sync.fileName, body: contents},()=>{
  
        if(callback!=null) callback()
        ui.stopSavingIndicator()
        extensions.invoke('saveAll')
        
        sync.save.dirty = false
      })
  
    }catch(e){/*$FlowIgnore[extra-arg]*/ alog(e) }
  },

  loadAll: function(callback = null){
      try{
  
        extensions.invoke('pre_loadAll')
        //ui.startLoadingIndicator()
  
        storage.fileDownload(sync.fileName , (contents)=>{
  
          sync.syncedOnline = true
          if (contents != null && contents != '') {
            
            // $FlowIgnore[extra-arg]
            log('loading contents ',contents)
            loadPBoard(contents)
            extensions.invoke('loadAll')
        
          }else{
            // $FlowIgnore[extra-arg]
            logw('loaded null, resetting')
            resetData()
          } 
            
          if(callback) callback(contents)
          //ui.stopLoadingIndicator()
        })
  
    }catch(e){/*$FlowIgnore[extra-arg]*/ alog(e) }
  },

  

  start: function(doAutoLoadSave = true){

    if(doAutoLoadSave == false || pb.preferences['autoLoadInterval'].toString()=="0") return

    this.save.interval = setInterval(()=>{
      if(sync.save.dirty == false) return;
      
      sync.save.dirty = false
      // $FlowIgnore[extra-arg]
      log('sync save')
      sync.saveAll()
      
    }, pb.preferences['autoSaveInterval']*1000)

    this.load.interval = setInterval(()=>{
      //let checksum = hash(buildPBoard())
      //dont do if not in focus, save bandwith
      if(document.hasFocus()){
        sync.syncSkips = sync.syncSkips-1
      }else sync.syncSkips = 0

      if(sync.syncSkips<=0){
        sync.syncSkips = sync.syncSkipsTimes
        sync.loadAll()
      }
    }, pb.preferences['autoLoadInterval']*1000)
  },

}