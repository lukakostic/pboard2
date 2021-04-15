///**************************************************/// Build
 //Returns JSON
function buildPBPacked() :string{
	let saveFile :any = {
		syncTime: sync.lastSyncTime,  
		pb: pb
	};
	return JSON.stringify(saveFile);
}


///**************************************************/// Update
// null if cant, SaveFile if successful
function updateSaveFile(saveFile :any) :StructuredSave|null{

    if(saveFile['pb'] && saveFile.pb['version'] == currentVersion) //called again at end of update
		  return saveFile as StructuredSave;
		
	 dbg("updateSaveFile",saveFile);

	 saveFile = updateSaveFileChain(saveFile);
	 
    if(saveFile['pb'] && saveFile.pb['version'] == currentVersion)
        return saveFile as StructuredSave;
    
    return null; //failed to update
}