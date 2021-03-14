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

      this.htmlEl = null; /* Since abstract class, no actual display. Up to implementer class to make. */
      this.holderElement = null; /* Abstract */

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
      this.buildSelf();

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
   constructor(_id :string = "", _parentEl :HTMLElement|Element = null){
      super(_id,_parentEl);
   }
   
   render() :void{ /* Render elements held */
    super.render();  
   }
}


class ListView extends HolderView{ /*Has Board(Tile) adder thing at end*/
   constructor(_id :string = "", _parentEl :HTMLElement|Element = null){
      super(_id,_parentEl);
   }

   render() :void{ /* Render elements held */
    super.render();  
   }
}


class TileView implements View{ /* Has no adders, but has Title,Description,Image */
   id :string;
   parentEl : HTMLElement|Element;
   htmlEl : HTMLElement;

   tileType :BTypeT;

   constructor(_id :string = "", _parentEl :HTMLElement|Element = null){
      this.id = _id;
      this.parentEl = _parentEl;
      this.htmlEl = null;

      this.tileType = pb.boards[_id].type;
   }


   buildSelf() :void{
      if(this.htmlEl == null){
         this.htmlEl = <HTMLElement> html.textBrdTemplate.cloneNode(true);
         this.parentEl.appendChild(this.htmlEl);
      }
   }

   render() :void{ /* Render elements held */
      this.buildSelf();
      
   }
   renderById(_id :string) :void{
      if(this.id == _id)
         return this.render();
   }
}