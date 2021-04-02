type StorageTypeT = number;
const StorageType = {
	// 0 is local, none, cache ? Idk
	None: 0,
	ElectronLocal: 1,
	Drive: 2,
 };

 interface SaveFile {
	syncTime: number;  
	pb: PBoard;
 }
 
 interface StorageInterface {
	OnStorageLoad(...args: any[]) :void;
	fileUpload(file :string, callback: Function) :void;
	fileDownload(callback :Function) :void;
	//fileDelete(name :string, callback :Function) :void;
	//fileIdByName(name :string, callback :Function) :void;
 }
 