
let header : _Header_ = null;
class _Header_{
   header : HTMLElement;
   headerTitle :HTMLInputElement;
   headerDescription :HTMLInputElement;
   headerFold :HTMLElement;

   headerExpand :HTMLElement;
   homeBtn  :HTMLElement;
   upBtn  :HTMLElement;
   saveBtn :HTMLElement;
   loadBtn :HTMLElement;
   saveDownloadBtn :HTMLElement;
   loadDownloadBtn :HTMLElement;
   
   static init():void{ if(header==null) header = new _Header_(); }

   constructor(){
      this.header = EbyId('header');
      (this.headerTitle = <HTMLInputElement> EbyId('headerTitle'))
      .oninput = this.headerTitle_oninput.bind(this);
      (this.headerDescription = <HTMLInputElement> EbyId('headerDescription'))
      .oninput = this.headerDescription_oninput.bind(this);
		this.headerFold = EbyId('headerFold');
		
		EbyId('optionsBtn_main').onclick = ()=> openOptionsDialog(board,null);
		EbyId('viewThemeBtn_main').onclick = ()=> dialogManager.openDialog('viewThemes',board,null);
		
      (this.headerExpand = EbyId('headerExpand'))
      .onclick = this.headerExpand_onclick.bind(this);
    
      (this.homeBtn = EbyId('homeBtn')).onclick = this.goHome.bind(this);
      (this.upBtn = EbyId('upBtn')).onclick = this.goUp.bind(this);
      
      //EbyId('convertBtn').onclick = ConvertBoard;
      (this.saveBtn = EbyId('saveBtn')).onclick = ()=>{sync.saveAll();};
      (this.loadBtn = EbyId('loadBtn')).onclick = ()=>{sync.loadAll();};
      (this.saveDownloadBtn = EbyId('saveDownloadBtn')).onclick = ()=>{
         function saveBlobFile (name :string, type :string, data:string) {
            if (data !== null && navigator.msSaveBlob)
               return navigator.msSaveBlob(new Blob([data], { type: type }), name);
            let a =  document.createElement('a');
            a.style.display = "none";
            let url = window.URL.createObjectURL(new Blob([data], {type: type}));
            a.setAttribute("href", url);
            a.setAttribute("download", name);
            document.body.append(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
         }

         let text = buildPBoard();
         let dateTag = (new Date()).toISOString().replace('T',' ').substring(2,16);
         let filename = "PBoard "+dateTag+".txt";
         saveBlobFile(filename,"data:attachment/text",text);
         
      };
      (this.loadDownloadBtn = EbyId('loadDownloadBtn')).onclick = ()=>{
         let contents = prompt("Paste JSON pboard data:");
         loadSaveFile(contents,false);
      };
   }

   goLogin() :void{
      window.location.href = siteUrl.replace(/\/*$/, "") + "/login/";
   }
   goHome() :void{  
      set_board("");
   }
   goUp() :void{
      boardHistory.prev();
   }

   loadHeaderData(){
      if(mainView == null){
         this.headerTitleSetText(null);
         this.headerDescriptionSetText(null);
         return;
      }
      this.headerTitleSetText(pb.boards[mainView.id].name);
      
      if(pb.boards[mainView.id].type == BoardType.Board)
         this.headerDescriptionSetText(pb.boards[mainView.id].attributes['description']);
      else
         this.headerDescriptionSetText(null);
   }



   headerTitleSetText(txt :string|null){
      this.headerTitle.disabled = (typeof txt==='string')? false:true;
      this.headerTitle.value = (typeof txt==='string')? txt:"";
   }
   headerDescriptionSetText(txt :string|null){
      this.headerDescription.disabled = (typeof txt==='string')? false:true;
      this.headerDescription.value = (typeof txt==='string')? txt:"";

      this.headerDescAutoHeight(this.headerDescription);
   }

   headerTitle_oninput(){
      if(mainView == null) return;
      pb.boards[mainView.id].name = this.headerTitle.value;

      boardsUpdated(UpdateSaveType.AutoSave, mainView.id);
   }
   headerDescription_oninput(){
      this.headerDescriptionSetText(this.headerDescription.value);

      if(mainView == null) return;
      if(pb.boards[mainView.id].type == BoardType.Board){
         pb.boards[mainView.id].attributes['description'] = this.headerDescription.value;
      
         boardsUpdated(UpdateSaveType.AutoSave, mainView.id);
      }
   }
   
   headerExpand_onclick(){
      this.headerFold.classList.toggle('hidden');
   }

   //Set height based on text in textbox
   headerDescAutoHeight(textarea :HTMLInputElement) :void{
      textarea.style.height = '1px';
      let height = (5+textarea.scrollHeight);
      textarea.style.removeProperty('height'); //we actually want flex so no height
      let maxHeight = window.innerHeight * 0.8 - 40; //-40 for approximate header height
      if(height>maxHeight)
      height = maxHeight; //limit max
      (<HTMLElement> textarea.parentNode).style.minHeight = height+'px';
   }
}