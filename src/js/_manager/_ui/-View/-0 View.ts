type ViewTypeT =  number;
const ViewType = { //bit masked enum, powers of 2 !!
	View: 0,
	ViewTree: 1,
	//we OR them since they are both!
	TileView: 0|2,
	ListView: 1|4,
	AlbumView: 1|8,
}
abstract class View{ /* A (board kind) element display. Album, List, Tile. */
	type :ViewTypeT;
	discarded :boolean; //if true its not in use and is waiting to be GC collected
   id :BoardId;
   parent : View|null;
   index : number;
   htmlEl : HTMLElement;

   constructor(_id :BoardId = "", _parent : View|null, _index :number){
		this.type = ViewType.View;
		this.discarded = false;
      this.id = _id;
      this.parent = _parent;
      this.index = _index;
      this.htmlEl = null;
   }
   destructor() :null{
      if(this.discarded)return null;
      this.clearHTML();
      for(let p in this) this[p] = undefined; //discard all properties. /////////?? Does it work in extended class or only deletes these properties?
      this.discarded = true;
      return null;
   }
   buildHTML():void{} /* Create all html stuff needed to render MYSELF (not children too). Step before render. */
   clearHTML() :void{
		if(this.htmlEl != null)
			this.htmlEl.remove();
			//this.htmlEl.parentNode.removeChild(this.htmlEl);
         //this.htmlEl.outerHTML = ""; ///////////////////
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
   update(_id:BoardId,_index:number|null=null):View{
      let changed :boolean = false;
      if(this.id != _id) changed = true;
      if( pb.boards[this.id] == null || (changed && viewTypeForContext(this.id,this.parent) != viewTypeForContext(_id,this.parent)))
         return this.destructor(); //Incompatible type
      this.id = _id;
      if(_index!==null)
         this.index = _index;
      
      if(changed)
         this.clearHTML(); //invalidated
      return this;
   }
   render():void{} /* Render yourself and call render on children (if any) */
   renderById(_id:BoardId):void{
      if(this.id == _id)
         return this.render();
	} /* Element gets called to render. If not current element, call render on children (if any) */
	
   openEvent() :void{
      openBoard(this.id, this);
   }
	identify(viewIdentifyEvent :Event = null):View{ //to get called from html
		//dbg('identify',viewIdentifyEvent);
		if(viewIdentifyEvent && (viewIdentifyEvent as CustomEvent<Function>).detail)
			(viewIdentifyEvent as CustomEvent<Function>).detail(this); //callback
		return this;
	}
}

