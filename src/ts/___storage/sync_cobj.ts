let SAVING_DISABLED = false;
let CACHE_DISABLED = true;

let SAVE_FILENAME = 'pboard.pb';

type DirtyChangeTypeT = number;
const DirtyChangeType :{[index:string]:DirtyChangeTypeT} = {
	pb : 1,
	pbAttr : 2,
	pbTags : 3,
	board : 4,
	addon: 5,
	all: 99,
}
interface DirtyObjInterface {
	(p1?:any,p2?:any):void;
	
	pbData :boolean;
	pbAttr :boolean;
	pbTags :boolean;

	bRemoved :Set<BoardId>;
	bChanged :Set<BoardId>;
	addonRemoved :Set<string>;
	addonChanged :Set<string>;
	
	isInitialSave :boolean;
	isDirty :()=>boolean;
	unDirty :()=>void;
}

let sync : _Sync_ = null;
class _Sync_ {

  fileName: string;

  lastSyncTime: number; //if older than cloud one, load the cloud version
  syncedOnline: boolean; //synced from online (non cache) at least once
  syncSkips: number; //if not in focus, see the load interval
  syncSkipsTimes: number; //how many times to skip if not in focus

  autoSave :{interval:WindowInterval,time:number};
  autoLoad :{interval:WindowInterval,time:number};
  
  dirty:DirtyObjInterface;
  
  static init():void{if(sync==null)sync = new _Sync_();}


  constructor(){
    this.fileName = SAVE_FILENAME;

    this.lastSyncTime = -1; //if older than cloud one, load the cloud version
    this.syncedOnline = false; //synced from online (non cache) at least once
    this.syncSkips = 0; //if not in focus, see the load interval
    this.syncSkipsTimes = 5; //how many times to skip if not in focus
    
    this.autoSave = null;
	 this.autoLoad = null;

	 let dirtyFn = function(this: DirtyObjInterface,
		p1: DirtyChangeTypeT|string[] = undefined, p2: DirtyChangeTypeT = undefined
	){ ///////Function to mark dirty
		//console.log('dirty');
		//console.log(Object.keys(this));
		//console.log(this);
		let doBoard = (id:BoardId)=>{
			if(id in pb.boards)
				this.bChanged.add(id);
			else
				this.bRemoved.add(id);
		}
		let doAddon = (id:string)=>{
			if(id in pb.addons)
				this.addonChanged.add(id);
			else
				this.addonRemoved.add(id);
		}
		if(p1 === undefined && p2 === undefined){ /// no parameters
			return;
		}else if(p2 === undefined){ ///////////////// 1 parameter
			if(p1 == DirtyChangeType.pb){                // pb data
				this.pbData = true;
				return;
			}else if(p1 == DirtyChangeType.pbAttr){                // pb data2
				this.pbAttr = true;
				return;
			}else if(p1 == DirtyChangeType.pbTags){                // pb data2
				this.pbTags = true;
				return;
			}else if(p1 == DirtyChangeType.all){          // EVERYTHING
				///////////////////////////////////////TODO
				throw Error('not implemented dirty.all');
			}else if(p1 == DirtyChangeType.board){        // all boards ///TODO send all boards
				throw Error('not implemented all boards');
			}else if(p1 == DirtyChangeType.addon){         // all addons ///TODO send all addons
				throw Error('not implemented all addons');
			}
		}else{ ////////////////////////////////////// 2 parameters
			if(p2 == DirtyChangeType.board){
				(p1 as string[]).forEach(i=>doBoard(i));
			}else if(p2 == DirtyChangeType.addon){
				(p1 as string[]).forEach(i=>doAddon(i));
			}
		}
	} as any;

	dirtyFn.pbData = false;
	dirtyFn.pbAttr = false;
	dirtyFn.pbTags = false;
	dirtyFn.bRemoved = new Set();
	dirtyFn.bChanged = new Set();
	dirtyFn.addonRemoved = new Set();
	dirtyFn.addonChanged = new Set();

	dirtyFn.isInitialSave = false;
	dbg('inital save false');
	dirtyFn.isDirty = function():boolean{
		if(this.pbData) return true;
		let fields = [
			'bRemoved',
			'bChanged',
			'addonRemoved',
			'addonChanged'
		];
		for(let f in fields)
			if((this as any)[fields[f]].size != 0) return true;
		return false;
	};
	dirtyFn.unDirty = function():void{
		sync.dirty.pbData = false;
		sync.dirty.pbAttr = false;
		sync.dirty.pbTags = false;

		sync.dirty.bRemoved.clear();
		sync.dirty.bChanged.clear();
		sync.dirty.addonRemoved.clear();
		sync.dirty.addonChanged.clear();
	}
 
	dirtyFn = Object.assign(dirtyFn.bind(dirtyFn),dirtyFn);
	 this.dirty = dirtyFn  as DirtyObjInterface;
  }


  start(autoSave = true, autoLoad = true) :void{

    if(autoSave && pb.preferences['autoSaveInterval']!='0')
    this.autoSave = {
		 interval: setInterval(()=>{
			sync.autoSave.time+=1;
			if(sync.dirty.isDirty()==false) return;
			else startDirtyIndicator();
			if(sync.autoSave.time<pb.preferences['autoSaveInterval']) return;
			sync.autoSave.time = 0;
			dbg('sync save');
			sync.saveDirty();
		}, 1000),
		time:0
	};
    
    if(autoLoad && pb.preferences['autoLoadInterval']!='0')
    this.autoLoad = {
		interval: setInterval(()=>{
			sync.autoLoad.time+=1;
			if(sync.autoLoad.time<pb.preferences['autoLoadInterval']) return;
			sync.autoLoad.time = 0;
			//let checksum = hash(buildPBoard())
			//dont do if not in focus, save bandwith
			if(document.hasFocus()){
			sync.syncSkips = sync.syncSkips-1;
			}else sync.syncSkips = 0;

			if(sync.syncSkips<=0){
			sync.syncSkips = sync.syncSkipsTimes;
			sync.loadAll();
			}
		}, 1000),
		time:0
	};
  }
  

