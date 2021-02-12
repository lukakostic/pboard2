

function newText(event){
  
  if(event.srcElement == null) event.srcElement = event.target
  let parent = event.srcElement.parentNode.parentNode.parentNode ////////////// replace by find parent thing?

  let el = html.textBrdTemplate.cloneNode(true)

  let brd = new Board(BoardType.Text,"Text","",{references:1})

  pb.boards[brd.id] = brd
  pb.boards[dataId(parent)].content.push(brd.id) //Add to parent list

  parent.appendChild(el)
  ui.loadTextBoard(el,brd.id)

  EbyClass('textBtn',el)[0].click() ////////////////////////// auto open

  ui.fixListUI(parent)
  sync.saveAll()
}


function newBoard(event){

  if(event.srcElement == null) event.srcElement = event.target
  let parent = event.srcElement.parentNode.parentNode.parentNode ////////////// replace by find parent thing?

  let el = html.boardBrdTemplate.cloneNode(true)

  let atr = {description:'Description',references:1}
  let brd = new Board(BoardType.Board,"Board",[],atr)

  pb.boards[brd.id] = brd
  pb.boards[dataId(parent)].content.push(brd.id) //Add to parent list

  parent.appendChild(el)
  ui.loadBoardBoard(el,brd.id)

  
  ui.fixListUI(parent)

  (<HTMLLIElement> EbyClass('textBtn', el)[0]).click() // load board on add, might not want to do this.

  sync.saveAll(()=>{
    //el.getElementsByClassName('textBtn')[0].click(); // load board on add, might not want to do this. and to be moved to before saving?
  })
}


function newList(event){

  let el = html.listTemplate.cloneNode(true)

  if(event.srcElement == null) event.srcElement = event.target
  let inp = event.srcElement.firstElementChild
  let name = inp.value

  let titleText = EbyClass('title-text',el)[0]
//  $(titleText).val(name);
  $(titleText).html(name) //we assume its div at start
  //$(titleText).prop("readonly",true);
  titleText.addEventListener('click',listTitleClicked,true);         ///////?????
  (<HTMLLIElement> titleText).onblur = (event)=>{listTitleBlur(event)};         ////////??????

  let brd = new Board(BoardType.List,name,[],{references:1})
  pb.boards[brd.id] = brd
  pb.boards[board].content.push(brd.id)

  html.boardAlbum.appendChild(el)
  set_dataId(el, brd.id)

  
  ui.fixNewListUI()
  ui.fixAlbumUI()

  ui.makeDraggable() //should only make draggable new list and not all?
  $(inp).val('') //clear new list textbox

  sync.saveAll()
}


//Needs newProject