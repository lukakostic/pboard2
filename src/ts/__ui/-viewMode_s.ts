type ViewModeT = number;
const ViewMode = {
   List :0,
   Board :1,
}
const ViewTheme = {
   None :0,
   Notes :1,
   VerticalLists :2,
}

let mainView :ViewTree = null; //current main, top level view
let viewMode :ViewModeT = ViewMode.List;
let viewTheme :ViewModeT = ViewTheme.None;

function setMainView(v :ViewTree) :void{
   mainView = v;

	let theme = getBoardViewTheme(mainView.id);

   if(pb.boards[mainView.id].type == BoardType.List)
      setViewMode(ViewMode.List,theme);
   else
      setViewMode(ViewMode.Board,theme);
   

   //Make tab title same as board name
   let brdName = pb.boards[board].name;
   document.title = brdName? brdName + " - PBoard" : "PBoard";

   header.loadHeaderData();
}

function setViewMode(vm :ViewModeT, vt :ViewModeT = ViewTheme.None):void{
   viewMode = vm;
   html.main.setAttribute('data-viewMode',enumToStr(ViewMode, vm));
   viewTheme = vt;
   html.main.setAttribute('data-viewTheme',enumToStr(ViewTheme, vt));
}

function getBoardViewTheme(id:BoardId):ViewModeT{
	if('viewTheme' in pb.boards[id].attributes)
		return pb.boards[id].attributes.viewTheme;
	return ViewTheme.None;
}