  setSyncTime() :void{
    this.lastSyncTime = timeNow();
  }

  buildPartialSegmentedSave():StructuredSave{
	  let save = pb.serializeAllStructured(
		this.dirty.pbData,
		this.dirty.pbAttr,
		this.dirty.pbTags,
		false, //we do addons ourselves
		false, //we do boards ourselves
	  );
		//Remove properties that are null
		for(let p in save){
			if((save as any)[p] === null)
				delete (save as any)[p];
		}
		if(this.dirty.addonChanged.size!=0){
			save.addons = {};
			this.dirty.addonChanged.forEach(i=>
				save.addons[i] = pb.addons[i].serialize()
			);
		}
		if(this.dirty.addonRemoved.size!=0){
			save.addonsRemoved = [];
			this.dirty.addonRemoved.forEach(i=>
				(save.addonsRemoved as string[]).push(i)
			);
		}
		
		if(this.dirty.bChanged.size!=0){
			save.boards = {};
			this.dirty.bChanged.forEach(i=>
				save.boards[i] = pb.boards[i].serialize()
			);
		}
		if(this.dirty.bRemoved.size!=0){
			save.boardsRemoved = [];
			this.dirty.bRemoved.forEach(i=>
				(save.boardsRemoved as string[]).push(i)
			);
		}
	  return save;
  }

  //loads pb from cookies, if it exists, else returns false
  loadCachedContent() :boolean{
    if(CACHE_DISABLED) return false; ////////////////////////TODO add option to disable cache? allow? idk.
    let contents :string|null = window.localStorage.getItem('cached');
    if(contents == null || contents == undefined) return false;
    
    if(loadAllStructured(JSON.parse(contents)))
     dbg('loading from cache');
    else
      dbg('not loading from cache');
    return true;
  }
  saveCachedContent(contents:string) :void{
	if(CACHE_DISABLED) return;
    window.localStorage.setItem('cached',contents);
    //setCookie('cached', contents)
  }

  saveDirty(callback:Function = null) :void{
	if(storage.isSegmented()==false)
		return this.saveAllPacked(callback);

	if(SAVING_DISABLED) return;

	try{
	  
	  dbg2('saveDirty');
	  dbg2('initialSave:',this.dirty.isInitialSave);

	  this.setSyncTime();
	  let saveFile = this.dirty.isInitialSave?
	  		pb.serializeAllStructured():
	  		this.buildPartialSegmentedSave();
	  
	  
		dbg2('saveFile:',saveFile);
		
	  if(this.syncedOnline == false)
		 return dbgw('Wont save: Not once synced with online. Wait or refresh.');
	  

	  startSavingIndicator();

	  //this.saveCachedContent(saveFile);

	  storage.callFn('savePartial',saveFile,()=>{
			sync.dirty.isInitialSave = false;
			sync.dirty.unDirty();
			stopSavingIndicator();
			if(callback!=null) callback();
	  });
 
	}catch(e){ throw e; }
  }
  saveAll(callback:Function = null):void{
	  this.dirty.isInitialSave = true;
	  this.saveDirty(callback);
  }
  saveAllPacked(callback:Function = null):void{
	if(SAVING_DISABLED) return;

	try{
	  
		dbg2('saveAllPacked');
		
		this.setSyncTime();
		let saveFile = JSON.stringify(pb.serializeAllStructured());
		
		
		if(this.syncedOnline == false)
		  return dbgw('Wont save: Not once synced with online. Wait or refresh.');
		
 
		startSavingIndicator();
 
		//this.saveCachedContent(saveFile);
 
		storage.callFn('saveAllPacked', this.fileName,saveFile,()=>{
			sync.dirty.isInitialSave = false;
			sync.dirty.unDirty();
			stopSavingIndicator();
			if(callback!=null) callback();
		});
  
	 }catch(e){ throw e; }
  }

  loadAll(callback:Function = null) :void{
	   if(storage.isSegmented()==false)
	  		return this.loadAllPacked(callback);
		try{
			startLoadingIndicator();
			storage.callFn('loadAll',(structuredObj:StructuredSave)=>{
				stopLoadingIndicator();
				this.syncedOnline = true;

				if (structuredObj && Object.keys(structuredObj).length &&
					loadAllStructured(structuredObj)
				){} else {
					dbg('loadAll - loaded null, reseting');
					resetPB();
				}
					
				if(callback) callback();
				//stopLoadingIndicator()
			});
		}catch(e){ throw e; }
	}
  loadAllPacked(callback:Function = null) :void{
      try{
  
        startLoadingIndicator();
  
        storage.callFn('loadAllPacked',(contents:string)=>{
			  stopLoadingIndicator();
          this.syncedOnline = true;
          if (contents != null && contents != '') {
            
            dbg('loadAll');
            loadAllStructured(JSON.parse(contents));
        
          }else{
            
            dbg('loaded null, resetting');
            resetPB();
          } 
            
          if(callback) callback(contents);
          //stopLoadingIndicator()
        });
  
    }catch(e){ throw e; }
  }
  loadPartial(callback:Function = null) :void{
	  throw Error("Not implemented"); ///////////////TODO
  }
  

}