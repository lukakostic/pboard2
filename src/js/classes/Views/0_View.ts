abstract class View{ /* A (board kind) element display. Album, List, Tile. */
   discarded :boolean; //if true its not in use and is waiting to be GC collected
   id :string;
   parent : View|null;
   index : number;
   htmlEl : HTMLElement|Element;

   constructor(_id :string = "", _parent : View|null, _index :number){
      this.discarded = false;
      this.id = _id;
      this.parent = _parent;
      this.index = _index;
      this.htmlEl = null;
   }
   destructor() :null{
      console.log('View destructor');
      if(this.discarded)return null;
      this.clearHTML();
      for(let p in this) this[p] = undefined; //discard all properties. /////////?? Does it work in extended class or only deletes these properties?
      this.discarded = true;
      return null;
   }
   buildHTML():void{} /* Create all html stuff needed to render MYSELF (not children too). Step before render. */
   clearHTML() :void{
      if(this.htmlEl != null)
         this.htmlEl.outerHTML = "";
      this.htmlEl = null;
   }
   attachToParent() :void{
      /////Add to main, holderElement or to parent html ///?? htmlEl is never used, should always be holderElement
      if(this.parent!=null){
         if((<ViewTree>this.parent).holderElement != undefined)
            (<ViewTree>this.parent).holderElement.appendChild(this.htmlEl);
         else
            this.parent.htmlEl.appendChild(this.htmlEl); //?? never used, always holderElement..
      } else
         html.main.appendChild(this.htmlEl);
      ///////
   }
   update(_id:string,_index:number|null=null):View{
      let changed :boolean = false;
      if(this.id != _id) changed = true;
      if(changed && pb.boards[_id].type != pb.boards[this.id].type)
         return this.destructor(); //Incompatible type
      this.id = _id;
      if(_index!==null)
         this.index = _index;
      
      if(changed)
         this.clearHTML(); //invalidated
      return this;
   }
   render():void{} /* Render yourself and call render on children (if any) */
   renderById(_id:string):void{
      if(this.id == _id)
         return this.render();
   } /* Element gets called to render. If not current element, call render on children (if any) */
}

