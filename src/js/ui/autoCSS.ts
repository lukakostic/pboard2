let AUTOUI_DISABLE = true; ///////////////TODO dont

function autoUI_function() :void{
  if(AUTOUI_DISABLE) return;
 
   //Make tab title same as board name
   if(pb != null){ //If loaded
     let brdName = pb.boards[board].name;
     if(brdName == "") brdName = "PBoard";
     else brdName += " - PBoard";
     document.title = brdName;
   }

   //singleInstanceCheck()////////////
 }

 function expandInputAll(A,B,C,D,E,F,G){}
 function expandInput(A,B,C,D,E,F,G){}
/*
function expandInputAll() :void{
  let expandoInputs = EbyClass('expandInput');
  for (let i = 0; i < expandoInputs.length; i++)
    expandInput(expandoInputs[i]);
}

//Set height based on text in textbox
function expandInput(el) :void{
  el.style.height = '1px';
  el.style.height = (1+el.scrollHeight)+'px';
  el.parentNode.style.height = el.style.height;
}
*/

function textareaAutoSize(el) :void{
  el.style.height = '1px';
  el.style.height = (1+el.scrollHeight)+'px';
//  el.parentNode.style.height = el.style.height;
}




//////////////////////////////////
function fixNewListUI(){}
function fixAlbumUI(){}
function fixListUI(){}
/*
 //move newlist to bottom again
function fixNewListUI() :void{ ////////////// TODO move to View
   let newlist = EbyId('newlist');
   newlist.parentNode.appendChild(newlist);
 }
 
 function fixAlbumUI() :void{ ////////////// TODO move to View
   let columnWidth = 310; //px //300 + 5*2 margin
   
   html.boardAlbum.style.setProperty('width',((columnWidth*html.boardAlbum.childElementCount)+10 + 8).toString() + 'px'); //add some space for album pad (2 * 5px atm) + some extra just in case
     
 }
 
 function fixListUI(listEl=null) :void{ ////////////// TODO move to View
   
   //Keep newPanel at end by reparenting again
   if(listEl!=null){ //fix passed list
     let newPanel = EbyClass('newPanel',listEl)[0];
     newPanel.parentNode.appendChild(newPanel);
   }else{ //fix every list
     let album = this.fixAlbumUI();
     let lists = EbyClass('list', album);
     for(let i = 0; i<lists.length; i++){
       if(lists[i].id=="") this.fixListUI(lists[i]);
     }
   }
 }
 */