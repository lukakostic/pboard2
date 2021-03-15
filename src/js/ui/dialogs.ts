

function showBoardBoardDialog(event, id=null) :void{
  if(event.srcElement == null) event.srcElement = event.target;
  if(drags.dragItem!=null && ( event.srcElement==drags.dragItem[0] || event.srcElement.parentNode == drags.dragItem[0])) // Dont open if being dragged
    return; //stop drag-click

  if(id == null)
    id = dataId(event.srcElement.parentNode);
  
  set_board(id);
}


function listTitleClicked(event) :void{
  if(event.srcElement == null) event.srcElement = event.target;
  let titleText = event.srcElement;
  $(titleText).focus();

  try{
    document.execCommand('selectAll',false,null);
  }catch(e){}

  //can only be clicked while as div, so turn to input
  //    titleText.onclick = null;
      
  //    $(titleText).html("");
  //    titleText.outerHTML = titleText.outerHTML.replace('<div','<input').replace('</div>','</input>');
  //    $(titleText).prop("readonly",false);
  log('Title click');
}


function listTitleBlur(event) :void{
  if(event.srcElement == null) event.srcElement = event.target;
  let titleText = event.srcElement;
  //can only be blur while as input, so turn to div
  //    titleText.onclick = ()=>{listTitleClicked();};
  //    titleText.onblur = null;
  //    $(titleText).prop("readonly",true);
  //    $(titleText).html(titleText.value);
  //    titleText.outerHTML = titleText.outerHTML.replace('<input','<div').replace('</input>','</div>');
  log('Title blur');
}


