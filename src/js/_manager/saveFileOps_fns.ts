///**************************************************/// Build
//Returns JSON
function buildPBoard() :string{
	extensions.invoke('buildPBoard');
	let saveFile :SaveFile = {
		syncTime: sync.lastSyncTime,  
		pb: pb
	};
	return JSON.stringify(saveFile);
}

 

///**************************************************/// Update
// null if cant, SaveFile if successful
function updateSaveFile(saveFile :any) :SaveFile|null{
    function copyNewProperties(from :any, to :any) :any{
        let fields = Object.keys(from);
        for(let i = 0; i < fields.length; i++){
            if((fields[i] in to) == false)
                to[fields[i]] = from[fields[i]];
        }
        return to;
    }

    if(saveFile['pb'] && saveFile.pb['version'] == currentVersion) //called again at end of update
		  return saveFile as SaveFile;
		
	 dbg("updateSaveFile",saveFile);

    
    if(saveFile['version'] && saveFile['version'] == 1){
        delete saveFile.preferences['manualSaveLoad'];
        let pref = copyNewProperties(new PBoard().preferences,saveFile.preferences);
        saveFile.preferences = pref;
        saveFile.version = 2;
    }
    //saveFile.version>=3
    if(saveFile['version'] && saveFile['version'] == 2){
        let pref = copyNewProperties(new PBoard().preferences,saveFile.preferences);
        saveFile.preferences = pref;
        saveFile.version = 3;

        saveFile = {
            syncTime: 0,
            pb: saveFile
        };
    }
    if(saveFile['project'] && saveFile.project['version'] == 3){
        Object.defineProperty(saveFile, 'pb', Object.getOwnPropertyDescriptor(saveFile, 'project'));
        delete saveFile['project'];
        saveFile.pb.version = 3.1;
    }
    
    if(saveFile['pb'] && saveFile.pb['version'] == 3.1){
        for(let i in saveFile.pb.boards)
            delete saveFile.pb.boards[i].attributes['references'];
        saveFile.pb.boards[''].attributes = {};
        saveFile.pb.version = 4;
    }

    if(saveFile['pb'] && saveFile.pb['version'] == currentVersion)
        return saveFile as SaveFile;
    
    return null; //failed to update
}