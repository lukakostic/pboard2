//~!! See end of file below class, dialog registers itself !!~//
class _dialog_richTextEditor_ implements DialogInterface {
	dialog : HTMLElement;
	back :HTMLElement;
 
   textTitle : HTMLInputElement;
	textText : HTMLInputElement;
	textBack : HTMLElement;
	
	revertTitle :string;
	revertText :string;

   constructor(_back: HTMLElement, _dialog: HTMLElement){
      this.dialog = _dialog;
		this.back = _back;

      this.textTitle = EbyName('textTitle',this.dialog) as HTMLInputElement;
      this.textText = EbyName('textText',this.dialog) as HTMLInputElement;
      this.textBack = EbyName('textBack',this.dialog) as HTMLElement;
		this.textTitle.addEventListener('input',textareaAutoSize.bind(null,this.textTitle));
		
		
		let syncScroll = function(this: _dialog_richTextEditor_){
			this.textBack.scrollTop = this.textText.scrollTop;
		}.bind(this);
		this.textText.onscroll = syncScroll;

		let oninput = function(this:_dialog_richTextEditor_,syncScroll:Function){
			this.generateBack();
			syncScroll();
			this.save();
		}.bind(this,syncScroll);
      this.textTitle.addEventListener('input',oninput);
		this.textText.addEventListener('input',oninput);
		

      EbyName('closeBtn',this.dialog).onclick = this.closeNoSave.bind(this,false);
		EbyName('fullscreenBtn',this.dialog).onclick = this.fullscreen.bind(this,null);
		
		
      this.fullscreen(true); ////////////TODO add options?

      this.textTitle.value = pb.boards[dialogManager.boardID].name;
      this.textText.value = pb.boards[dialogManager.boardID].content;
      textareaAutoSize(this.textTitle);
		this.generateBack();
		
      if(this.textTitle.value == ""){
         this.textTitle.select(); //auto select title
      }else{
         this.textText.select(); //auto select text
         this.textText.setSelectionRange(0,0); //sel start
      }

		this.revertTitle = pb.boards[dialogManager.boardID].name;
		this.revertText = pb.boards[dialogManager.boardID].content;
		this.focus();
   }
	focus():void{
		navigation.focus(this.textTitle, true);
	}
	backClicked(ev:Event):void{
		if(ev==null)
			this.close();
		else if(ev.target == this.back && window.getSelection().toString()=='') //stop from drag selecting on accident
			this.close();
	}
	save(now:boolean = false):void{
		pb.boards[dialogManager.boardID].name = this.textTitle.value;
		pb.boards[dialogManager.boardID].content = this.textText.value;
		boardsUpdated(now?UpdateSaveType.SaveNow:UpdateSaveType.AutoSave, dialogManager.boardID);  
	}
   //save == null when autoclose
   close(save:boolean = true) :boolean{
      if(save){
			this.save(true);
      }
      
		return dialogManager.disposeDialog(this);
   }
   closeNoSave(force=false) :void{
      let go = force;
      if(go == false) go = confirm("Revert changes?");
		if(go == false) return;
		
		this.textTitle.value = this.revertTitle;
		this.textText.value = this.revertText;
      this.close(true);
   }

   fullscreen(force :boolean|null = null){
      if(force === false || this.dialog.style.maxWidth != ""){
         this.dialog.style.maxWidth = "";
         this.dialog.style.maxHeight = "";
      }else{
         this.dialog.style.maxWidth = "100%";
         this.dialog.style.maxHeight = "100%";
      }
	}
	
	NoteParserStyles = {
		'b1':'background-color:red;',
		'b2':'background-color:green;',
		'b3':'background-color:blue;',
	}

	NoteParserTokens = {
		/* must be at beginning of line */
		line :{
			/*specific combination of chars */
			comb:{
				'//':'b1',
			} as {[index:string]:string},
			/* repeated characters eg: ~~, ~~~, ##, ###. The parser counts them! But it also checks if not in comb. */
			rep:{
				'~':{2:'b1',3:'b2'}, /* so ~~ has style b1, ~~~ b2. if more then uses biggest.  */
				'#':{2:'b1',3:'b2'},
			 } as {[index:string]: {[index:number]:string}},
		},
		/* Bracket highlighting, all terminated by newline */
		bracketTerm: [
			{o:'~*',c:'*~',s:'b3'},
			{o:'{',c:'}',s:'b3'},
		] as {o:string,c:string,s:string}[]
	}

