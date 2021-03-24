let navigation :_Navigation_ = null;
class _Navigation_ {
   selectedView : View;
   selectedViewId : string|null;
   uiInterval : number;

   static init():void{if(navigation==null) navigation = new _Navigation_();}

   constructor(){
      this.selectedView = null;
      this.selectedViewId = null;
      document.addEventListener('focus',this.onfocus.bind(this), true);
      document.body.addEventListener('keydown',this.onkeydown.bind(this),true);
   }
   onkeydown(event :KeyboardEvent){
      let ctrl = event.ctrlKey;
      let shift = event.shiftKey;
      
      let inInput = false;
      let inDialog = false;

      let esc = false;
      if(event.keyCode === 27 || event.key === "Escape" || event.key === "Esc")
         esc = true;

      switch((<Element>event.target).tagName){
         case 'TEXTAREA':
         case 'INPUT':
            inInput = true;
      }
   
      if(dialogManager.dialogBack.classList.contains('hidden')==false)
         inDialog = true;
      
      let jumpList = function(indx :number){
         let dots = mainView.htmlEl.querySelectorAll('[data-name="list-header"]>.dot');
         this.focus(<HTMLElement> dots[indx]);
      }.bind(this);

      if(esc){
         if(inDialog)
            dialogManager.closeDialog(!shift,true); //if shift held, dont save
         else{
            if(shift)
               header.upBtn.click();
            else
               header.homeBtn.click();
         }
      }

      if(!inInput && !inDialog){
         switch(event.key){
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
               case 'd':
               case 'D': //Jump next list
                  if(shift){
                     event.preventDefault(); //if we focus on text
                     if(pb.boards[mainView.id].type == BoardType.List) this.focusDefault();
                     else{
                        jumpList(0);
                     }
                  }
                  break;
         }
      }
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

      this.highlightFocus();
   }
   focusDefault():void{
      this.focus(header.headerExpand);
   }
   highlightFocus(element :Element = null):void{
      if(element === null) element = document.activeElement;
      this.moveHighlight('highlighted-input',<HTMLElement> element);
   }
   focus(element : HTMLElement):void{
      if(element == null) return this.focusDefault();
      (<HTMLElement>element).focus();
      this.highlightFocus(element);
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