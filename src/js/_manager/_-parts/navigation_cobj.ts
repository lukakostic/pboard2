type ViewIndex_RootChild = { //relative index, for ListView eg
	root:number|null;
	child:number|null;
}
type ViewIndex_ListTile = { //absolute index, for AlbumView. In list mode tiles are lists!
	list:number|null;
	tile:number|null;
}

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
		//dbg('onfocus',document.activeElement);
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
	
   focusDefault(click:boolean=false):void{
      this.focus(header.headerExpand,click);
   }
   focus(element : HTMLElement, click:boolean=false):void{
		if(element == null) return this.focusDefault();
		if(click) element.click();
      element.focus();
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
	
	getFocusedViewIndexes_RootChild():ViewIndex_RootChild|null{ //relative
		if(this.selectedView == null) return null;

		if(this.selectedView.parent && this.selectedView.parent != mainView) return {
				root: this.selectedView.parent.index,
				child: this.selectedView.index
			};
		else return {
				root: this.selectedView.index,
				child: null
			};
		
	}
	getFocusedViewIndexes_ListTile():ViewIndex_ListTile|null{ //absolute
		if(this.selectedView == null) return null;
		let list = null;
		let tile = null;

		if(this.selectedView.type == ViewType.TileView){ //if selected a tile
			if(mainView.type == ViewType.AlbumView){
				list = this.selectedView.parent.index;
				tile = this.selectedView.index;
			}else{
				tile = this.selectedView.index;
			}
		}else{ //list
			list = this.selectedView.index;
		}

		return {list,tile};
	}

	jumpFocusToView(ind:ViewIndex_RootChild){
		let {root,child} = ind;

		let len = mainView.elements.length;
		if(len == 0 || root === null) return this.focusDefault();
		if(root<0) root = 0;
		if(root>=len) root = len-1;

		if(child !== null && 'elements' in mainView.elements[root]){
			let len2 = (mainView.elements[root] as ViewTree).elements.length;
			if(len2 == 0) this.focusView(mainView.elements[root]);
			if(child<0) child = 0;
			if(child>=len2) child = len2-1;

			this.focusView((mainView.elements[root] as ViewTree).elements[child]);
		}
		else
			this.focusView(mainView.elements[root]);
	}
	
	shiftFocusToView(rootShift:number, childShift:number, selectRoot:boolean = false){
		let ind = this.getFocusedViewIndexes_RootChild();
		if(ind == null) return this.focusView(mainView.elements[0]); //first list or tile
		ind.root += rootShift;
		ind.child = selectRoot?null:(ind.child+childShift);
		this.jumpFocusToView(ind);
	}

   moveHighlight(target :HTMLElement) :void{
		let id = 'highlighted-input';
      let og = document.querySelector('[data-highlightId="'+id+'"]');
      if(og) og.removeAttribute('data-highlightId');
      if(target) target.setAttribute('data-highlightId', id);
   }
}