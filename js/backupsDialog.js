let availableBackups = [];

function showBackupsDialog(){
    
    static.extrasTitle.innerHTML = 'Backups';
    static.extrasContent.innerHTML = `
    <a style="color: white;">New backup</a><br>
    <form class="input-group-append" onsubmit="event.preventDefault(); makeBackupClicked();" style="width:100%">
        <input id="newBackup" name="s" type="text" placeholder="Backup name" class="form-control">
        <input type="submit" class="btn btn-primary" value="Make">
    </form>
    <br>
    <a style="color: white;">Previous backups</a><br>
    <form class="input-group-append" onsubmit="event.preventDefault(); backupsSearched();" style="width:100%">
        <input id="backupSearch" oninput="backupsSearched();" name="s" type="text" placeholder="Search Backups" class="form-control">
        <input type="submit" class="btn btn-primary" value="Search">
    </form>
    <br>
    <div id = "backupsFiltered" style="width: 100%; background-color: black; color: white; text-align: left;">
    </div>
    `;
    static.extrasBack.onclick = showExtrasClicked;


    showExtrasDialog();
    getBackups(function(){backupsSearched();});
}

function getBackups(callB=null){

    let fld = EbyId('backupsFiltered');

    if(fld != undefined) fld.innerHTML = 'Loading..';

    storage.filesList('/pboardbackups',function(msg){
        
        availableBackups = [];

        if(msg.type == 'error')return; //either not found or error
        let backupsFiltered = EbyId('backupsFiltered');
        if(backupsFiltered == undefined)return;

        for(let i = 0; i < msg.msg.entries.length; i++){
            availableBackups.push(msg.msg.entries[i]);
        }

        if(callB)callB();
    });

}

function backupsSearched(){
    let s = EbyId('backupSearch').value;
    let fld = EbyId('backupsFiltered');

    if(fld == undefined) return;

    fld.innerHTML = '';

    if(availableBackups.length==0)return;

    for(let i = 0; i < availableBackups.length; i++){

        if(s!="" && availableBackups[i].name.includes(s)==false)continue;

        let btn = document.createElement('div');
        fld.appendChild(btn);
        btn.style = "width: 100%;";
        btn.classList.toggle("input-group-append",true);
        //console.log('done');

        setDataId(btn,availableBackups[i].id);

        btn.innerHTML = `
            <div style="color: white;">`+'['+availableBackups[i].client_modified+'] '+availableBackups[i].name+`</div>
            <input type="button" class="btn btn-primary btn-spaced-1" onclick="loadBackupClicked();" value="Load">
            <input type="button" class="btn btn-primary btn-spaced-1" onclick="renameBackupClicked();" value="Rename">
            <input type="button" class="btn btn-primary btn-spaced-1" onclick="deleteBackupClicked();" value="Delete">
        `;

    }

}

function makeBackupClicked(){

    let bkName = EbyId('newBackup').value;
    
//new Date().getTime()+" "+ 
alert("Not implemented"); //Upload by path
    storage.fileUpload({ path: '/pboardbackups/' , name: bkName + '.pbb', contents: buildProject()},()=>{
        
        getBackups(function(){backupsSearched();});
        alert('Made backup');  
    },
      (msg)=>{
        if(msg.type == 'error') bootbox.alert(JSON.stringify(msg.msg));
      });
}

function deleteBackupClicked(){
    let ind = findWithAttr(availableBackups,'id', getDataId(event.srcElement.parentNode));

    alert("Not implemented"); //deleting by path
    storage.fileDelete(availableBackups[ind].path_lower,function(){
    //getBackups(function(){backupsSearched();});
    alert('Backup deleted');
    });
   availableBackups.splice(ind,1);
   backupsSearched();
}


function renameBackupClicked(){

    let ind = findWithAttr(availableBackups,'id', getDataId(event.srcElement.parentNode));
   
    let name = prompt("New name for "+availableBackups[ind].name+"? (cant match a different backup)",availableBackups[ind].name);
   
    if(name == "") return;

    storage.fileMove(availableBackups[ind].path_lower,availableBackups[ind].path_lower.substring(0, availableBackups[ind].path_lower.lastIndexOf("/"))+"/"+name ,function(){
    //getBackups(function(){backupsSearched();});
    alert('Backup renamed');
    });
   availableBackups[ind].name = name;
   backupsSearched();
}

function loadBackupClicked(){

    let ind = findWithAttr(availableBackups,'id', getDataId(event.srcElement.parentNode));

    alert("Not implemented"); //download by path
    storage.fileDownload(availableBackups[ind].path_lower,function(contents){
    //getBackups(function(){backupsSearched();});
    loadFromContent(contents);
    alert('Loaded');
    if(confirm('Save?'))saveAll();
    });
}