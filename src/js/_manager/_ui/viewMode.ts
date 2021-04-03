type ViewModeT = number;
const ViewMode :{[index:string]: ViewModeT} = {
   List :0,
   Board :1,
}
const ViewMode2 :{[index:string]: ViewModeT} = {
   None :0,
   Notes :1,
   Grid :2,
}

let mainView :ViewTree = null; //current main, top level view
let viewMode :ViewModeT = ViewMode.List;
let viewMode2 :ViewModeT = ViewMode2.None;

function setMainView(v :ViewTree) :void{
   mainView = v;

   if(pb.boards[mainView.id].type == BoardType.List)
      setViewMode(ViewMode.List,0);
   else
      setViewMode(ViewMode.Board,0);
   

   //Make tab title same as board name
   let brdName = pb.boards[board].name;
   document.title = brdName? brdName + " - PBoard" : "PBoard";

   header.loadHeaderData();
}

function setViewMode(vm1 :ViewModeT, vm2 :ViewModeT):void{
   viewMode = vm1;
   html.main.setAttribute('data-viewMode',enumToStr(ViewMode, vm1));
   viewMode2 = vm2;
   html.main.setAttribute('data-viewMode2',enumToStr(ViewMode2, vm2));
}