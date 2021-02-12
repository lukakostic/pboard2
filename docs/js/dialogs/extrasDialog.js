//

let extrasSelected = null

function showExtrasDialog(){
  $(html.extrasDialog).modal('show')
}

function extrasBackgroundClicked(event){
  if(event.target.id != 'html.extrasDialog') return
  closeExtrasDialog()
}

function closeExtrasDialog(){
  $(html.extrasDialog).modal('hide')
}

function showExtrasClicked(){
  extrasSelected = board
  showExtras()
}

function showExtras(){
  
  html.extrasTitle.innerHTML = 'Extras'
  html.extrasContent.innerHTML = `
  <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="showPreferencesDialog(event)">Preferences</button>
  <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="showTagEditor(event)">Tags</button>
  <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="showExtensionEditor(event)">Extensions</button>
  <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="showBackupsDialog(event)">Backups</button>
  <div style="width: 100%; height: 8px; background-color: black;"></div>
  <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="setBackgroundClicked(event)">Set Background Image</button>
  <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="showTagsDialog(event)">Set Board Tags</button>
  <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="showExtensionsDialog(event)">Set Board Extensions</button>
  `
  html.extrasBack.onclick = closeExtrasDialog

  showExtrasDialog()
}

function setBackgroundClicked(){
  let backgroundURL = ""
  backgroundURL = prompt("Enter the url of the background:")
  if(backgroundURL==null) backgroundURL=""

  if(backgroundURL!="") set_brdAttr(extrasSelected,'background', backgroundURL)
  if(backgroundURL=="") delBrdAttr(extrasSelected,'background')

  ui.loadBoardBackgroundImage()
  ui.loadAllBoardsByDataId(extrasSelected)

  sync.saveAll()
}