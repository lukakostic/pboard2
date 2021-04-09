
function draw_initial_fn() :void{
	draw_initialLoaded = false;

	dbg("draw_initial_fn()");

	draw();

	sidebar.sidebar_openClose(false); ///////TODO option
}

let draw_initialLoaded = false;
function draw() :void{
  dbg("draw()");

  if(draw_initialLoaded) return draw_initial_fn();
  
  if(mainView != null)
    mainView = mainView.update(board,0) as ViewTree; //sets to null if cant

	 dbg('draw after update',mainView);
  if(mainView == null)
    mainView = generateView(board,null,0) as ViewTree;

  setMainView(mainView);
  mainView.render();
    

  addonManager.reset();
}






function loadBackground(el:HTMLElement, id :BoardId) :void{ //////////TODO Use this, apply to html.main too!
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