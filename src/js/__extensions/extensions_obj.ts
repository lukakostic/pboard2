let EXTENSIONS_DISABLED = true; ////////////TODO load from preferences

const extensions = {
  //arrays of callbacks that get called when event invoked
  listeners: ///////////TODO change from holding Array<Function> to holding Array<{string:Function}>? So you can subscribe and unsubscribe too!
  {
    newPage: [],
    pre_newPage: [],
    saveAll: [],
    pre_saveAll: [],
    loadAll: [],
    pre_loadAll: [],
    draw: [],
    buildPBoard: [],
    loadSaveFile: [],
    loadCached: [],
  } as {[index:string]:Function[]},
  
  invoke(listener :string = "") :void{
    if(EXTENSIONS_DISABLED) return;

    dbg('Invoking listener:',listener);
    for(let i = 0; i < this.listeners[listener].length; i++)
      if(this.listeners[listener])
        this.listeners[listener][i]();
    
    this.listeners[listener] = [];
  },

  execute() :void{
    if(EXTENSIONS_DISABLED) return;

    dbg('extensions.execute()');
    let exts = brdAttrOrDef(board,'extensions',[]);
    for(let i = 0; i < exts.length; i++){
      if(exts[i].on){
        dbg('executing extension ' + exts[i].id);
        eval(pb.extensions[exts[i].id].code);
      }
    }
  }
}