type ViewModeT = number;
const ViewMode :{[index:string]:ViewModeT} = {
   List :0,
   Board :1
}

let mainView :View = null; //current main, top level view
let viewMode :ViewModeT = ViewMode.List;

function setMainView(v :View) :void{
   mainView = v;
   if(pb.boards[mainView.id].type == BoardType.List){
      viewMode = ViewMode.List;
      html.main.setAttribute('data-view',"ViewModeList");
   }else{
      viewMode = ViewMode.Board;
      html.main.setAttribute('data-view',"ViewModeBoard");
   }
}
function clearMainView() :void{
   mainView = null;
   html.main.innerHTML = "";
   viewMode = ViewMode.List;
}

interface View{ /* A (board kind) element display. Album, List, Tile. */
   id :string;
   parentEl : HTMLElement|Element;
   htmlEl : HTMLElement|Element;


   buildSelf :Function; /* Create all html stuff needed to render MYSELF (not children too). Step before render. */
   //buildAll :Function; /* Build self and all children if needed. On tile same as buildSelf. */

   render :Function; /* Render yourself and call render on children (if any) */
   renderById :Function; /* Element gets called to render. If not current element, call render on children (if any) */

}
/* generate required type based on board type */
function generateView(_id :string, _parentEl :HTMLElement|Element) :AlbumView|ListView|TileView|null{
   let type = pb.boards[_id].type;
   if(_parentEl == html.main){
      if(type == BoardType.List)
         return new ListView(_id, _parentEl);
      if(type == BoardType.Text)
         throw "Trying to open text fullscreen";
      
      //Pboard, Board
      return new AlbumView(_id, _parentEl);
   }else if(viewMode == ViewMode.Board){
      /////////////////////TODO maybe i should remove the second check, it looks cool to have lists in lists..
      if(type == BoardType.List && _parentEl == (<HolderView>mainView).holderElement)
         return new ListView(_id, _parentEl);
      return new TileView(_id, _parentEl);
   }else if(viewMode == ViewMode.List){
      return new TileView(_id, _parentEl);
   }
   return null;
}


/* Generic class for element holder View. Not meant to be instantiated, just inherited/extended. */
abstract class HolderView implements View{
   id :string;
   parentEl : HTMLElement|Element;
   htmlEl : HTMLElement;

   holderElement : HTMLElement; /* Element that holds other elements */
   elements : Array<View>; //holds every base type of element (view)

   constructor(_id :string = "", _parentEl :HTMLElement|Element){
      this.id = _id;
      this.parentEl = _parentEl;
      this.htmlEl = null;

      this.holderElement = null;
      this.elements = [];

      if(this.parentEl == html.main)
         setMainView(this);
   }


   generateElements() :void{
      
      if(pb.boards[this.id].type == BoardType.Text)
         throw 'HolderView used for text';

      let len = pb.boards[this.id].content.length;
      this.elements.length = len;
      for(let i = 0; i < len; i++){

         if(this.elements[i] == undefined || this.elements[i] == null)
            this.elements[i] = generateView(pb.boards[this.id].content[i], this.holderElement);
         else
            this.elements[i].id = pb.boards[this.id].content[i];
         
      }
   }

   buildSelf() :void{
      //this.holderElement.outerHTML =  templateFChild("").outerHTML; /*abstract*/
      
      /* Abstract, but here you should check first if your element has all the html stuff it needs. create yourself. */

      this.generateElements(); //clear if more than needed, add if needed
      
   }

   render() :void{ /* Render elements held */
      //this.buildSelf(); /* No, abstract extender needs to call this in its own buildSelf */

      for(let i = 0; i < this.elements.length; i++)
         this.elements[i].render();
   }
   renderById(_id :string) :void{
      if(this.id == _id)
         return this.render();
      for(let i = 0; i < this.elements.length; i++)
         this.elements[i].renderById(_id);
   }

}


class AlbumView extends HolderView{ /*Has List adder thing at end*/
   adder: HTMLInputElement;

