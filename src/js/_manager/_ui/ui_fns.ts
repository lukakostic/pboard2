
function draw() :void{
  dbg("draw()");
  extensions.invoke('pre_newPage');



  //destructor above sets mainView to null
  
  if(mainView != null)
    mainView = mainView.update(board,0); //sets to null if cant

  if(mainView == null)
    mainView = generateView(board,null,0);

  setMainView(mainView);
  mainView.render();
    

  extensions.invoke('newPage');
  extensions.execute();
}






function loadBackground(el:HTMLElement, id :string) :void{ //////////TODO Use this, apply to html.main too!
  el.style.backgroundImage = "url('"+brdAttr(id,'background')+"')";
  el.style.backgroundRepeat = "no-repeat";
  el.style.backgroundSize = "cover";
}

function textareaAutoSize(el :HTMLElement) :void{
  el.style.height = '1px';
  el.style.height = (1+el.scrollHeight)+'px';
//  el.parentNode.style.height = el.style.height;
}

////Indicator UIs
function startDirtyIndicator() :void{
	html.savingIndicator.style.display = 'block';
	html.savingIndicator.style.opacity = '0.3';
	html.savingIndicator.style.borderStyle = 'dotted';
}
function startSavingIndicator() :void{
	html.savingIndicator.style.opacity = '1';
	html.savingIndicator.style.borderStyle = 'none';
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