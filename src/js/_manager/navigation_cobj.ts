let navigation :_Navigation_ = null;
class _Navigation_ {
   selectedView : View;
   uiInterval : number;

   static init():void{if(navigation==null) navigation = new _Navigation_();}

   constructor(){
      this.selectedView = null;
      document.addEventListener('focus',this.onfocus.bind(this), true);
      document.body.addEventListener('keydown',this.onkeydown.bind(this),true);
   }
   onkeydown(event :KeyboardEvent){
      let ctrl = event.ctrlKey;
      let shift = event.shiftKey;
      let esc = false;
      
      let inInput = false;
      let inDialog = false;

      if(event.keyCode === 27 || event.key === "Escape" || event.key === "Esc")
         esc = true;

      switch((<Element>event.target).tagName){
         case 'TEXTAREA':
         case 'INPUT':
            inInput = true;
      }
   
      if(dialogManager.dialogBack.classList.contains('hidden')==false)
         inDialog = true;
		
			this.handleKey(event.key,inInput,inDialog,shift,ctrl,esc);
   }
   onfocus() :void{
      let element = document.activeElement;

      switch(element){
         case document.body:
         case document.documentElement:
         case html.tabStart:
         case html.tabEnd:
            this.focusDefault();
            return;
      }

      let dataTab = element.getAttribute('data-tab');
      if(dataTab !== null){
         this.focus(EbyName(dataTab,<HTMLElement> element.parentNode));
         return;
      }

      this.focus(element as HTMLElement);
	}
	handleKey(key:string,inInput:boolean,inDialog:boolean,shift:boolean,ctrl:boolean,esc:boolean){

      let jumpList = (indx :number)=>{
			let dots = mainView.htmlEl.querySelectorAll('[data-name="list-header"]>.dot');
			if(indx<0)indx=0;
			if(indx>=dots.length)indx=dots.length-1;
         this.focus(<HTMLElement> dots[indx]);
      };

      if(esc){
         if(inDialog)
            dialogManager.closeDialog(!shift,true); //if shift held, dont save
         else{
            if(shift)
               header.homeBtn.click();
            else
               header.upBtn.click();
         }
      }

		if(inInput || inDialog)return; //Only process if looking at boards
		switch(key){
			case '`':
				if(ctrl)
					navigation.focus(header.headerExpand);
				break;
			case '~': // ` + shift
				event.preventDefault(); //if we focus on text
				if(shift) //jump to first List or tile
					if(pb.boards[mainView.id].type == BoardType.List)
						navigation.focus(<HTMLElement> mainView.htmlEl.getElementsByClassName('dot')[1]); //skip list dot
					else
						navigation.focus(<HTMLElement> mainView.htmlEl.getElementsByClassName('dot')[0]); //first dot
				break;
			case 'q':
			case 'Q':
				if(document.activeElement.classList.contains('dot')){
					event.preventDefault();
					document.activeElement.dispatchEvent(new CustomEvent('openEvent'));
				}else{
					event.preventDefault();
					(<HTMLElement>document.activeElement).click();
				}
				
				break;
				case 'a':
				case 'A': //Jump previous list
					if(shift){
						event.preventDefault(); //if we focus on text
						if(pb.boards[mainView.id].type == BoardType.List) this.focusDefault();
						else{
							jumpList(0);
						}
					}
					break;
					case 'l':
					case 'L': //Shift right
						if(this.selectedView && this.selectedView.parent){
							let newPos:number = this.selectedView.index + (shift?5:1);
							moveBoardTo(this.selectedView.index,newPos,this.selectedView.parent.id);
							this.focusDefault();
							//jumpList(newPos);
						}
						break;
					case 'k':
					case 'K': //Shift left
						if(this.selectedView && this.selectedView.parent){
							let newPos:number = this.selectedView.index + (shift?-5:-1);
							moveBoardTo(this.selectedView.index,newPos,this.selectedView.parent.id);
							this.focusDefault();
						}
						break;
		}
      
	}
   focusDefault(click:boolean=false):void{
      this.focus(header.headerExpand,click);
   }
   highlightFocus(element :Element = null):void{
      if(element === null) element = document.activeElement;
      this.moveHighlight('highlighted-input',<HTMLElement> element);
   }
   focus(element : HTMLElement, click:boolean=false):void{
		if(element == null) return this.focusDefault();
		if(click) element.click();
      (<HTMLElement>element).focus();
		this.highlightFocus(element);

		//get if theres a view thru identify event in View class
		this.selectedView = null;
		element.dispatchEvent(new CustomEvent('identify',{detail:
			function(v:View=null){
				navigation.selectedView = v;
			}
		}));
   }
   focusView(view :View):void{
      if(view.discarded==false && view.parent != null) //if not discarded or main
         this.focus(<HTMLElement> view.htmlEl.getElementsByClassName('dot')[0]);
      else this.focusDefault();
   }

   moveHighlight(id :string,target :HTMLElement) :void{
      let og = document.querySelector('[data-highlightId="'+id+'"]');
      if(og) og.removeAttribute('data-highlightId');
      if(target) target.setAttribute('data-highlightId', id);
   }
}