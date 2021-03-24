
function pageOpened() :void{
  logt("pageOpened()");
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

function textareaAutoSize(el) :void{
  el.style.height = '1px';
  el.style.height = (1+el.scrollHeight)+'px';
//  el.parentNode.style.height = el.style.height;
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