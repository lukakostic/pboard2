//move newlist to bottom again
function fixNewListUI() :void{
  let newlist = EbyId('newlist');
  newlist.parentNode.appendChild(newlist);
}

function fixAlbumUI() :HTMLElement|null{
  let album = EbyId('boardAlbum');
  let columnWidth = 310; //px //300 + 5*2 margin
  if(album){
    album.style.setProperty('width',((columnWidth*album.childElementCount)+10 + 8).toString() + 'px'); //add some space for album pad (2 * 5px atm) + some extra just in case
    
    return album;
  }
  return null;
}

function fixListUI(listEl=null) :void{
  log(listEl, "LIST ELEMENT fixListUI: ");
  //Keep newPanel at end by reparenting again
  if(listEl!=null){
    let newPanel = EbyClass('newPanel',listEl)[0];
    newPanel.parentNode.appendChild(newPanel);
  }else{
    let album = this.fixAlbumUI();
    let lists = EbyClass('list', album)[0];    ////////////////////????? Why [0] ?
    for(let i = 0; i<lists.length; i++){
      if(lists[i].id=="") this.fixListUI(lists[i]);
    }
  }
}



function startSavingIndicator() :void{
  html.savingIndicator.style.display = 'block';
}
function stopSavingIndicator() :void{
  html.savingIndicator.style.display = 'none';
}

function startLoadingIndicator() :void{
  html.loadingIndicator.style.display = 'block';
}
function stopLoadingIndicator() :void{
  html.loadingIndicator.style.display = 'none';
}

function expandInputAll() :void{
  let expandoInputs = EbyClass('expandInput');
  for (let i = 0; i < expandoInputs.length; i++)
    this.expandInput(expandoInputs[i]);
}

function expandInput(el) :void{
  el.style.height = '1px';
  el.style.height = (1+el.scrollHeight)+'px';
  el.parentNode.style.height = el.style.height;
}

function makeDraggable() :void{
    

  //make boards draggable
  let draggableLists = $('.draggableList')
  if(draggableLists.length !== 0)
  (<JQuery<HTMLElement>&{sortable:any}> draggableLists).sortable({
    items: '.draggable',
    start: (event, drag)=>{
      
      log('drag start')
        drags.dragItem = drag.item
        drags.oldDragIndex = elementIndex(drags.dragItem[0])
        drags.dragNew = drags.dragOld = drag.item.parent()
        drags.dragStartTime = (new Date()).getTime()
    },
    stop: (event, drag)=>{
      
      log('drag stop')
      //With a delay so that dragging a board doesnt click its button at end
      setTimeout(()=>{
        //actually move the board
        drags.newDragIndex = elementIndex(drags.dragItem[0])
        
        
        pb.boards[dataId(drags.dragOld[0])].content.splice(drags.oldDragIndex-1,1)
        pb.boards[dataId(drags.dragNew[0])].content.splice(drags.newDragIndex-1,0,dataId(drags.dragItem[0]))
        
        
        let clickItem = null //if it needs to click below

        if(((new Date()).getTime() - drags.dragStartTime)<200 && drags.newDragIndex == drags.oldDragIndex) //was meant to click probably
        {
          clickItem = drags.dragItem.find('div')
        }
        else
          sync.saveAll()
      
        
        drags.dragItem = null
        
        if(clickItem!=null)clickItem.click() //needs dragItem to be null

      },50)
    },
    change: (event, drag)=>{
      
      log('drag change')
        if(drag.sender) drags.dragNew = drag.placeholder.parent()
        fixListUI(drags.dragNew[0])
    },
    connectWith: ".draggableList"
}).disableSelection()



  //make lists draggable
  let draggableAlbums = $('.draggableAlbum')
  if(draggableAlbums.length !== 0)
  (<JQuery<HTMLElement>&{sortable:any}> draggableAlbums).sortable({
    items: '.draggableList',
    start: (event, drag)=>{
      
        log('drag list start')
        drags.dragItem = drag.item
        drags.oldDragIndex = elementIndex(drags.dragItem[0])
        drags.dragStartTime = (new Date()).getTime()
    },
    stop: (event, drag)=>{
      
      log('drag list stop')
      //With a delay so that dragging a board doesnt click its button at end
      setTimeout(()=>{
        //actually move the board
        drags.newDragIndex = elementIndex(drags.dragItem[0])

        
        pb.boards[board].content.splice(drags.oldDragIndex,1)
        pb.boards[board].content.splice(drags.newDragIndex,0,dataId(drags.dragItem[0]))
        
        drags.dragItem = null
        sync.saveAll()

      },50)
    },
    change: (event, ui)=>{
      
      log('drag list change')
      //if(sender) dragNew = placeholder.parent();
        
      //fixNewListUI();
    }
}).disableSelection()

/*
$(".textBtn").each(function() {

  this.addEventListener("mousedown", function(t) {
    $(this.parentNode).trigger("mousedown",t);
    $(this.parentNode).trigger("onmousedown",t);
  },true);
  this.addEventListener("mouseup", function(t) {
    $(this.parentNode).trigger("mouseup",t);
    $(this.parentNode).trigger("onmouseup",t);
  },true);
  
  this.addEventListener("onmousedown", function(t) {
    $(this.parentNode).trigger("mousedown",t);
    $(this.parentNode).trigger("onmousedown",t);
  },true);
  this.addEventListener("onmouseup", function(t) {
    $(this.parentNode).trigger("mouseup",t);
    $(this.parentNode).trigger("onmouseup",t);
  },true);

});
*/
}