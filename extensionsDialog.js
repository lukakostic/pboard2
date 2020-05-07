class AddedExtension{
    constructor(isOn = true, extId = ""){
        this.on = isOn;
        this.id = extId;
    }
}

function showExtensionsDialog(){
    
    static.extrasTitle.innerHTML = 'Board Extensions';
    static.extrasContent.innerHTML = `
    <a style="color: white;">Board extensions</a><br>
    <div id = "boardExtensions" style="width: 100%; background-color: black; text-align: left;">
    </div>
    <br>
    <a style="color: white;">All extensions</a><br>
    <form class="input-group-append" onsubmit="event.preventDefault(); extensionsDialogSearched();" style="width:100%">
        <input id="extensionsDialogSearch" oninput="extensionsDialogSearched();" name="s" type="text" placeholder="Search Extensions" class="form-control">
        <input type="submit" class="btn btn-primary" value="Search">
    </form>
    <br>
    <div id = "allExtensionsFiltered" style="width: 100%; background-color: black; text-align: left;">
    </div>
    `;
    static.extrasBack.onclick = showExtrasClicked;
    let boardExtensions = EbyId('boardExtensions');

    
    let allExtensionIds = getBrdAttrOrDef(extrasSelected,'extensions',[]);
    for(let i = 0; i < allExtensionIds.length; i++){
        let btn = boardExtensionBtnTemplate(project.extensions[allExtensionIds[i].id].name  + " : " + project.extensions[allExtensionIds[i].id].description, allExtensionIds[i].on , allExtensionIds[i].id, boardExtensions, boardExtensionClicked);
    }


    showExtrasDialog();
    extensionsDialogSearched();
}

function extensionBtnTemplate(text="Extension",id="",parent = null, click = null){
    let b = document.createElement('button');
    if(parent!=null)parent.appendChild(b);
    b.style = "text-align: left; margin: 2px; color: white; border: 0px; background-color: #4444;  width: 100%;";
    setDataId(b,id);
    b.onclick = click;
    b.innerHTML = text;
    return b;
}

function boardExtensionBtnTemplate(text="Extension", checked=true,id="",parent = null, click = null){
    let b = document.createElement('button');
    if(parent!=null)parent.appendChild(b);
    b.style = "text-align: left; margin: 2px; color: white; border: 0px; background-color: #4444;  width: 100%;";
    setDataId(b,id);
    b.onclick = click;
    b.innerHTML = `
    <input type="checkbox" onclick="event.stopPropagation(); boardExtensionChecked();" `+(checked?'checked':'')+`>
    `+text+`
    `;
    return b;
}


function boardExtensionChecked(){
    let id = getDataId(event.srcElement.parentNode);
    let ind = findWithAttr(getBrdAttr(extrasSelected, 'extensions'),'id',id);
    //project.boards[extrasSelected].attributes['extensions'].splice(findWithAttr(getBrdAttr(extrasSelected, 'extensions'),'id',id),1);
    //event.srcElement.parentNode.removeChild(event.srcElement);
     
    project.boards[extrasSelected].attributes['extensions'][ind].on = !project.boards[extrasSelected].attributes['extensions'][ind].on;
    
    saveAll();
}

function boardExtensionClicked(){
    let id = getDataId(event.srcElement);
    project.boards[extrasSelected].attributes['extensions'].splice(findWithAttr(getBrdAttr(extrasSelected, 'extensions'),'id',id),1);
    event.srcElement.parentNode.removeChild(event.srcElement);

    
    saveAll();
}

function filteredExtensionClicked(){
    let id = getDataId(event.srcElement);
    
    setBrdAttrIfNull(extrasSelected,'extensions',[]);

    if(findWithAttr(getBrdAttr(extrasSelected,'extensions'),'ID',id)==-1)
        project.boards[extrasSelected].attributes['extensions'].push(new AddedExtension(true,id));
    else{alert('Already is added to this board');return;}
    
    let boardExtensions = EbyId('boardExtensions');

    let btn = boardExtensionBtnTemplate(project.extensions[id].name  + " : " +  project.extensions[id].description, true ,id,boardExtensions,boardExtensionClicked);
    
    
    saveAll();
}

function extensionsDialogSearched(){
    let s = EbyId('extensionsDialogSearch').value;
    
    let allExtensionsFiltered = EbyId('allExtensionsFiltered');
    allExtensionsFiltered.innerHTML = '';

    let allExtensionIds = Object.keys(project.extensions);
    for(let i = 0; i < allExtensionIds.length; i++){
        if(s==""||project.extensions[allExtensionIds[i]].name.includes(s)){
            let btn = extensionBtnTemplate(project.extensions[allExtensionIds[i]].name + " : " + project.extensions[allExtensionIds[i]].description,allExtensionIds[i],allExtensionsFiltered,filteredExtensionClicked);
        }
    }

    
}