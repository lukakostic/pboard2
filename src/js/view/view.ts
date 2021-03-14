let view :View = null; //current main, top level view

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
function generateView(_id :string, _parentEl :HTMLElement|Element = null) :AlbumView|ListView|TileView|null{
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

   constructor(_id :string = "", _parentEl :HTMLElement|Element = null){
      this.id = _id;
      this.parentEl = _parentEl;
      this.htmlEl = null;

      this.holderElement = null;
      this.elements = [];
   }


   generateElements() :void{
      
      if(pb.boards[this.id].type != BoardType.List || pb.boards[this.id].type != BoardType.PBoard)
         throw 'HolderView used for non holder type of board (PBoard | List)';

      this.elements.length = pb.boards[this.id].content.length;
      for(let i = 0; i < pb.boards[this.id].content.length; i++){
         let brdId = pb.boards[this.id].content[i];
         
         if(this.elements[i] == undefined)
            this.elements[i] = generateView(pb.boards[this.id].content[i]);
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

   constructor(_id :string = "", _parentEl :HTMLElement|Element = null){
      super(_id,_parentEl);
   }
   
   buildSelf() :void{
      if(this.htmlEl == null){
         this.htmlEl = <HTMLElement> html..cloneNode(true);
         this.parentEl.appendChild(this.htmlEl);

         this.holderElement = EbyName('album-holder',this.htmlEl);

         this.adder = EbyName('album-adder',this.htmlEl);
         this.adder.onkeypress = this.adder_onkeypress;////////
      }
      this.holderElement.innerHTML = ""; //Clear children.
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
         event.preventDefault();
         alert(this.adder.value);
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

   constructor(_id :string = "", _parentEl :HTMLElement|Element = null){
      super(_id,_parentEl);
   }
   
   buildSelf() :void{
      super.buildSelf();
      if(this.htmlEl == null){
         this.htmlEl = <HTMLElement> html.list2Template.cloneNode(true);
         this.parentEl.appendChild(this.htmlEl);

         this.holderElement = EbyName('list-holder',this.htmlEl);

         this.header = EbyName('list-header',this.htmlEl);
         this.title = EbyName('list-title',this.htmlEl);
         this.title.onkeypress = this.title_onkeypress; ////////////TODO Will this work?
         this.optionsBtn = EbyName('list-optionsBtn',this.htmlEl);
         this.optionsBtn.onclick = this.optionsBtn_onclick;////////
         this.adder = EbyName('list-adder',this.htmlEl);
         this.adderText = EbyName('list-adderText',this.htmlEl);
         this.adderText.onclick = this.adderText_onclick;////////
         this.adderBoard = EbyName('list-adderBoard',this.htmlEl);
         this.adderBoard.onclick = this.adderBoard_onclick;////////
         this.adderList = EbyName('list-adderList',this.htmlEl);
         this.adderList.onclick = this.adderList_onclick;////////
         this.adderReference = EbyName('list-adderReference',this.htmlEl);
         this.adderReference.onclick = this.adderReference_onclick;////////
      }
      this.holderElement.innerHTML = ""; //Clear children.
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
      //newText(event)
   }
   adderBoard_onclick(event) :void{
      //newBoard(event)
   }
   adderList_onclick(event) :void{
      //newList(event)
   }
   adderReference_onclick(event) :void{
      //newReferenceBtn(event)
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

   constructor(_id :string = "", _parentEl :HTMLElement|Element = null){
      this.id = _id;
      this.parentEl = _parentEl;
      this.htmlEl = null;

      this.tileType = pb.boards[_id].type;

      this.optionsBtn = null;
      this.text = null;
      this.textIcon = null;
   }


   buildSelf() :void{
      if(this.htmlEl == null){
         this.htmlEl = <HTMLElement> html.tileTemplate.cloneNode(true);
         this.parentEl.appendChild(this.htmlEl);
         this.htmlEl.setAttribute('data-id',this.id);

         this.optionsBtn = EbyName('tile-optionsBtn',this.htmlEl);
         this.optionsBtn.onclick = this.optionsBtn_onclick;////////
         this.text = EbyName('tile-text',this.htmlEl);
         this.text.onclick = this.text_onclick;////////
         this.textIcon = EbyName('tile-textIcon',this.htmlEl);
      }
   }

   render() :void{ /* Render elements held */
      this.buildSelf();
      
      //$(this.text).contents()[1].nodeValue = pb.boards[this.id].name;
      this.text.innerText = pb.boards[this.id].name; //Title   //////////////TODO how do i set text without fucking up icon?
      //this.text.innerText = pb.boards[this.id].content; //Text
      
      
      loadBackground(this.htmlEl,this.id);

      if(pb.boards[this.id].content.length>0) 
         this.textIcon.classList.remove('d-none');
      else 
         this.textIcon.classList.add('d-none');
   }
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