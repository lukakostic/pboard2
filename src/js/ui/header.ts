
function loadHeaderData(){
   if(mainView == null){
      headerTitleSetText(null);
      headerDescriptionSetText(null);
      return;
   }
   headerTitleSetText(pb.boards[mainView.id].name);
   
   if(pb.boards[mainView.id].type == BoardType.Board)
      headerDescriptionSetText(pb.boards[mainView.id].attributes['description']);
   else
      headerDescriptionSetText(null);
}



function headerTitleSetText(txt :string|null){
   html.headerTitle.disabled = (typeof txt==='string')? false:true;
   html.headerTitle.value = (typeof txt==='string')? txt:"";
}
function headerDescriptionSetText(txt :string|null){
   html.headerDescription.disabled = (typeof txt==='string')? false:true;
   html.headerDescription.value = (typeof txt==='string')? txt:"";

   headerDescAutoHeight(html.headerDescription);
}

function headerTitle_oninput(){
   if(mainView == null) return;
   pb.boards[mainView.id].name = html.headerTitle.value;

   boardsUpdated([mainView.id],2);
 }
 function headerDescription_oninput(){
   headerDescriptionSetText(html.headerDescription.value);

   if(mainView == null) return;
   if(pb.boards[mainView.id].type == BoardType.Board){
      pb.boards[mainView.id].attributes['description'] = html.headerDescription.value;
     
      boardsUpdated([mainView.id],2);
   }
 }
 
 function headerExpand_onclick(){
   html.headerFold.classList.toggle('hidden');
 }

 //Set height based on text in textbox
function headerDescAutoHeight(textarea :HTMLInputElement) :void{
   textarea.style.height = '1px';
   let height = (5+textarea.scrollHeight);
   textarea.style.removeProperty('height'); //we actually want flex so no height
   let maxHeight = window.innerHeight * 0.8 - 40; //-40 for approximate header height
   if(height>maxHeight)
   height = maxHeight; //limit max
   (<HTMLElement> textarea.parentNode).style.minHeight = height+'px';
}