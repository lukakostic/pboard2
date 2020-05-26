let preferencesCurrentPref

function showPreferencesDialog(){
  preferencesCurrentPref = Object.create(project.preferences) //pass clone so no changes
  
  static.extrasTitle.innerHTML = 'Preferences'
  static.extrasContent.innerHTML = `<a style="color:white;font-size:16px;">You may need to refresh the page or reopen the board for some preferences to take effect.</a><br><button type="button" class="btn bg-inherit btn-primary" onclick="project.preferences = preferencesCurrentPref; sync.saveAll();" style="width: 100%;">Save</button><br>`+
  prefNumber('autoSaveInterval','Text Editor AutoSave Interval (seconds): ');
  static.extrasBack.onclick = showExtrasClicked
}

function prefNumber(field = "", text = "", type = "Number(("){
return `
<form class="input-group-append" onsubmit="event.preventDefault();" style="margin: 5px; width: 100%;">
<a class="form-control bg-inherit" style="color: white;">`+text+`</a>
<input id="`+field+`" oninput="preferencesCurrentPref['`+field+`'] = `+type+`EbyId('`+field+`').value)); sync.save.dirty=true;" type="number" placeholder="Default: `+new Project().preferences[field]+`" value="`+preferencesCurrentPref[field]+`" class="form-control">

<input type="submit" style="visibility: hidden; width:0px; height:0px; position:absolute;" />
</form>
`
}