let selectedTagInEditor = ""

function showTagEditor(){
    
    static.extrasTitle.innerHTML = 'Tag Editor'
    static.extrasContent.innerHTML = `
    <a id="tagEditorSelected" style="color: white; font-size: 24px;">Selected: none</a><br>
    <form class="input-group-append" onsubmit="event.preventDefault(); tagEditorNew();" style="width:100%">
        <input id="tagEditorInput" name="sel" type="text" placeholder="Selected / New Tag" class="form-control">
        <input type="submit" class="btn btn-primary btn-spaced-1" value="New">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="tagEditorRename(event);" value="Rename">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="tagEditorDelete(event);" value="Delete">
    </form>
    <br>
    <a style="color: white;">Parent tags</a><br>
    <form class="input-group-append" onsubmit="event.preventDefault();" style="width:100%">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="tagEditorRemoveCheckedFromParentsClicked(event);" value="Remove from parents">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="tagEditorCheckAllParents(event);" value="Check all">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="tagEditorUncheckAllParents(event);" value="Uncheck all">
    </form>
    <div id = "parentTags" style="min-height: 10px; width: 100%; background-color: black; text-align: left;">
    </div>
    <br>
    <a style="color: white;">All tags</a><br>
    <form class="input-group-append" onsubmit="event.preventDefault(); tagEditorSearched();" style="width:100%">
        <input id="tagEditorSearch" oninput="tagEditorSearched();" name="s" type="text" placeholder="Search Tags" class="form-control">
        <input type="submit" class="btn btn-primary" value="Search">
    </form>
    <br>
    <form class="input-group-append" onsubmit="event.preventDefault();" style="width:100%">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="tagEditorAddCheckedToParentsClicked(event);" value="Add to parents">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="tagEditorRemoveCheckedFromParentsAllClicked(event);" value="Remove from parents">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="tagEditorCheckAll(event);" value="Check all">
        <input type="button" class="btn btn-primary btn-spaced-1" onclick="tagEditorUncheckAll(event);" value="Uncheck all">
    </form>
    <div id = "allTagsFiltered" style="min-height: 10px; width: 100%; background-color: black; text-align: left;">
    </div>
    `
    static.extrasBack.onclick = showExtrasClicked
    
    showExtrasDialog()
    selectTagToEdit("")
    tagEditorSearched()
}

function makeTagEditorBtn(text="Tag",id="",parent = null, onclick = null){
    let b = document.createElement('span')
    set_dataId(b,id)
    let style = "color: white; border: 0px; background-color: #"+((selectedTagInEditor==id)?"8F8F8F":"4444")+";"
    b.style = style
    b.innerHTML = `
    <input type="checkbox" style="`+style+`">
    <button onclick="`+onclick+`" style="`+style+`">`+text+`</button>`
    if(parent!=null) parent.appendChild(b)
    return b
}

function tagEditorDelete(){
    if(selectedTagInEditor == "") return

    delete project.tags[selectedTagInEditor]
    
    //remove from tags where parent
    let tags = Object.keys(project.tags)
    for(let i = 0; i < tags.length; i++){
        let ind = project.tags[tags[i]].parentTags.indexOf(selectedTagInEditor)
        if(ind!=-1)
            project.tags[tags[i]].parentTags.splice(ind,1)
    }

    //remove from boards
    let boards = Object.keys(project.boards)
    for(let i = 0; i < boards.length; i++){
        let ind = brdAttrOrDef(boards[i],'tags',[]).indexOf(selectedTagInEditor)
        if(ind!=-1)
            project.boards[boards[i]].attributes['tags'].splice(ind,1)
    }


    selectTagToEdit("")
    tagEditorSearched()

    sync.saveAll()
}

function tagEditorRename(){
    if(selectedTagInEditor == "") return

    let s = EbyId('tagEditorInput').value
    
    if(s=="")
        return alert('Tag cant have no name')

    let tgnm = Tag.findTagByName(s)
    if(tgnm!=null&&tgnm!=selectedTagInEditor)
        alert('Tag with same name already exists')
    
    project.tags[selectedTagInEditor].name = s


    selectTagToEdit(selectedTagInEditor)
    tagEditorSearched()

    sync.saveAll()
}

function tagEditorNew(){
    let s = EbyId('tagEditorInput').value

    if(s=="")
        return alert('New tag cant have no name')
        
    
    if(Tag.findTagByName(s)!=null)
        alert('Tag with same name already exists')
    
    let tag = new Tag(s)
    project.tags[tag.id] = tag
    selectTagToEdit(tag.id)


    tagEditorSearched()

    sync.saveAll()
}

