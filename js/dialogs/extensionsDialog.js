class AddedExtension {
    constructor(isOn = true, extId = "") {
        this.on = isOn;
        this.id = extId;
    }
}
function showExtensionsDialog() {
    html.extrasTitle.innerHTML = 'Board Extensions';
    html.extrasContent.innerHTML = `
  <a style="color: white;">Board extensions</a><br>
  <div id = "boardExtensions" style="width: 100%; background-color: black; text-align: left;">
  </div>
  <br>
  <a style="color: white;">All extensions</a><br>
  <form class="input-group-append" onsubmit="event.preventDefault(); extensionsDialogSearched(event);" style="width:100%">
      <input id="extensionsDialogSearch" oninput="extensionsDialogSearched(event);" name="s" type="text" placeholder="Search Extensions" class="form-control">
      <input type="submit" class="btn btn-primary" value="Search">
  </form>
  <br>
  <div id = "allExtensionsFiltered" style="width: 100%; background-color: black; text-align: left;">
  </div>
  `;
    html.extrasBack.onclick = showExtrasClicked;
    let boardExtensions = EbyId('boardExtensions');
    let allExtensionIds = brdAttrOrDef(extrasSelected, 'extensions', []);
    for (let i = 0; i < allExtensionIds.length; i++)
        boardExtensionBtnTemplate(pb.extensions[allExtensionIds[i].id].name + " : " + pb.extensions[allExtensionIds[i].id].description, allExtensionIds[i].on, allExtensionIds[i].id, boardExtensions, boardExtensionClicked);
    showExtrasDialog();
    extensionsDialogSearched();
}
function extensionBtnTemplate(text = "Extension", id = "", parent = null, click = null) {
    let b = document.createElement('button');
    if (parent != null)
        parent.appendChild(b);
    b.style = "text-align: left; margin: 2px; color: white; border: 0px; background-color: #4444;  width: 100%;";
    set_dataId(b, id);
    b.onclick = click;
    b.innerHTML = text;
    return b;
}
function boardExtensionBtnTemplate(text = "Extension", checked = true, id = "", parent = null, click = null) {
    let b = document.createElement('button');
    if (parent != null)
        parent.appendChild(b);
    b.style = "text-align: left; margin: 2px; color: white; border: 0px; background-color: #4444;  width: 100%;";
    set_dataId(b, id);
    b.onclick = click;
    b.innerHTML = `
  <input type="checkbox" onclick="event.stopPropagation(); boardExtensionChecked(event);" ` + (checked ? 'checked' : '') + `>
  ` + text + `
  `;
    return b;
}
function boardExtensionChecked(event) {
    if (event.srcElement == null)
        event.srcElement = event.target;
    let id = dataId(event.srcElement.parentNode);
    let ind = findWithAttr(brdAttr(extrasSelected, 'extensions'), 'id', id);
    pb.boards[extrasSelected].attributes['extensions'][ind].on = !pb.boards[extrasSelected].attributes['extensions'][ind].on;
    sync.saveAll();
}
function boardExtensionClicked(event) {
    if (event.srcElement == null)
        event.srcElement = event.target;
    let id = dataId(event.srcElement);
    pb.boards[extrasSelected].attributes['extensions'].splice(findWithAttr(brdAttr(extrasSelected, 'extensions'), 'id', id), 1);
    event.srcElement.parentNode.removeChild(event.srcElement);
    sync.saveAll();
}
function filteredExtensionClicked(event) {
    if (event.srcElement == null)
        event.srcElement = event.target;
    let id = dataId(event.srcElement);
    set_brdAttrIfNull(extrasSelected, 'extensions', []);
    if (findWithAttr(brdAttr(extrasSelected, 'extensions'), 'ID', id) == -1)
        pb.boards[extrasSelected].attributes['extensions'].push(new AddedExtension(true, id));
    else
        return alert('Already added to this board');
    let boardExtensions = EbyId('boardExtensions');
    boardExtensionBtnTemplate(pb.extensions[id].name + " : " + pb.extensions[id].description, true, id, boardExtensions, boardExtensionClicked);
    sync.saveAll();
}
function extensionsDialogSearched() {
    let s = EbyId('extensionsDialogSearch').value;
    let allExtensionsFiltered = EbyId('allExtensionsFiltered');
    allExtensionsFiltered.innerHTML = '';
    let allExtensionIds = Object.keys(pb.extensions);
    for (let i = 0; i < allExtensionIds.length; i++)
        if (s == "" || pb.extensions[allExtensionIds[i]].name.includes(s))
            extensionBtnTemplate(pb.extensions[allExtensionIds[i]].name + " : " + pb.extensions[allExtensionIds[i]].description, allExtensionIds[i], allExtensionsFiltered, filteredExtensionClicked);
}
