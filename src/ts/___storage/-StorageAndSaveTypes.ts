type StorageTypeT = number;
const StorageType = {
	JSONOnly: 0,
	Segmented: 1,

	None: 2|0,
	ElectronLocal: 4|1,
	Drive: 8|0,
 };

 type StructuredSave = {
	 pb: jsonStr,
	 pbAttributes: jsonStr,
	 pbTags: jsonStr,
	 addons:{
		 [index:string]:jsonStr
	 },
	 addonsRemoved: string[]|'*', // * meaning only ones in addons exist, delete rest
	 boards:{
		[index:string]:jsonStr
	 },
	 boardsRemoved:string[]|'*', // * meaning only ones in boards exist, delete rest
 }
 
interface StorageSimpleInterface {   //Only supports packed (json) format
	OnStorageLoad(...args: any[]) :void;

	saveAllPacked(name :string, contents :jsonStr, callback: Function|null) :void;
	loadAllPacked(name :string, callback :Function) :void;
}
 

interface StorageSegmentedInterface {   //Supports segmented (folder and file creation)
	OnStorageLoad(...args: any[]) :void;

	fileUpload(path :string, contents :string, callback: Function|null) :void;
	fileDownload(path :string, callback :Function) :void;
	fileDelete(path :string, callback :Function|null) :void;
	makeFolder(name :string, callback: Function):void;

	savePartial(partialStructuredObject:any, callback :Function):void;
	//saveAll(structuredObject:StructuredSave, callback :Function):void;
	loadAll(callback :Function):void;

	saveAllPacked(name :string, contents:jsonStr, callback :Function):void;
	loadAllPacked(name :string, callback :Function):void;
}