   constructor(_id :string = "", _parentEl :HTMLElement|Element){
      super(_id,_parentEl);
   }
   
   buildSelf() :void{
      if(this.htmlEl != null && this.htmlEl.parentElement == null)
         this.htmlEl = null;

      if(this.htmlEl == null){
         this.htmlEl = <HTMLElement> html.albumTemplate.cloneNode(true);
         this.parentEl.appendChild(this.htmlEl);

         this.holderElement = EbyName('album-holder',this.htmlEl);

         this.adder = <HTMLInputElement> EbyName('album-adder',this.htmlEl);
         this.adder.onkeypress = this.adder_onkeypress.bind(this);////////
      }

      this.htmlEl.setAttribute('data-id',this.id);
      this.holderElement.innerHTML = ""; //Clear children.

      super.buildSelf(); //Build children
   }

   render() :void{ /* Render elements held */
      this.buildSelf();

      /////////////TODO set title and description text?
      /////// Or should you not do that somehow? How with ListView?

      //I guess ListView should have a bool or just look at parentNode to know if its fullscreen or not...
      
      super.render(); //render children
   }

   adder_onkeypress(event) :void{
      if(event.key !== 'Enter') return;
      newList(this.id, this.adder.value);
      this.adder.value = "";
   }
}


class ListView extends HolderView{ /*Has Board(Tile) adder thing at end*/
   header :HTMLElement;
   title :HTMLInputElement;
   optionsBtn :HTMLElement;
   adder :HTMLElement;
   adderText :HTMLElement;
   adderBoard :HTMLElement;
   adderList :HTMLElement;
   adderReference :HTMLElement;

   constructor(_id :string = "", _parentEl :HTMLElement|Element){
      super(_id,_parentEl);
   }
   
   buildSelf() :void{
      if(this.htmlEl != null && this.htmlEl.parentElement == null)
         this.htmlEl = null;

      if(this.htmlEl == null){
         this.htmlEl = <HTMLElement> html.list2Template.cloneNode(true);
         this.parentEl.appendChild(this.htmlEl);

         this.holderElement = EbyName('list-holder',this.htmlEl);

         this.header = EbyName('list-header',this.htmlEl);
         this.title = <HTMLInputElement> EbyName('list-title',this.htmlEl);
         this.title.onkeypress = this.title_onkeypress.bind(this);////////
         this.title.onblur = this.title_onblur.bind(this);////////
         this.optionsBtn = EbyName('list-optionsBtn',this.htmlEl);
         this.optionsBtn.onclick = this.optionsBtn_onclick.bind(this);////////
         this.adder = EbyName('list-adder',this.htmlEl);
         this.adderText = EbyName('list-adder-text',this.htmlEl);
         this.adderText.onclick = this.adderText_onclick.bind(this);////////
         this.adderBoard = EbyName('list-adder-board',this.htmlEl);
         this.adderBoard.onclick = this.adderBoard_onclick.bind(this);////////
         this.adderList = EbyName('list-adder-list',this.htmlEl);
         this.adderList.onclick = this.adderList_onclick.bind(this);////////
         this.adderReference = EbyName('list-adder-reference',this.htmlEl);
         this.adderReference.onclick = this.adderReference_onclick.bind(this);////////
      }

      this.htmlEl.setAttribute('data-id',this.id);
      this.holderElement.innerHTML = ""; //Clear children.
      
      super.buildSelf(); //build children
   }

   render() :void{ /* Render elements held */
      this.buildSelf();
      
      if(mainView == this){
         this.header.classList.add('hidden'); ////////TODO make it so you can edit from header
      }

      this.title.value = pb.boards[this.id].name;

      /*
      What if ListView used in board mode? do i set the global text and disable description?

      when listView is in fullscreen mode, disable header (title and options), and reroute Title textbox and Options button to do same as listView title input and options button.

      Description box is disabled.
      
      you know youre fullscreen based on parentEl == html.main
      */

      super.render(); //render children
   }

