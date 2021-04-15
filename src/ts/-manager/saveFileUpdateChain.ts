function updateSaveFileChain(saveFile:any){
	function copyNewProperties(from :any, to :any) :any{
		for(let f in from){
			 if(f in to == false)
				  to[f] = from[f];
		}
		return to;
  }


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

  return saveFile;
}