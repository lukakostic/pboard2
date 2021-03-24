/////////////TODO use this
/////////////TODO make some UI class? then extend it with this? So i dont have to make a class for dragging..

//dragging
const dragging = {
  dragOld: null, dragNew: null, dragItem: null,
  oldDragIndex: -1, newDragIndex: -1,
  dragStartTime: -999, //used to click if drag < 0.01s (meant to click)
};

function makeBoardsDraggable() :void{
  //make boards draggable
  let draggableLists = $('.draggableList')
  if(draggableLists.length !== 0)
  (draggableLists).sortable({
    items: '.draggable',
    start: (event, drag)=>{
      
      log('drag start')
        dragging.dragItem = drag.item;
        dragging.oldDragIndex = elementIndex(dragging.dragItem[0]);
        dragging.dragNew = dragging.dragOld = drag.item.parent();
        dragging.dragStartTime = (new Date()).getTime();
    },
    stop: (event, drag)=>{
      
      log('drag stop')
      //With a delay so that dragging a board doesnt click its button at end
      setTimeout(()=>{
        //actually move the board
        dragging.newDragIndex = elementIndex(dragging.dragItem[0])
        
        ////////////////////TODO not this
        moveBoards(
          dataId(dragging.dragOld[0]),dragging.oldDragIndex-1,
          dataId(dragging.dragNew[0]),dragging.newDragIndex-1
        );
        //Previously:
        //pb.boards[dataId(dragging.dragOld[0])].content.splice(dragging.oldDragIndex-1,1)
        //pb.boards[dataId(dragging.dragNew[0])].content.splice(dragging.newDragIndex-1,0,dataId(dragging.dragItem[0]))
        
        
        let clickItem = null //if it needs to click below

        if(((new Date()).getTime() - dragging.dragStartTime)<200 && dragging.newDragIndex == dragging.oldDragIndex) //was meant to click probably
        {
          clickItem = dragging.dragItem.find('div')
        }
        else
          sync.saveAll()
      
        
        dragging.dragItem = null
        
        if(clickItem!=null)clickItem.click() //needs dragItem to be null

      },50)
    },
    change: (event, drag)=>{
      
      log('drag change')
        if(drag.sender) dragging.dragNew = drag.placeholder.parent()
    },
    connectWith: ".draggableList"
  }).disableSelection()
}

function makeListsDraggable():void{
  //make lists draggable
  let draggableAlbums = $('.draggableAlbum')
  if(draggableAlbums.length !== 0)
  (draggableAlbums).sortable({
    items: '.draggableList',
    start: (event, drag)=>{
      
        log('drag list start')
        dragging.dragItem = drag.item
        dragging.oldDragIndex = elementIndex(dragging.dragItem[0])
        dragging.dragStartTime = (new Date()).getTime()
    },
    stop: (event, drag)=>{
      
      log('drag list stop')
      //With a delay so that dragging a board doesnt click its button at end
      setTimeout(()=>{
        //actually move the board
        dragging.newDragIndex = elementIndex(dragging.dragItem[0])

        
        ////////////////////TODO not this
        moveBoards(
          board,dragging.oldDragIndex,
          board,dragging.newDragIndex
        );
        //Previously:
        //pb.boards[board].content.splice(dragging.oldDragIndex,1)
        //pb.boards[board].content.splice(dragging.newDragIndex,0,dataId(dragging.dragItem[0]))
        
        dragging.dragItem = null
        sync.saveAll()

      },50)
    },
    change: (event, ui)=>{
      
      log('drag list change')
      //if(sender) dragNew = placeholder.parent();
        
      //fixNewListUI();
    }
  }).disableSelection()
}

