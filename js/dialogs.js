
function showBoardBoardDialog(event, id=null){
  if(event.srcElement == null) event.srcElement = event.target
  if(ui.dragItem!=null && ( event.srcElement==ui.dragItem[0] || event.srcElement.parentNode == ui.dragItem[0]))
    return //stop drag-click

  if(id == null)
    id = dataId(event.srcElement.parentNode)
  
  set_board(id)
}

function listTitleClicked(event){
  if(event.srcElement == null) event.srcElement = event.target
  let titleText = event.srcElement
  $(titleText).focus()

  try{
    document.execCommand('selectAll',false,null)
  }catch(e){}

  //can only be clicked while as div, so turn to input
  //    titleText.onclick = null;
      
  //    $(titleText).html("");
  //    titleText.outerHTML = titleText.outerHTML.replace('<div','<input').replace('</div>','</input>');
  //    $(titleText).prop("readonly",false);
  log('Title click')
}
function listTitleBlur(event){
  if(event.srcElement == null) event.srcElement = event.target
  let titleText = event.srcElement
  //can only be blur while as input, so turn to div
  //    titleText.onclick = ()=>{listTitleClicked();};
  //    titleText.onblur = null;
  //    $(titleText).prop("readonly",true);
  //    $(titleText).html(titleText.value);
  //    titleText.outerHTML = titleText.outerHTML.replace('<input','<div').replace('</input>','</div>');
  log('Title blur')
}

function newReferenceBtn(event){
  let refer = window.prompt("Write/Paste id of board to reference:")

  if(refer==null) return
  if(project.boards[refer] == null){ alert("ID doesn't exist :("); return }
  if(project.boards[refer].type == Board.Types.List){alert("Cant embed lists into boards."); return}
/*
  if(board == ""){
      project.boards[refer].attributes['onMain'] = true;
      
      drawListBoard();
  }else{
*/
  if(event.srcElement == null) event.srcElement = event.target
  let lst = event.srcElement.parentNode.parentNode.parentNode
  let lstId = dataId(lst)

  project.boards[lstId].content.push(refer)

  clearBoards(lst)
  ui.loadList(lst,lstId)
  //}

  
  project.boards[refer].attributes['references']++


  hideOptionsDialog()

  sync.saveAll()
}
