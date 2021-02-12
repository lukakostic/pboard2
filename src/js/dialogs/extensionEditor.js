//@flow


let selectedExtensionInEditor = ""

function showExtensionEditor(){
    
    html.extrasTitle.innerHTML = 'Extension Editor'
    html.extrasContent.innerHTML = `
    <a style="color: white; margin-bottom: 10px;">All Extensions</a>
    
    <form class="input-group-append" onsubmit="event.preventDefault(); extensionEditorSearched(event);" style="width:100%">
        <input id="extensionEditorSearch" oninput="extensionEditorSearched(event);" name="s" type="text" placeholder="Search Extensions" class="form-control">
        <input type="submit" class="btn btn-primary" value="Search">
    </form>
    
    <div id = "allExtensionsFiltered" style="min-height: 10px; width: 100%; background-color: black; text-align: left;"></div>
    
   <br> 

    <a id="extensionEditorSelected" style="color: white; font-size: 24px;">Selected: none</a><br>
    
    <form class="input-group-append" onsubmit="event.preventDefault(); extensionEditorNew(event);" style="width:100%">
        <input id="extensionEditorInput" name="sel" type="text" placeholder="Selected / New Extension" class="form-control" autocomplete="on">
        <input type="submit" class="btn btn-primary btn-spaced-1" value="New">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="extensionEditorSave(event);" value="Save">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="extensionEditorDelete(event);" value="Delete">
    </form>
    
    <form class="row text bg-inherit" style="margin: 5px;">
        <textarea wrap="hard" class="expandInput card-name bg-inherit" id="extensionEditorDescription"
        style="resize: none; padding: 2px 2px 2px 5px; text-overflow: ellipsis; background-color: black; color: white; border: 0px; width: 100%; height: 59px; font-size: 18px;"
        oninput="ui.expandInput(this);" placeholder="Description"></textarea>

        <input type="submit" style="visibility: hidden; width:0px; height:0px; position:absolute;" />
    </form>

    <form class="row text bg-inherit" style="margin: 5px;">
        <textarea wrap="hard" class="expandInput card-name bg-inherit" id="extensionEditorCode"
        style="resize: none; padding: 2px 2px 2px 5px; text-overflow: ellipsis; background-color: black; color: white; border: 0px; width: 100%; height: 59px; font-size: 18px;"
        oninput="ui.expandInput(this);" placeholder="Code"></textarea>

        <input type="submit" style="visibility: hidden; width:0px; height:0px; position:absolute;" />
    </form>

    `
    html.extrasBack.onclick = showExtrasClicked
    
    showExtrasDialog()
    selectExtensionToEdit("")
    extensionEditorSearched()

    ui.expandInputAll()
}

function makeExtensionEditorBtn(text="?",id="",parent = null){
    let b = document.createElement('div')
    set_dataId(b,id)
    let style = "color: white; border: 0px; background-color: #"+((selectedExtensionInEditor==id)?"8F8F8F":"4444")+";"
    b.style = style
    /*
    b.innerHTML = `
    <input type="checkbox" style="`+style+`">
    <button onclick="`+onclick+`" style="`+style+`">`+text+`</button>`;
    */
   b.innerHTML = `
   <a style="color: `+style+`">`+text+`</a>
   <input type="button" class="btn btn-primary btn-spaced-1" onclick="extensionInEditorClicked(event);" value="Select">
   <input type="button" class="btn btn-primary btn-spaced-1" onclick="deleteExtensionClicked(event);" value="Delete">
`
    if(parent!=null) parent.appendChild(b)
    return b
}

function deleteExtensionClicked(event){
    if(event.srcElement == null) event.srcElement = event.target
    let id = dataId(event.srcElement.parentNode)

    delete pb.extensions[id]


    //remove from boards
    let boards = Object.keys(pb.boards)
    for(let i = 0; i < boards.length; i++){
        let ind = findWithAttr( brdAttrOrDef(boards[i],'extensions',[]),'id',id)
        if(ind!=-1)
            pb.boards[boards[i]].attributes['extensions'].splice(ind,1)
    }


    if(selectedExtensionInEditor == id) selectExtensionToEdit("")
    extensionEditorSearched()

    sync.saveAll()
}

