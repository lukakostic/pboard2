//~!! See end of file below class, dialog registers itself !!~//
class _dialog_textEditor_ implements DialogInterface {
	dialog : HTMLElement;
	back :HTMLElement;
 
   textTitle : HTMLInputElement;
   textText : HTMLInputElement;

   constructor(_back: HTMLElement, _dialog: HTMLElement){
      this.dialog = _dialog;
		this.back = _back;

      this.textTitle = EbyName('textTitle',this.dialog) as HTMLInputElement;
      this.textText = EbyName('textText',this.dialog) as HTMLInputElement;
      this.textTitle.oninput = textareaAutoSize.bind(null,this.textTitle);

      EbyName('closeBtn',this.dialog).onclick = this.closeNoSave.bind(this,false);
		EbyName('fullscreenBtn',this.dialog).onclick = this.fullscreen.bind(this,null);
		
		
      this.fullscreen(false); ////////////TODO add options?

      this.textTitle.value = pb.boards[dialogManager.boardID].name;
      this.textText.value = pb.boards[dialogManager.boardID].content;
      textareaAutoSize(this.textTitle);

      if(this.textTitle.value == ""){
         this.textTitle.select(); //auto select title
      }else{
         this.textText.select(); //auto select text
         this.textText.setSelectionRange(0,0); //sel start
      }

		this.focus();
   }
	focus():void{
		navigation.focus(this.textTitle, true);
	}
	backClicked():void{
		this.close();
	}
   //save == null when autoclose
   close(save:boolean = true) :boolean{
      if(save){
         pb.boards[dialogManager.boardID].name = this.textTitle.value;
         pb.boards[dialogManager.boardID].content = this.textText.value;
         boardsUpdated(UpdateSaveType.SaveNow, dialogManager.boardID);  
      }
      
		return dialogManager.disposeDialog(this);
   }
   closeNoSave(force=false) :void{
      let go = force;
      if(go == false) go = confirm("Exit without saving?");
      if(go == false) return;
      this.close(false);
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
dialogs['textEditor'] = _dialog_textEditor_;