   title_onkeypress(event) :void{
      if(event.key !== 'Enter') return;
      pb.boards[this.id].name = this.title.value;

      pageOpened();
      sync.saveAll();
   }
   title_onblur(event) :void{
      this.title.value = pb.boards[this.id].name;
   }
   optionsBtn_onclick(event) :void{
      //showOptionsDialog(event,this.parentNode.parentNode)
   }
   adderText_onclick(event) :void{
      let id = newText(this.id,null);
      openBoard(id); //auto open
   }
   adderBoard_onclick(event) :void{
      let name = window.prompt("Board name?: ");
      if(name == "" || name == null)return;
      
      let id = newBoard(this.id,name);
      openBoard(id); //auto open
   }
   adderList_onclick(event) :void{
      let name = window.prompt("List name?: ");
      if(name == "" || name == null)return;
      
      let id = newList(this.id, name);
      openBoard(id); //auto open
   }
   adderReference_onclick(event) :void{
      newReference(this.id,null);
   }
}


class TileView implements View{ /* Has no add ers, but has Title,Description,Image */
   id :string;
   parentEl : HTMLElement|Element;
   htmlEl : HTMLElement;
   
   //view specific properties:

   //all tile-_____ properties from html:
   optionsBtn : HTMLElement;
   text : HTMLElement;
   textIcon : HTMLElement;

   constructor(_id :string = "", _parentEl :HTMLElement|Element){
      this.id = _id;
      
      this.parentEl = _parentEl;
      this.htmlEl = null;

 
      this.optionsBtn = null;
      this.text = null;
      this.textIcon = null;
   }


   buildSelf() :void{
      if(this.htmlEl != null && this.htmlEl.parentElement == null)
         this.htmlEl = null;

      if(this.htmlEl == null){
         this.htmlEl = <HTMLElement> html.tileTemplate.cloneNode(true);
         this.parentEl.appendChild(this.htmlEl);

         this.optionsBtn = EbyName('tile-optionsBtn',this.htmlEl);
         this.optionsBtn.onclick = this.optionsBtn_onclick.bind(this);////////
         this.text = EbyName('tile-text',this.htmlEl);
         this.text.onclick = this.text_onclick.bind(this);////////
         this.textIcon = EbyName('tile-textIcon',this.htmlEl);
      }

      this.htmlEl.setAttribute('data-id',this.id);
   }

   render() :void{ /* Render elements held */
      this.buildSelf();
      
      this.text.childNodes[2].nodeValue = pb.boards[this.id].name; /////////////// HIGHLY DEPENDENT ON HTML, even newlines affect. Test in browser if it fails.
      //$(this.text).contents()[1].nodeValue = pb.boards[this.id].name;
      //this.text.innerText = pb.boards[this.id].name; //Title   //////////////TODO how do i set text without fucking up icon?
      //this.text.innerText = pb.boards[this.id].content; //Text
      
      //To display text, check type.
      this.htmlEl.setAttribute('data-type', BoardTypeName(pb.boards[this.id].type));
      
      loadBackground(this.htmlEl,this.id);

      if(pb.boards[this.id].type == BoardType.Text && pb.boards[this.id].content.length>0) 
         this.textIcon.classList.remove('d-none');
      else 
         this.textIcon.classList.add('d-none');
   }

   /////////////////TODO add methods to call renderById on all tiles / lists etc. So i can implement data binding for changing data (tile title, list title, etc. Multiple instances of same tile..)
   renderById(_id :string) :void{
      if(this.id == _id)
         return this.render();
   }

   
   optionsBtn_onclick(event) :void{
      //showOptionsDialog(event)
   }
   text_onclick(event) :void{
      //open tile. Since tile can be any type we better call special function:
      openBoard(this.id);
   }
}


function openBoard(id :string) :void{
   //console.log("board of id: " + id + " clicked");

   //// For textual open textDialog by id (you just pass id to open it! )
   if(pb.boards[id].type == BoardType.Text){
      alert("Text!");
      return;
   }
   /// For board open it full window
   /// For list open it full window
   /// PBoard open it full window
   set_board(id);
}