function extensionEditorDelete(){
    if(selectedExtensionInEditor == "") return

    delete pb.extensions[selectedExtensionInEditor]
    

    //remove from boards
    let boards = Object.keys(pb.boards)
    for(let i = 0; i < boards.length; i++){
        let ind = findWithAttr( brdAttrOrDef(boards[i],'extensions',[]),'id',selectedExtensionInEditor)
        //let ind = getBrdAttrOrDef(boards[i],'extensions',[]).indexOf(selectedExtensionInEditor);
        if(ind!=-1)
            pb.boards[boards[i]].attributes['extensions'].splice(ind,1)
    }


    selectExtensionToEdit("")
    extensionEditorSearched()

    sync.saveAll()
}

function extensionEditorSave(){
    if(selectedExtensionInEditor == "") return

    let s = EbyId('extensionEditorInput').value
    let desc = EbyId('extensionEditorDescription').value
    let code = EbyId('extensionEditorCode').value

    if(s==""){
        alert('Extension cant have no name')
        return
    }

    pb.extensions[selectedExtensionInEditor].name = s
    pb.extensions[selectedExtensionInEditor].description = desc
    pb.extensions[selectedExtensionInEditor].code = code


    selectExtensionToEdit(selectedExtensionInEditor)
    extensionEditorSearched()

    sync.saveAll()
}

function extensionEditorNew(){
    let s = EbyId('extensionEditorInput').value
    let desc = EbyId('extensionEditorDescription').value
    let code = EbyId('extensionEditorCode').value

    if(s==""){
        alert('New extension cant have no name')
        return
    }
    
    let extension = new Extension(s,desc,code)
    pb.extensions[extension.id] = extension
    selectExtensionToEdit(extension.id)


    extensionEditorSearched()

    sync.saveAll()
}

function selectExtensionToEdit(id){
    selectedExtensionInEditor = id

    //draw parents
    //let parents = EbyId('parentExtensions');
    //parents.innerHTML = '';
    
    if(id!=""){
        EbyId('extensionEditorSelected').innerHTML = 'Selected: ' + pb.extensions[id].name
        EbyId('extensionEditorInput').value = pb.extensions[id].name
        EbyId('extensionEditorDescription').value = pb.extensions[id].description
        EbyId('extensionEditorCode').value = pb.extensions[id].code
    
        //for(let i = 0; i < pb.extensions[selectedExtensionInEditor].parentExtensions.length; i++){
        //    makeExtensionEditorBtn(pb.extensions[pb.extensions[selectedExtensionInEditor].parentExtensions[i]].name,pb.extensions[selectedExtensionInEditor].parentExtensions[i],parents,'extensionInEditorClicked();');
        //}

    }else{
        EbyId('extensionEditorSelected').innerHTML = 'Selected: none';   
        EbyId('extensionEditorInput').value = ""
        EbyId('extensionEditorDescription').value = ""
        EbyId('extensionEditorCode').value = ""
    }


    ui.expandInputAll()
}

function extensionInEditorClicked(event){
    if(event.srcElement == null) event.srcElement = event.target
    let id = dataId(event.srcElement.parentNode)
    
    selectExtensionToEdit(id)
    extensionEditorSearched()
}

function extensionEditorSearched(){
    let s = EbyId('extensionEditorSearch').value
    
    let allExtensionsFiltered = EbyId('allExtensionsFiltered')
    allExtensionsFiltered.innerHTML = ''

    let allExtensionIds = Object.keys(pb.extensions)
    for(let i = 0; i < allExtensionIds.length; i++){
        if(s==""||pb.extensions[allExtensionIds[i]].name.includes(s)){
            makeExtensionEditorBtn(pb.extensions[allExtensionIds[i]].name + " : " + pb.extensions[allExtensionIds[i]].description,allExtensionIds[i],allExtensionsFiltered)
        }
    }

}
