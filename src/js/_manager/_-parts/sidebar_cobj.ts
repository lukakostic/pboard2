
let sidebar : _Sidebar_ = null;
class _Sidebar_{
   sidebar : HTMLElement;
   templates : HTMLElement;

	sidebarWidth :number;
	buttonHeight :number;
	
   static init():void{ if(sidebar==null) sidebar = new _Sidebar_(); }

   constructor(){
		this.sidebarWidth = 100;
		this.buttonHeight = 35;

		this.sidebar = EbyId('sidebar');
		this.templates = EbyId('sidebarTemplates');

		EbyId('sidebarExpand').onclick = this.sidebarExpand_onclick.bind(this); 
		
		//TODO use preferences
		//this.sidebarExpand_onclick();
   }

   sidebarExpand_onclick(){
		this.sidebar.classList.toggle('hidden');
		let vis = !this.sidebar.classList.contains('hidden');
		this.sidebar.style.width = this.sidebarWidth+'px';
		html.main.style.marginLeft = vis?(this.sidebarWidth+'px'):'0px';
		if(vis)
			this.genBtns();
		else
			this.sidebar.innerHTML = '';
	}

	addDivider(){
		let el = EbyName('s-ddd',this.templates).cloneNode(true) as HTMLElement;
		this.sidebar.appendChild(el);
	}
	addBtn(text:string,onclick:any){
		let size = (this.sidebarWidth-15) +'px';
		let el = EbyName('s-btn',this.templates).cloneNode(true) as HTMLElement;
		this.sidebar.appendChild(el);
		el.innerHTML = text;
		el.addEventListener('click',onclick,false);

		el.style.width = size;
		if(this.buttonHeight == -1)
			el.style.height = size;
		else
			el.style.height = this.buttonHeight+'px';
		el.style.padding = '0px';
		el.style.wordBreak = 'break-all';
		el.style.overflow = 'hidden';
	}

	genBtns(){
		this.sidebar.innerHTML = '';



		/*pinned*/
	  if('pins' in pb.attributes){
		  
			/* clear nonexistent pins */
			let toClear = [];

			for(let i = 0; i < pb.attributes['pins'].length; i++){
				let pId = pb.attributes['pins'][i];
				if(pId in pb.boards == false){
					toClear.push(pId);
					continue;
				}
				this.addBtn(pb.boards[pId].name, function(id:string){
					openBoard(id,null);
				}.bind(null,pId));
			}

			toClear.forEach(i=>
				pb.attributes['pins'].splice(pb.attributes['pins'].indexOf(i))
			);
	  }

		this.addDivider();
		/*recent*/

	}
}