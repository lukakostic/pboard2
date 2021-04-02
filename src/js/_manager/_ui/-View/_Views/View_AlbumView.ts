class AlbumView extends ViewTree{ /*Has List adder thing at end*/
   adder: HTMLInputElement;

   constructor(_id :string = "", _parent : View|null, _index :number){
      super(_id, _parent, _index);
   }
   
   buildHTML() :void{
      if(this.htmlEl == null){
         this.htmlEl = <HTMLElement> html.albumTemplate.cloneNode(true);

         this.attachToParent();

         this.holderElement = EbyName('album-holder',this.htmlEl);

         this.adder = <HTMLInputElement> EbyName('album-adder',this.htmlEl);
         this.adder.onkeypress = this.adder_onkeypress.bind(this);
      }
      this.htmlEl.setAttribute('data-id',this.id);
      super.buildHTML(); //Build children
   }

   render() :void{ /* Render elements held */
      this.buildHTML();
      super.render(); //render children
   }

   
   adder_onkeypress(event :KeyboardEvent) :void{
      if(event.key !== 'Enter') return;
      newList(this.id, this.adder.value);
      this.adder.value = "";
   }
}