	generateBack(){
		this.textBack.innerHTML = '';
		NoteParser(
			this.textBack, this.textText.value,
			this.NoteParserTokens, this.NoteParserStyles
		);

		function NoteParser(
			rootEl :HTMLElement, raw:string,
			rules :any, styles :{[index:string]:string}
		) {
			var c = 0; //current character
			var l = 0; //current line
			var txt = ""; //current string, used for brackets and such
			var lines = raw.split('\n'); //used for line started things
			var e:HTMLElement = null; //current element

			build();

			function build(){
				for(l = 0; l <lines.length; l++){
					checkSpecial();
					for(c = 0; c<lines[l].length; c++){
						goNormal();
				  }
				  newLineBreak();
				}
			  endCurrent();
			  makeEl('br'); //since browsers dont seem to render last one
			}

			function newLineBreak():boolean{ //returns true if to add current char
				endCurrent();
				makeEl('br');
				return false;
			}
			function endCurrent(){
				if(e == null)
					e = makeEl('');
				e.innerHTML = txt;
				
				txt = '';
				e = null;
			}
			function goNormal(){
				txt += lines[l][c];
				//text += ' ';
			}
			function checkSpecial():boolean{
				if(e!=null) return false; //we are already in some element
				
				/********************~~~~~~~ Check line: */
				/********** Check line-comb */
				for(let t in rules.line.comb){
					if(lines[l].startsWith(t)){
						e = makeEl('',rules.line.comb[t]);
						return true;
					}
				}
				/********** Check line-rep */
				for(let t in rules.line.rep){
					if(lines[l].startsWith(t)){
						//count
						let cnt = 0;
						for(let c=0;c<lines[l].length;c++){
							if(lines[l][c]!=t)break;
							cnt++;
						}
						let style:string = null; //if we do find a match it gets assigned else null
						if(cnt in rules.line.rep[t]){ //is there an exact count we want
							style = rules.line.rep[t][cnt];
						}else{ //or greater
							let keys = Object.keys(rules.line.rep[t]);//arranged in order
							if(parseInt(keys[keys.length-1])<cnt)
								style = keys[keys.length-1];
						}
						if(style !== null){
							e = makeEl('',style);
							return true;
						}
					}
				}
				/********************~~~~~~~ Check bracketTerm: */
				////////////TODO implement
				return false;
			}
		 
			
			
			function makeEl(tag :string, style :string = null):HTMLElement{
				var parent = e?e:rootEl;
				if(tag == '') tag = 'span';
				var el = document.createElement(tag);
				if(style !== null)
					el.style.cssText = styles[style];
				parent.appendChild(el);
				return el;
			}
			
			function escapeHtml(unsafe :string) {
				return unsafe
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&#039;");
			}
		}
	}
/*
	generateBack(){
		this.textBack.innerHTML = '';
		NoteParser(this.textBack,this.textText.value);
		function NoteParser(rootEl :HTMLElement, raw:string) {
			var c = 0; //current character
			var txt = ""; //current string
			var elStack = [rootEl]; //element stack so we can go up
			var e = rootEl; //current element
			var state = 0; //0 = normal, 1 = in string
			var strType = 0; //0 " 1 ' 2 `
			var escapeNext = false; //escape next in string
			var txtType = -1;

			build();
		 
			function build(){
			  for(c = 0; c<raw.length; c++){
		 
				 if(state == 0) //normal
					goNormal();
				 else if(state == 1){ //in string
					goText();
				 }
			  }
			}
		 
			function goText(){
				if(escapeNext == false){
			
				var exitTxt = false;
				if(raw[c] == '"' && txtType == 0)
					exitTxt = true;
				else if(raw[c] == "'" && txtType == 1)
					exitTxt = true;
				else if(raw[c] == "`" && txtType == 2)
					exitTxt = true;
			
				if(exitTxt){
					
				console.log(e);
					e.innerHTML = e.innerHTML + escapeHtml(txt);
					state = 0;
					return;
				}
			
				if(raw[c] == "\\"){
					escapeNext = true;
					return;
				}
				}
				escapeNext = false;
			
				txt += raw[c];
			}
		 
			function goNormal(){
				if(raw[c] == ';'){ //Close current element, go up
				popEl();
				}
				else if(handleQuoteNormal()){
			
				}
				else if(raw[c] == 'n'){ //br
				makeEl('br');
				popEl();
				}
				else if(raw[c] == 'b'){ //bold
				makeEl('','font-weight: bold;');
				}
				else if(raw[c] == 't'){ //Title
				makeEl('','font-size: '+Math.round(14*1.4)+'px;');
				}
			}
			
			function handleQuoteNormal(){
				var q = -1;
				
				if(raw[c] == '"')
				q = 0;
				else if(raw[c] == "'")
				q = 1;
				else if(raw[c] == "`")
				q = 2;
				
				if(q == -1) return false;
			
				txt = "";
				state = 1;
				txtType = q;
			
				return true;
			}
			
			function popEl(){
				elStack.pop();
				e = elStack[elStack.length-1];
			}
			
			function makeEl(tag :string, style :string = null){
				var parent = e;
				if(tag == '') tag = 'span';
				e = document.createElement(tag);
				if(style !== null)
				e.style.cssText = style;
				parent.appendChild(e);
				elStack.push(e);
			}
			
			
			
			function escapeHtml(unsafe :string) {
				return unsafe
					.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&#039;");
			}
		 }
	}
	*/
}
dialogs.richTextEditor = _dialog_richTextEditor_;