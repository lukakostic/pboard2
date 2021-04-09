//~!! See end of file below class, dialog registers itself !!~//
class _dialog_textEditor_ implements DialogInterface {
	dialog : HTMLElement;
	back :HTMLElement;
 
   textTitle : HTMLInputElement;
	textText : HTMLInputElement;
	
	revertTitle :string;
	revertText :string;

   constructor(_back: HTMLElement, _dialog: HTMLElement){
      this.dialog = _dialog;
		this.back = _back;

      this.textTitle = EbyName('textTitle',this.dialog) as HTMLInputElement;
      this.textText = EbyName('textText',this.dialog) as HTMLInputElement;
		this.textTitle.addEventListener('input',textareaAutoSize.bind(null,this.textTitle));
		
		let oninput = function(this:_dialog_textEditor_){
			this.save();
		}.bind(this);
      this.textTitle.addEventListener('input',oninput);
      this.textText.addEventListener('input',oninput);
		let onclick = function(this:_dialog_textEditor_,event:MouseEvent){ //ctrl click open link
			if(event.ctrlKey)
				linkClickTry((event.target as HTMLInputElement));
		}.bind(this);
      this.textTitle.addEventListener('click',onclick);
      this.textText.addEventListener('click',onclick);

      EbyName('closeBtn',this.dialog).onclick = this.closeNoSave.bind(this,false);
		EbyName('fullscreenBtn',this.dialog).onclick = this.fullscreen.bind(this,null);
		
		
      this.fullscreen(true); ////////////TODO add options?

      this.textTitle.value = pb.boards[dialogManager.boardID].name;
      this.textText.value = pb.boards[dialogManager.boardID].content;
      textareaAutoSize(this.textTitle);

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

}
dialogs.textEditor = _dialog_textEditor_;