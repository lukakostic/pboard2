
let draw_initialLoaded = false;
function draw_initial_fn() :void{
	draw_initialLoaded = false;
	dbg("draw_initial()");

	
	draw();

	sidebar.sidebar_openClose(false); ///////TODO option
}


function draw() :void{
  if(draw_initialLoaded) return draw_initial_fn();
  dbg("draw()");
  
  if(mainView != null)
    mainView = mainView.update(board,0) as ViewTree; //sets to null if cant

	dbg('draw after update',mainView);
  if(mainView == null)
    mainView = generateView(board,null,0) as ViewTree;

  setMainView(mainView);
  mainView.render();
    

  addonManager.loaded();
}