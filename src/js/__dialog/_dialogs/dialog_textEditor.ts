//~!! See end of file below class, dialog gets added to unregisteredDialogs !!~//
class _dialog_textEditor_ implements DialogInterface {
   isOpen : boolean;
   dialog : HTMLElement;
 
   textTitle : HTMLInputElement;
   textText : HTMLInputElement;

   constructor(){
      this.isOpen = false;
      this.dialog = null;

      this.textTitle = null;
      this.textText = null;
    }
   init() :void{
      this.isOpen = false;
      this.dialog = EbyId('dialog_textEditor');

      this.textTitle = EbyName('textTitle',this.dialog) as HTMLInputElement;
      this.textText = EbyName('textText',this.dialog) as HTMLInputElement;
      this.textTitle.oninput = textareaAutoSize.bind(null,this.textTitle);

      EbyName('closeBtn',this.dialog).onclick = this.closeNoSave.bind(this,false);
      EbyName('fullscreenBtn',this.dialog).onclick = this.fullscreen.bind(this,null);
   }
   open() :void{
      this.isOpen = true;
      this.dialog.classList.toggle('hidden', false);

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

      navigation.focus(this.textTitle, true);
   }
   //save == null when autoclose
   close(save:boolean|null = false) :void{
      if(save === null) save = true; //either back clicked or specifically called to true

      if(save){
         pb.boards[dialogManager.boardID].name = this.textTitle.value;
         pb.boards[dialogManager.boardID].content = this.textText.value;
         boardsUpdated(UpdateSaveType.SaveNow, dialogManager.boardID);  
      }
         
      this.dialog.classList.toggle('hidden', true);
      this.isOpen = false;
      dialogManager.closeDialog(false,false);
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
unregisteredDialogs['textEditor'] = new _dialog_textEditor_();