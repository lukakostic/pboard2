let availableBackups = []

function showBackupsDialog(){
    
    static.extrasTitle.innerHTML = 'Backups'
    static.extrasContent.innerHTML = `
    <a style="color: white;">New backup</a><br>
    <form class="input-group-append" onsubmit="event.preventDefault(); makeBackupClicked(event);" style="width:100%">
        <input id="newBackup" name="s" type="text" placeholder="Backup name" class="form-control">
        <input type="submit" class="btn btn-primary" value="Make">
    </form>
    <br>
    <a style="color: white;">Previous backups</a><br>
    <form class="input-group-append" onsubmit="event.preventDefault(); backupsSearched(event);" style="width:100%">
        <input id="backupSearch" oninput="backupsSearched();" name="s" type="text" placeholder="Search Backups" class="form-control">
        <input type="submit" class="btn btn-primary" value="Search">
    </form>
    <br>
    <div id = "backupsFiltered" style="width: 100%; background-color: black; color: white; text-align: left;">
    </div>
    `
    static.extrasBack.onclick = showExtrasClicked


    showExtrasDialog()
    backups(()=>{backupsSearched()})
}

function backups(callB=null){

    let fld = EbyId('backupsFiltered')

    if(fld != undefined) fld.innerHTML = 'Loading..'

    storage.filesList('pboardbackups', (msg)=>{
        
        availableBackups = []

        if(msg.type == 'error') return //either not found or error
        let backupsFiltered = EbyId('backupsFiltered')
        if(backupsFiltered == undefined) return

        for(let i = 0; i < msg.msg.entries.length; i++)
            availableBackups.push(msg.msg.entries[i])
        
        if(callB) callB()
    })

}

function backupsSearched(){
    let s = EbyId('backupSearch').value
    let fld = EbyId('backupsFiltered')

    if(fld == undefined) return

    fld.innerHTML = ''

    if(availableBackups.length==0) return

    for(let i = 0; i < availableBackups.length; i++){

        if(s!="" && availableBackups[i].name.includes(s)==false) continue

        let btn = document.createElement('div')
        fld.appendChild(btn)
        btn.style = "width: 100%;"
        btn.classList.toggle("input-group-append",true)
        //log('done');

        set_dataId(btn,availableBackups[i].id)

        btn.innerHTML = `
            <div style="color: white;">`+'['+availableBackups[i].client_modified+'] '+availableBackups[i].name+`</div>
            <input type="button" class="btn btn-primary btn-spaced-1" onclick="loadBackupClicked(event);" value="Load">
            <input type="button" class="btn btn-primary btn-spaced-1" onclick="renameBackupClicked(event);" value="Rename">
            <input type="button" class="btn btn-primary btn-spaced-1" onclick="deleteBackupClicked(event);" value="Delete">
        `

    }

}

function makeBackupClicked(event){

    let bkName = EbyId('newBackup').value
    
    //new Date().getTime()+" "+ 
    storage.fileUpload({ name: bkName + '.pbb', body: buildPBoard()},()=>{
        
        backups(()=>{ backupsSearched() })
        alert('Made backup')

    },(msg)=>{ log(msg) })
}

function deleteBackupClicked(event){
    if(event.srcElement == null) event.srcElement = event.target
    let ind = findWithAttr(availableBackups,'id', dataId(event.srcElement.parentNode))

    return alert("Not implemented") //deleting by path
    storage.fileDelete(availableBackups[ind].name,()=>{
    //getBackups(function(){backupsSearched();})
    alert('Backup deleted')
    })
   availableBackups.splice(ind,1)
   backupsSearched()
}


function renameBackupClicked(event){

    if(event.srcElement == null) event.srcElement = event.target
    let ind = findWithAttr(availableBackups,'id', dataId(event.srcElement.parentNode))
   
    let name = prompt("New name for "+availableBackups[ind].name+"? (cant match a different backup)",availableBackups[ind].name)
   
    if(name == "") return

    storage.fileMove(availableBackups[ind].name,availableBackups[ind].name.substring(0, availableBackups[ind].name.lastIndexOf("/"))+"/"+name ,()=>{
    //getBackups(function(){backupsSearched();});
    alert('Backup renamed')
    })
   availableBackups[ind].name = name
   backupsSearched()
}

function loadBackupClicked(event){

    if(event.srcElement == null) event.srcElement = event.target
    let ind = findWithAttr(availableBackups,'id', dataId(event.srcElement.parentNode))

    storage.fileDownload(availableBackups[ind].name, (contents)=>{
    //getBackups(function(){backupsSearched();});
    
    resetData()
    loadPBoard(content)
    ui.pageOpened()

    alert('Loaded')
    if(confirm('Save?')) sync.saveAll()
    })
}