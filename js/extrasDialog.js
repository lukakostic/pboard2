let extrasSelected = null;

function showExtrasDialog(){
    $(static.extrasDialog).modal('show');
}

function extrasBackgroundClicked(){
    if(event.target.id != 'static.extrasDialog') return;
    closeExtrasDialog();
}

function closeExtrasDialog(){
    $(static.extrasDialog).modal('hide');
}

function showExtrasClicked(){
    extrasSelected = board();
    showExtras();
}

function showExtras(){
    
    static.extrasTitle.innerHTML = 'Extras';
    static.extrasContent.innerHTML = `
    <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="showPreferencesDialog()">Preferences</button>
    <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="showTagEditor()">Tags</button>
    <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="showExtensionEditor()">Extensions</button>
    <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="showBackupsDialog()">Backups</button>
    <div style="width: 100%; height: 8px; background-color: black;"></div>
    <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="setBackgroundClicked()">Set Background Image</button>
    <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="showTagsDialog()">Set Board Tags</button>
    <button type="button" class="btn bg-inherit btn-dark" style="width: 100%; margin: 5px; padding: 3px; font-size: 16px;" onclick="showExtensionsDialog()">Set Board Extensions</button>
    `;
    static.extrasBack.onclick = closeExtrasDialog;

    showExtrasDialog();
}

function setBackgroundClicked(){
    let backgroundURL = "";
    backgroundURL = prompt("Enter the url of the background:");
    if(backgroundURL==null)backgroundURL="";

    if(backgroundURL!="") set_brdAttr(extrasSelected,'background',backgroundURL);
    if(backgroundURL=="") delBrdAttr(extrasSelected,'background');

    loadBoardBackgroundImage();
    loadAllBoardsByDataId(extrasSelected);

    saveAll();
}