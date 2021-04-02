///**************************************************/// Load
//Load from either saveFile or JSON format
//Returns true if successful, false if not
function loadSaveFile(saveFile :SaveFile|string, checkTime :boolean = true) :boolean {

	if(typeof saveFile === 'string')
	  saveFile = JSON.parse(saveFile) as SaveFile;
 
	dbg('loadSaveFile');
	
	extensions.invoke('loadSaveFile');
 
	saveFile = updateSaveFile(saveFile);
	if(saveFile === null) return false; //outdated
	
	if(checkTime && sync.lastSyncTime != null && sync.lastSyncTime >= saveFile.syncTime) //old, we have newer
	  return false;
	
	sync.flashLoadingIndicator();
 
	sync.lastSyncTime = saveFile.syncTime;
	pb = saveFile.pb;
	
	draw();
	
	return true;
 }

///**************************************************/// Reset
 function resetPB() :void{
	dbg("resetPB()");
	pb = new PBoard("", currentVersion);
	pb.boards[""] = new Board(BoardType.List,"",[],{},"");  //main board
	set_board("");
 }