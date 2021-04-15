///**************************************************/// Reset
function resetPB() :void{
	dbg("resetPB()");
	sync.dirty.isInitialSave = true;
	dbg('reset initialSave:', sync.dirty.isInitialSave);
	pb = new PBoard("", currentVersion);
	pb.boards[""] = new Board(BoardType.List,"",[],{},"");  //main board
	set_board("");
}

///**************************************************/// Load

function loadAllStructured(structuredObj :StructuredSave, checkTime :boolean = false) :boolean {
	dbg2('loadAllStructured',structuredObj);
	let successful = false;
	try
	{
		pb = new PBoard();
		pb.deserializePBData(structuredObj.pb);
		pb.deserializeAttributes(structuredObj.pbAttributes);
		pb.deserializeTags(structuredObj.pbTags);
		pb.deserializeAllAddons(structuredObj.addons);
		pb.deserializeAllBoards(structuredObj.boards);
		successful = true;
	}
	catch(e){
		successful = false;
	}
	draw();
	return successful;
}
/*
//////////TODO implement Updating and checkTime for loadAllStructured (above) from loadPacked(below), until then its commented off just as archive!
//Returns true if successful, false if not (eg couldnt update)
function loadPacked(saveFileJSON :string, checkTime :boolean = false) :boolean {
 
	let saveFile = JSON.parse(saveFileJSON) as StructuredSave;

	dbg('loadPacked');
	
	saveFile = updateSaveFile(saveFile);
	if(saveFile === null) return false; //outdated
	
	
	if(checkTime && sync.lastSyncTime != null && sync.lastSyncTime >= saveFile.syncTime) //old, we have newer
	  return false;
	
 
	sync.lastSyncTime = saveFile.syncTime;
	pb = saveFile.pb;
	
	draw();
	
	return true;
 }

 */