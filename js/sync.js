let sync = {

  fileName: 'pboard.pb',
  fileId: null, //Use this fileId instead of looking for fileId by file name. Speeds up saving and loading since it doesnt need to find fileId
  
  lastSyncTime: null, //if older than cloud one, load the cloud version

  save: {
    dirty: false, //when something changes and needs saving
    interval: null,
  },
  
  load: {
    interval: null,
  },
  

  setSyncTime: ()=>{
    sync.lastSyncTime = (new Date()).getTime()
  },

  flashLoadingIndicator: ()=>{
    ui.startLoadingIndicator()
    setTimeout(()=>{
      ui.stopLoadingIndicator()
    },2000)
  },

  //loads project from cookies, if it exists, else returns false
  loadCachedContent: ()=>{
    let contents = window.localStorage.getItem('cached')
    if(contents == null || contents == undefined) return false
    logw('loading from cache')
    loadProject(contents)
    extensions.invoke('loadCached')
    return true
  },

  saveCachedContent: (contents)=>{
    window.localStorage.setItem('cached',contents)
    //setCookie('cached', contents)
  },

  saveAll: (callback = null)=>{
    try{
  
      extensions.invoke('pre_saveAll')
      ui.startSavingIndicator()
      
      sync.setSyncTime()
      let contents = buildProject()
      
      log('saveAll ',contents)


      sync.saveCachedContent(contents)

      storage.fileUpload({name: sync.fileName, body: contents},()=>{
  
        if(callback!=null) callback()
        ui.stopSavingIndicator()
        extensions.invoke('saveAll')
        
        sync.save.dirty = false
      })
  
    }catch(e){ alog(e) }
  },

  loadAll: (callback = null)=>{
      try{
  
        extensions.invoke('pre_loadAll')
        //ui.startLoadingIndicator()
  
        storage.fileDownload(sync.fileName , (contents)=>{
  
  
          if (contents != null && contents != '') {
            
            log('loading contents ',contents)
            loadProject(contents)
            extensions.invoke('loadAll')
        
          }else{
            logw('loaded null, resetting')
            resetData()
          } 
            
          if(callback) callback(contents)
          //ui.stopLoadingIndicator()
        })
  
    }catch(e){ alog(e) }
  },

  

  start: ()=>{
    sync.save.interval = setInterval(()=>{
      if(sync.save.dirty == false) return;
      
      sync.save.dirty = false
      log('sync save')
      sync.saveAll()
      
    }, project.preferences['autoSaveInterval']*1000)

    sync.load.interval = setInterval(()=>{
      //let checksum = hash(buildProject())
      sync.loadAll()
    }, project.preferences['autoLoadInterval']*1000)
  },

}