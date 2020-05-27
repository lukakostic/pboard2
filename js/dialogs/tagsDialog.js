function showTagsDialog(){
    
    static.extrasTitle.innerHTML = 'Board Tags'
    static.extrasContent.innerHTML = `
    <a style="color: white;">Board tags</a><br>
    <div id = "boardTags" style="width: 100%; background-color: black; text-align: left;">
    </div>
    <br>
    <a style="color: white;">All tags</a><br>
    <form class="input-group-append" onsubmit="event.preventDefault(); tagsDialogSearched(event);" style="width:100%">
        <input id="tagsDialogSearch" oninput="tagsDialogSearched(event);" name="s" type="text" placeholder="Search Tags" class="form-control">
        <input type="submit" class="btn btn-primary" value="Search">
    </form>
    <br>
    <div id = "allTagsFiltered" style="width: 100%; background-color: black; text-align: left;">
    </div>
    `
    static.extrasBack.onclick = showExtrasClicked
    let boardTags = EbyId('boardTags')

    
    let allTagIds = brdAttrOrDef(extrasSelected,'tags',[])
    for(let i = 0; i < allTagIds.length; i++)
        tagBtnTemplate(project.tags[allTagIds[i]].name, allTagIds[i], boardTags, boardTagClicked)
    


    showExtrasDialog()
    tagsDialogSearched()
}

function tagBtnTemplate(text="Tag",id="",parent = null, click = null){
    let b = document.createElement('button')
    if(parent!=null)parent.appendChild(b)
    b.style = "color: white; border: 0px; background-color: #4444;"
    set_dataId(b,id)
    b.onclick = click
    b.innerHTML = text
    return b
}

function boardTagClicked(event){
    if(event.srcElement == null) event.srcElement = event.target
    let id = dataId(event.srcElement)
    project.boards[extrasSelected].attributes['tags'].splice(brdAttr(extrasSelected, 'tags').indexOf(id),1)
    event.srcElement.parentNode.removeChild(event.srcElement)

    sync.saveAll()
}

function filteredTagClicked(event){
    if(event.srcElement == null) event.srcElement = event.target
    let id = dataId(event.srcElement)
    
    set_brdAttrIfNull(extrasSelected,'tags',[])

    if(brdAttr(extrasSelected,'tags').indexOf(id)==-1)
        project.boards[extrasSelected].attributes['tags'].push(id)
    else return alert('Already is added to board')
    
    let boardTags = EbyId('boardTags')

    tagBtnTemplate(project.tags[id].name,id,boardTags,boardTagClicked)
    
    
    sync.saveAll()
}

function tagsDialogSearched(){
    let s = EbyId('tagsDialogSearch').value
    
    let allTagsFiltered = EbyId('allTagsFiltered')
    allTagsFiltered.innerHTML = ''

    let allTagIds = Object.keys(project.tags)
    for(let i = 0; i < allTagIds.length; i++)
        if(s==""||project.tags[allTagIds[i]].name.includes(s))
            tagBtnTemplate(project.tags[allTagIds[i]].name,allTagIds[i],allTagsFiltered,filteredTagClicked)
        
    

    
}