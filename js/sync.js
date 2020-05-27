let sync = {

  save: {
    dirty: false, //when something changes and needs saving
    interval: null,
  },
  
  load: {
    interval: null,
  },

  saveAll: (callback = null)=>{
    try{
  
      extensions.invoke('pre_saveAll')
      ui.startSavingIndicator()
  
      let contents = buildProject()
      
      log('saveAll ',contents)
  
      storage.fileUpload({name: 'pboard.pb', body: contents},()=>{
  
        if(callback!=null) callback()
        ui.stopSavingIndicator()
        extensions.invoke('saveAll')
        
        sync.save.dirty = false
      })
  
    }catch(e){ log(e) }
  },

  loadAll: (callback = null)=>{
      try{
  
        extensions.invoke('pre_loadAll')
        ui.startLoadingIndicator()
  
        storage.fileDownload('pboard.pb' , (contents)=>{
  
  
          if (contents != null && contents != '') {
            
            log('loading contents ',contents)
            loadProject(contents)
            extensions.invoke('loadAll')
        
          }else{
            log('loaded null, resetting')
            resetData()
          } 
            
          if(callback) callback()
          ui.stopLoadingIndicator()
        })
  
    }catch(e){ log(e) }
  },

  start: function(){
    this.save.interval = setInterval(()=>{
      if(sync.save.dirty == false) return;
      
      sync.save.dirty = false
      log('sync save')
      sync.saveAll()
      
    }, project.preferences['autoSaveInterval']*1000)
  },

}