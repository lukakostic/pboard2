type ViewModeT = number;
const ViewMode = {
   List :0,
   Board :1,

   toString(val :number) :string|null{
      for(let k in this) if(this[k] == val) return k;
      return null;
  }
}
const ViewMode2 = {
   None :0,
   Notes :1,
   Grid :2,

   toString(val :number) :string|null{
       for(let k in this) if(this[k] == val) return k;
       return null;
   }
}

let mainView :View = null; //current main, top level view
let viewMode :ViewModeT = ViewMode.List;
let viewMode2 :ViewModeT = ViewMode2.None;

function setMainView(v :View) :void{
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
   html.main.setAttribute('data-viewMode',ViewMode.toString(vm1));
   viewMode2 = vm2;
   html.main.setAttribute('data-viewMode2',ViewMode.toString(vm2));
}