function autoUI_function(){
   //Fix this piece of shit mobile web dev crap
   document.body.style.setProperty("width","100vw");
 
   //Resize main board so it doesnt take whole screen width, rather just the middle 'document' area
   //Makes it easier to focus and see the boards than if they are spread thru whole width
   if(window.innerWidth>1250)
     html.listAlbum.style.width = '1250px';
   else
     html.listAlbum.style.width = '100%';
 
   //Make tab title same as board name
   if(pb != null){ //If loaded
     let brdName = pb.boards[board].name;
     if(brdName == "") brdName = "PBoard";
     else brdName += " - PBoard";
     document.title = brdName;
   }

   //singleInstanceCheck()////////////
 }

 //move newlist to bottom again
function fixNewListUI() :void{
   let newlist = EbyId('newlist');
   newlist.parentNode.appendChild(newlist);
 }
 
 function fixAlbumUI() :void{
   let columnWidth = 310; //px //300 + 5*2 margin
   
   html.boardAlbum.style.setProperty('width',((columnWidth*html.boardAlbum.childElementCount)+10 + 8).toString() + 'px'); //add some space for album pad (2 * 5px atm) + some extra just in case
     
 }
 
 function fixListUI(listEl=null) :void{
   
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