let navigation :_Navigation_ = null;
class _Navigation_ {
   selectedView : View;
   uiInterval : number;

   static init():void{if(navigation==null) navigation = new _Navigation_();}

   constructor(){
      this.selectedView = null;
      document.addEventListener('focus',this.onfocus.bind(this), true);
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
	
	getFocusedViewIndexes():{list:number,tile:number}|null{
		if(this.selectedView == null) return null;
		let list = -1;
		let tile = -1;

		if(mainView.type & ViewType.AlbumView){
			if(this.selectedView.type & ViewType.TileView){ //if selected a tile
				tile = this.selectedView.index;
				list = this.selectedView.parent.index;
			}else{ //list
				list = this.selectedView.index;
				tile = -1;
			}
		}else{ //List view
			tile = this.selectedView.index;
			list = -1;
		}
		return {list,tile};
	}
	jumpFocusToView(list:number,tile:number){
		let len = mainView.elements.length;
		if(len == 0) return this.focusDefault();
		if(list<0) list = 0;
		if(list>=len) list = len;

		if(tile != -1 && 'elements' in mainView.elements[list]){
			let len2 = (mainView.elements[list] as ViewTree).elements.length;
			if(len2 == 0) this.focusView(mainView.elements[list]);
			if(tile<0) tile = 0;
			if(tile>=len2) tile = len2;

			this.focusView((mainView.elements[list] as ViewTree).elements[tile]);
		}
		else
			this.focusView(mainView.elements[list]);
	}
	shiftFocusToView(list:number, tile:number, onlyList:boolean = false){
		let ind = this.getFocusedViewIndexes();
		if(ind == null) return this.focusView(mainView.elements[0]); //first list or tile
		this.jumpFocusToView((ind.list+list), onlyList?(ind.tile+tile):-1);
	}

   focusDefault(click:boolean=false):void{
      this.focus(header.headerExpand,click);
   }
   focus(element : HTMLElement, click:boolean=false):void{
		if(element == null) return this.focusDefault();
		if(click) element.click();
      (<HTMLElement>element).focus();
		this.moveHighlight(element);

		//get if theres a view thru identify event in View class
		this.selectedView = null;
		element.dispatchEvent(new CustomEvent('identify',{detail:
			function(v:View=null){
				navigation.selectedView = v;
			}
		}));
   }
   focusView(view :View):void{
		if(view == null) return this.focusDefault();
      if(view.discarded==false && view.parent != null) //if not discarded or main
         this.focus(<HTMLElement> view.htmlEl.getElementsByClassName('dot')[0]);
      else this.focusDefault();
	}


   moveHighlight(target :HTMLElement) :void{
		let id = 'highlighted-input';
      let og = document.querySelector('[data-highlightId="'+id+'"]');
      if(og) og.removeAttribute('data-highlightId');
      if(target) target.setAttribute('data-highlightId', id);
   }
}