function selectTagToEdit(id){
    selectedTagInEditor = id

    //draw parents
    let parents = EbyId('parentTags')
    parents.innerHTML = ''
    
    if(id!=""){
        EbyId('tagEditorSelected').innerHTML = 'Selected: ' + project.tags[id].name
        EbyId('tagEditorInput').value = project.tags[id].name

        for(let i = 0; i < project.tags[selectedTagInEditor].parentTags.length; i++)
            makeTagEditorBtn(project.tags[project.tags[selectedTagInEditor].parentTags[i]].name,project.tags[selectedTagInEditor].parentTags[i],parents,'tagInEditorClicked(event);')
        

    }else{
        EbyId('tagEditorSelected').innerHTML = 'Selected: none'
        EbyId('tagEditorInput').value = ""
    }


}

function tagEditorCheckAll(){

    let nodes = EbyId('allTagsFiltered').childNodes
    for(let i = 0; i < nodes.length; i++)
        nodes[i].childNodes[1].checked = true
    
}
function tagEditorUncheckAll(){

    let nodes = EbyId('allTagsFiltered').childNodes
    for(let i = 0; i < nodes.length; i++)
        nodes[i].childNodes[1].checked = false
    
}

function tagEditorCheckAllParents(){

    let nodes = EbyId('parentTags').childNodes
    for(let i = 0; i < nodes.length; i++)
        nodes[i].childNodes[1].checked = true
    
}
function tagEditorUncheckAllParents(){

    let nodes = EbyId('parentTags').childNodes
    for(let i = 0; i < nodes.length; i++)
        nodes[i].childNodes[1].checked = false
    
}

function tagEditorRemoveCheckedFromParentsClicked(){
    let nodes = EbyId('parentTags').childNodes
    let tags = []

    for(let i = 0; i < nodes.length; i++)
        if(nodes[i].childNodes[1].checked)
            tags.push(dataId(nodes[i]))
        
    

    for(let i = 0; i < tags.length; i++){
        let ind = project.tags[selectedTagInEditor].parentTags.indexOf(tags[i])
        if(ind!=-1)
            project.tags[selectedTagInEditor].parentTags.splice(ind,1)
    }

    

    selectTagToEdit(selectedTagInEditor)
    
    sync.saveAll()
}

function tagEditorRemoveCheckedFromParentsAllClicked(){
    let nodes = EbyId('allTagsFiltered').childNodes
    let tags = []

    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].childNodes[1].checked){
            let id = dataId(nodes[i])

            tags.push(id)
        }
    }

    for(let i = 0; i < tags.length; i++){
        let ind = project.tags[selectedTagInEditor].parentTags.indexOf(tags[i])
        if(ind!=-1)
            project.tags[selectedTagInEditor].parentTags.splice(ind,1)
    }


    selectTagToEdit(selectedTagInEditor)

    sync.saveAll()
}

function tagEditorAddCheckedToParentsClicked(){
    let nodes = EbyId('allTagsFiltered').childNodes
    let tags = []

    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].childNodes[1].checked){
            let id = dataId(nodes[i])

            if(Object.keys(Tag.AllUpstreamParents(id)).includes(selectedTagInEditor))
                return alert('Cant add ' + project.tags[id].name + ' as parent, because its a (possibly indirect) child of the selected tag.')
                

            if(project.tags[selectedTagInEditor].parentTags.includes(id)) continue //already a parent

            if(id == selectedTagInEditor)
                return alert('Cant parent tag to itself.')
                
            

            tags.push(id)
        }
    }

    for(let i = 0; i < tags.length; i++)
        project.tags[selectedTagInEditor].parentTags.push(tags[i])
    


    selectTagToEdit(selectedTagInEditor)

    sync.saveAll()
}

function tagInEditorClicked(){
    let id = dataId(event.srcElement.parentNode)
    
    selectTagToEdit(id)
    tagEditorSearched()
}

function tagEditorSearched(){
    let s = EbyId('tagEditorSearch').value
    
    let allTagsFiltered = EbyId('allTagsFiltered')
    allTagsFiltered.innerHTML = ''

    let allTagIds = Object.keys(project.tags)
    for(let i = 0; i < allTagIds.length; i++)
        if(s==""||project.tags[allTagIds[i]].name.includes(s))
            makeTagEditorBtn(project.tags[allTagIds[i]].name,allTagIds[i],allTagsFiltered,'tagInEditorClicked(event);')
        
    

    
}