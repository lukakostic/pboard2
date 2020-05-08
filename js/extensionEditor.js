
let selectedExtensionInEditor = "";

function showExtensionEditor(){
    
    static.extrasTitle.innerHTML = 'Extension Editor';
    static.extrasContent.innerHTML = `
    <a style="color: white; margin-bottom: 10px;">All Extensions</a>
    
    <form class="input-group-append" onsubmit="event.preventDefault(); extensionEditorSearched();" style="width:100%">
        <input id="extensionEditorSearch" oninput="extensionEditorSearched();" name="s" type="text" placeholder="Search Extensions" class="form-control">
        <input type="submit" class="btn btn-primary" value="Search">
    </form>
    
    <div id = "allExtensionsFiltered" style="min-height: 10px; width: 100%; background-color: black; text-align: left;"></div>
    
   <br> 

    <a id="extensionEditorSelected" style="color: white; font-size: 24px;">Selected: none</a><br>
    
    <form class="input-group-append" onsubmit="event.preventDefault(); extensionEditorNew();" style="width:100%">
        <input id="extensionEditorInput" name="sel" type="text" placeholder="Selected / New Extension" class="form-control" autocomplete="on">
        <input type="submit" class="btn btn-primary btn-spaced-1" value="New">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="extensionEditorSave();" value="Save">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="extensionEditorDelete();" value="Delete">
    </form>
    
    <form class="row text bg-inherit" style="margin: 5px;">
        <textarea wrap="hard" class="expandInput card-name bg-inherit" id="extensionEditorDescription"
        style="resize: none; padding: 2px 2px 2px 5px; text-overflow: ellipsis; background-color: black; color: white; border: 0px; width: 100%; height: 59px; font-size: 18px;"
        oninput="expandInput(this);" placeholder="Description"></textarea>

        <input type="submit" style="visibility: hidden; width:0px; height:0px; position:absolute;" />
    </form>

    <form class="row text bg-inherit" style="margin: 5px;">
        <textarea wrap="hard" class="expandInput card-name bg-inherit" id="extensionEditorCode"
        style="resize: none; padding: 2px 2px 2px 5px; text-overflow: ellipsis; background-color: black; color: white; border: 0px; width: 100%; height: 59px; font-size: 18px;"
        oninput="expandInput(this);" placeholder="Code"></textarea>

        <input type="submit" style="visibility: hidden; width:0px; height:0px; position:absolute;" />
    </form>

    `;
    static.extrasBack.onclick = showExtrasClicked;
    
    showExtrasDialog();
    selectExtensionToEdit("");
    extensionEditorSearched();

    expandInputAll();
}

function makeExtensionEditorBtn(text="?",id="",parent = null){
    let b = document.createElement('div');
    setDataId(b,id);
    let style = "color: white; border: 0px; background-color: #"+((selectedExtensionInEditor==id)?"8F8F8F":"4444")+";";
    b.style = style;
    /*
    b.innerHTML = `
    <input type="checkbox" style="`+style+`">
    <button onclick="`+onclick+`" style="`+style+`">`+text+`</button>`;
    */
   b.innerHTML = `
   <a style="color: `+style+`">`+text+`</a>
   <input type="button" class="btn btn-primary btn-spaced-1" onclick="extensionInEditorClicked();" value="Select">
   <input type="button" class="btn btn-primary btn-spaced-1" onclick="deleteExtensionClicked();" value="Delete">
`;
    if(parent!=null)parent.appendChild(b);
    return b;
}

function deleteExtensionClicked(){
    let id = dataId(event.srcElement.parentNode);

    delete project.extensions[id];


    //remove from boards
    let boards = Object.keys(project.boards);
    for(let i = 0; i < boards.length; i++){
        let ind = findWithAttr( BrdAttrOrDef(boards[i],'extensions',[]),'id',id);
        if(ind!=-1)
            project.boards[boards[i]].attributes['extensions'].splice(ind,1);
    }


    if(selectedExtensionInEditor == id) selectExtensionToEdit("");
    extensionEditorSearched();

    saveAll();
}

