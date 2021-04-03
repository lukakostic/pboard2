
class TileView extends View{ /* Has no add ers, but has Title,Description,Image */
   optionsBtn : HTMLElement;
   text : HTMLElement;
   textIcon : HTMLElement;

   constructor(_id :BoardId = "", _parent : View|null, _index :number){
		super(_id,_parent,_index);
		this.type = ViewType.TileView;
 
      this.optionsBtn = null;
      this.text = null;
      this.textIcon = null;
   }

   buildHTML() :void{
      if(this.htmlEl == null){
         this.htmlEl = <HTMLElement> html.tileTemplate.cloneNode(true);
         
         this.attachToParent();

         this.optionsBtn = EbyName('tile-optionsBtn', <HTMLElement> this.htmlEl);
         this.optionsBtn.onclick = this.optionsBtn_onclick.bind(this);
         this.text = EbyName('tile-text', <HTMLElement> this.htmlEl);
         this.text.onclick = this.text_onclick.bind(this);
         this.textIcon = EbyName('tile-textIcon', <HTMLElement> this.htmlEl);
         
         this.optionsBtn.addEventListener('openEvent',this.openEvent.bind(this),false); //for keyboard navigation
			this.optionsBtn.addEventListener('identify',this.identify.bind(this),false);
      }
      this.htmlEl.setAttribute('data-id',this.id);
   }

   render() :void{ /* Render elements held */
      this.buildHTML();
      
      let titleText = pb.boards[this.id].name;
      if(titleText.trim()=='') titleText="\xa0"; //non breaking space
      this.text.childNodes[1].nodeValue = titleText; /////////////// HIGHLY DEPENDENT ON HTML, even newlines affect. Test in browser if it fails.
      
      //this.text.innerText = pb.boards[this.id].content; //Text
      
      //To display text, check type.
      this.htmlEl.setAttribute('data-type', enumToStr(BoardType, pb.boards[this.id].type));
      
      loadBackground(<HTMLElement> this.htmlEl,this.id);

      if(pb.boards[this.id].type == BoardType.Text && pb.boards[this.id].content.length>0) 
         this.textIcon.classList.remove('d-none');
      else 
         this.textIcon.classList.add('d-none');
   }
   
   
   optionsBtn_onclick(event :Event) :void{
      openOptionsDialog(this.id,this);
   }
   text_onclick(event :Event) :void{
      //open tile. Since tile can be any type we better call special function:
      this.openEvent();
   }
}