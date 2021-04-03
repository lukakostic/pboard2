abstract class ViewTree extends View{
   holderElement : HTMLElement; /* Element that holds other elements (views) */
   elements : View[];

   constructor(_id :string = "", _parent : View|null, _index :number){
		super(_id,_parent,_index);
		this.type = ViewType.ViewTree;

      this.holderElement = null;
      this.elements = [];

      if(this.parent == null)
         setMainView(this as ViewTree);
   }

   destructor():null{
      if(this.discarded)return null;
      for(let i = 0; i < this.elements.length; i++){
         this.elements[i].clearHTML();
         this.elements[i].destructor();
      }
      this.elements = undefined;
      return super.destructor();
   }

   buildHTML() :void{ //Build children
      /* Abstract, but here you should check first if your element has all the html stuff it needs. create yourself. */
      
      //this.holderElement.innerHTML = ""; //Clear children.       here
		
		//clear if more than needed, add if needed
      this.elementsToLength();
      for(let i = 0; i < this.elements.length; i++)
         this.elements[i].clearHTML(); //Since we cleared  above ^

   }
   clearHTML() :void{
      if(this.elements !== undefined){ //not getting discarded
         for(let i = 0; i < this.elements.length; i++)
            this.elements[i].clearHTML();
      }
      super.clearHTML();
   }
   update(_id:BoardId,_index:number|null=null):View{
      let notSameId = (this.id != _id);
      if(super.update(_id,_index) == null) return null;
      if(notSameId)
         this.elementsToLength();
      return this;
   }
   render() :void{ /* Render elements held */
      //this.buildHTML(); /* No, abstract extender needs to call this in its own buildHTML */
      if(this.parent==null)setMainView(this); //to render title into tab name
      for(let i = 0; i < this.elements.length; i++)
         this.elements[i].render();
   }
   renderById(_id :BoardId) :void{
      super.renderById(_id);
      for(let i = 0; i < this.elements.length; i++)
         this.elements[i].renderById(_id);
   }


   elementsToLength():void{ //if above delete, if below create.
      let length = pb.boards[this.id].content.length; //desired length
      let len = this.elements.length; //curent length
      let dif = length-len; //if length>len then positive
      if(dif>0){ //add more
         for(let i = 0; i < dif; i++)
            this.elements.push(null); //will fill in update below
      }else if(dif<0){ //remove
         for(let i = 0; i < -dif; i++){
            this.elements[this.elements.length-1].destructor(); //properly dispose
            this.elements.pop(); //remove
         }
      }
      //update/create all:
      for(let i = 0; i < this.elements.length; i++){
         let makeNew :boolean = (this.elements[i] === null);
         if(makeNew==false && this.elements[i].update(pb.boards[this.id].content[i], i) == null)
            makeNew = true;
         if(makeNew)
            this.elements[i] = generateView(pb.boards[this.id].content[i], this as View, i);
      }
   }
}