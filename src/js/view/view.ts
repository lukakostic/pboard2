let mainView :View = null; //current main, top level view
function setMainView(v :View) :void{
   mainView = v;
}
function clearMainView() :void{
   mainView = null;
   html.main.innerHTML = "";
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
   if(type == BoardType.Text || type == BoardType.Board){
      return new TileView(_id, _parentEl);
   }
   if(type == BoardType.List){
      return new ListView(_id, _parentEl);
   }
   if(type == BoardType.PBoard){
      return new AlbumView(_id, _parentEl);
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
      
      if(pb.boards[this.id].type != BoardType.List && pb.boards[this.id].type != BoardType.PBoard)
         throw 'HolderView used for non holder type of board (PBoard | List)';

      this.elements.length = pb.boards[this.id].content.length;
      for(let i = 0; i < pb.boards[this.id].content.length; i++){
         let brdId = pb.boards[this.id].content[i];
         
         if(this.elements[i] == undefined)
            this.elements[i] = generateView(pb.boards[this.id].content[i],this.holderElement);
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
      if(event.key === 'Enter'){
         newList(this.id, this.adder.value);
         this.adder.value = "";
      }
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
         this.title.onkeypress = this.title_onkeypress.bind(this); ////////////TODO Will this work?
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
      
      //////////////TODO Set title text
      //////////// What if ListView used in board mode? do i set the global text and disable description?

      /*
      when listView is in fullscreen mode, disable header (title and options), and reroute Title textbox and Options button to do same as listView title input and options button.

      Description box is disabled.
      
      you know youre fullscreen based on parentEl == html.main
      */

      super.render(); //render children
   }

   title_onkeypress(event) :void{
      alert(this.id);
      alert(this.title.outerHTML);
      //Save event.srcElement.value i guess,
      //Or actually save title.value , we want to avoid html wrangling. You dont need to know the html structure.
   }
   optionsBtn_onclick(event) :void{
      //showOptionsDialog(event,this.parentNode.parentNode)
   }
   adderText_onclick(event) :void{
      newText(this.id,null);
      ////////////////TODO auto open text
   }
   adderBoard_onclick(event) :void{
      newBoard(this.id,null);
      ////////////////TODO auto open board
   }
   adderList_onclick(event) :void{
      let name = window.prompt("List name?: ");
      if(name == "" || name == null)return;
      
      newList(this.id, name);
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

   tileType :BTypeT;
   //all tile-_____ properties from html:
   optionsBtn : HTMLElement;
   text : HTMLElement;
   textIcon : HTMLElement;

   constructor(_id :string = "", _parentEl :HTMLElement|Element){
      this.id = _id;
      this.parentEl = _parentEl;
      this.htmlEl = null;

      this.tileType = pb.boards[_id].type;

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
      //open tile
      //tileClicked(event)
   }
}