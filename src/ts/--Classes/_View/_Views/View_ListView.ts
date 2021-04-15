
class ListView extends ViewTree{ /*Has Board(Tile) adder thing at end*/
   header :HTMLElement;
   title :HTMLInputElement;
   optionsBtn :HTMLElement;
   adder :HTMLElement;
   adderText :HTMLElement;
   adderBoard :HTMLElement;
   adderList :HTMLElement;
   adderReference :HTMLElement;

   constructor(_id :BoardId = "", _parent : View|null,  _index :number){
		super(_id, _parent, _index);
		this.type = ViewType.ListView;
   }
   
   buildHTML() :void{
      if(this.htmlEl == null){
         this.htmlEl = <HTMLElement> html.list2Template.cloneNode(true);

         this.attachToParent();

         this.holderElement = EbyName('list-holder',this.htmlEl);

         this.header = EbyName('list-header',this.htmlEl);
         this.title = <HTMLInputElement> EbyName('list-title',this.htmlEl);
         this.title.onkeyup = this.title_onkeyup.bind(this);
         this.title.onblur = this.title_onblur.bind(this);
			
			this.optionsBtn = EbyName('list-optionsBtn',this.htmlEl);
			this.optionsBtn.onclick = this.optionsBtn_onclick.bind(this);
			this.optionsBtn.addEventListener('openEvent',this.openEvent.bind(this),false); //for keyboard navigation
			this.optionsBtn.addEventListener('identify',this.identify.bind(this),false);

         this.adder = EbyName('list-adder',this.htmlEl);
         (this.adderText = EbyName('list-adder-text',this.htmlEl)).onclick = this.adderText_onclick.bind(this);
         (this.adderBoard = EbyName('list-adder-board',this.htmlEl)).onclick = this.adderBoard_onclick.bind(this);
         (this.adderList = EbyName('list-adder-list',this.htmlEl)).onclick = this.adderList_onclick.bind(this);
         (this.adderReference = EbyName('list-adder-reference',this.htmlEl)).onclick = this.adderReference_onclick.bind(this);
      }
      this.htmlEl.setAttribute('data-id',this.id);
      super.buildHTML(); //build children
   }

   render() :void{ /* Render elements held */
      this.buildHTML();
      
      if(this.parent == null)
         this.header.classList.add('hidden');

      this.title.value = pb.boards[this.id].name;

      super.render(); //render children
   }

   
   title_onkeyup(event :KeyboardEvent) :void{
		//if(event.key !== 'Enter') return;
		if(this.title.value == pb.boards[this.id].name) return;
		
      pb.boards[this.id].name = this.title.value;

      boardsUpdated(UpdateSaveType.AutoSave, this.id, [this.id]);
   }
   title_onblur(event :Event) :void{
      this.title.value = pb.boards[this.id].name;
   }
   optionsBtn_onclick(event :Event) :void{
      openOptionsDialog(this.id,this);
   }
   adderText_onclick(event :Event) :void{
      let id = newText(this.id,null);
      openBoard(id,this); //auto open
   }
   adderBoard_onclick(event :Event) :void{
		/*
		let name = window.prompt("Board name?: ");
      if(name == "" || name == null)return;
		*/let name = null;
      let id = newBoard(this.id,name);
      openBoard(id,this); //auto open
   }
   adderList_onclick(event :Event) :void{
		/*
      let name = window.prompt("List name?: ");
      if(name == "" || name == null)return;
      */let name = null;
      let id = newList(this.id, name);
      openBoard(id,this); //auto open
   }
   adderReference_onclick(event :Event) :void{
      newReference(this.id,null);
   }
}