function extensionEditorDelete(){
    if(selectedExtensionInEditor == "") return;

    delete project.extensions[selectedExtensionInEditor];
    

    //remove from boards
    let boards = Object.keys(project.boards);
    for(let i = 0; i < boards.length; i++){
        let ind = findWithAttr( BrdAttrOrDef(boards[i],'extensions',[]),'id',selectedExtensionInEditor);
        //let ind = getBrdAttrOrDef(boards[i],'extensions',[]).indexOf(selectedExtensionInEditor);
        if(ind!=-1)
            project.boards[boards[i]].attributes['extensions'].splice(ind,1);
    }


    selectExtensionToEdit("");
    extensionEditorSearched();

    saveAll();
}

function extensionEditorSave(){
    if(selectedExtensionInEditor == "") return;

    let s = EbyId('extensionEditorInput').value;
    let desc = EbyId('extensionEditorDescription').value;
    let code = EbyId('extensionEditorCode').value;

    if(s==""){
        alert('Extension cant have no name');
        return;
    }

    project.extensions[selectedExtensionInEditor].name = s;
    project.extensions[selectedExtensionInEditor].description = desc;
    project.extensions[selectedExtensionInEditor].code = code;


    selectExtensionToEdit(selectedExtensionInEditor);
    extensionEditorSearched();

    saveAll();
}

function extensionEditorNew(){
    let s = EbyId('extensionEditorInput').value;
    let desc = EbyId('extensionEditorDescription').value;
    let code = EbyId('extensionEditorCode').value;

    if(s==""){
        alert('New extension cant have no name');
        return;
    }
    
    let extension = new Extension(s,desc,code);
    project.extensions[extension.id] = extension;
    selectExtensionToEdit(extension.id);


    extensionEditorSearched();

    saveAll();
}

function selectExtensionToEdit(id){
    selectedExtensionInEditor = id;

    //draw parents
    //let parents = EbyId('parentExtensions');
    //parents.innerHTML = '';
    
    if(id!=""){
        EbyId('extensionEditorSelected').innerHTML = 'Selected: ' + project.extensions[id].name;
        EbyId('extensionEditorInput').value = project.extensions[id].name;
        EbyId('extensionEditorDescription').value = project.extensions[id].description;
        EbyId('extensionEditorCode').value = project.extensions[id].code;
    
        //for(let i = 0; i < project.extensions[selectedExtensionInEditor].parentExtensions.length; i++){
        //    makeExtensionEditorBtn(project.extensions[project.extensions[selectedExtensionInEditor].parentExtensions[i]].name,project.extensions[selectedExtensionInEditor].parentExtensions[i],parents,'extensionInEditorClicked();');
        //}

    }else{
        EbyId('extensionEditorSelected').innerHTML = 'Selected: none';    
        EbyId('extensionEditorInput').value = "";
        EbyId('extensionEditorDescription').value = "";
        EbyId('extensionEditorCode').value = "";
    }


    expandInputAll();
}

function extensionInEditorClicked(){
    let id = DataId(event.srcElement.parentNode);
    
    selectExtensionToEdit(id);
    extensionEditorSearched();
}

function extensionEditorSearched(){
    let s = EbyId('extensionEditorSearch').value;
    
    let allExtensionsFiltered = EbyId('allExtensionsFiltered');
    allExtensionsFiltered.innerHTML = '';

    let allExtensionIds = Object.keys(project.extensions);
    for(let i = 0; i < allExtensionIds.length; i++){
        if(s==""||project.extensions[allExtensionIds[i]].name.includes(s)){
            makeExtensionEditorBtn(project.extensions[allExtensionIds[i]].name + " : " + project.extensions[allExtensionIds[i]].description,allExtensionIds[i],allExtensionsFiltered);
        }
    }

}
