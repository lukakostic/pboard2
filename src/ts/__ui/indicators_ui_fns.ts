
//************************************ Indicator UIs ******//
function startDirtyIndicator() :void{
	dbg2('startDirtyIndicator');
	html.savingIndicator.style.display = 'block';
	html.savingIndicator.style.opacity = '0.3';
	html.savingIndicator.style.borderStyle = 'dotted';
}
//saving
function startSavingIndicator() :void{
	dbg2('startSavingIndicator');
	html.savingIndicator.style.opacity = '1';
	html.savingIndicator.style.borderStyle = 'none';
  html.savingIndicator.style.display = 'block';
  (startSavingIndicator as any).time = timeNow(); //in case its too short, see stop
}
function stopSavingIndicator() :void{
	dbg2('stopSavingIndicator');
	html.savingIndicator.style.display = 'none';
	console.log(timeNow());
	console.log((startSavingIndicator as any).time);
	if((timeNow() - (startSavingIndicator as any).time) <500)
		flashSavingIndicator(); //since too short
}
function flashSavingIndicator() :void{
	dbg2('flashSavingIndicator');
  startSavingIndicator();
  if((startSavingIndicator as any).timeout == null)
  (startSavingIndicator as any).timeout = setTimeout(()=>{
	(startSavingIndicator as any).timeout = null;
	 stopSavingIndicator();
  },600);
}
//loading
function startLoadingIndicator() :void{
	dbg2('startLoadingIndicator');
  html.loadingIndicator.style.display = 'block';
  (startLoadingIndicator as any).time = timeNow(); //in case its too short, see stop
}
function stopLoadingIndicator() :void{
	dbg2('stopLoadingIndicator');
  html.loadingIndicator.style.display = 'none';
  console.log(timeNow());
  console.log((startLoadingIndicator as any).time);
  if((timeNow() - (startLoadingIndicator as any).time) <500)
	  flashLoadingIndicator(); //since too short
}
function flashLoadingIndicator() :void{
	dbg2('flashLoadingIndicator');
  startLoadingIndicator();
  if((startLoadingIndicator as any).timeout == null)
  (startLoadingIndicator as any).timeout = setTimeout(()=>{
	(startLoadingIndicator as any).timeout = null;
	 stopLoadingIndicator();
  },600);
}