let driveAPI_Creds = {
  apiKey: 'AIzaSyDXQ9Z_V5TSX-yepF3DYKVjTIWVwpwuoXU',
  clientId: '644898318398-d8rbskiha2obkrrdfjf99qcg773n789i.apps.googleusercontent.com',
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
  scope: 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file' //space separated
}

let storage = {
    
    fileIdByName(name, callback){
        gapi.client.drive.files.list({
          'pageSize': 1,
          fields: "files(id)",
          q: "name='"+name+"'"
        })
        .then((response)=>{
          var files = response.result.files;
          if (files != null && files.length > 0)
            callback(files[0].id)
          else
            callback(null)
        })
        .catch((err)=>{ log(err,'fileIdByName err '); callback(null) })
    },


    //file: name, body, mimeType
    fileUpload(file, callback=null) {
        if(file.mimeType == null)
            file.mimeType = 'text/plain'
        
        gapi.client.drive.files.create({
            resource: file
          })
          .then((resp)=>{
            if(resp.status != 200) log(resp);
            if(callback) callback(resp)
          })
    },

    //If downloaded, pass contents. Else pass null to callback
    fileDownload(name, callback){
      this.fileIdByName(name,(fileId)=>{
        if(fileId != null){

            let dest = new FileReader()
            dest.addEventListener("loadend", function () {
                if(callback) callback(dest.result)
                log(response)
            })
          
            /*
            var user = gapi.auth2.getAuthInstance().currentUser.get();
            var oauthToken = user.getAuthResponse().access_token;
            var xhr = new XMLHttpRequest();
            xhr.open('GET',
              'https://www.googleapis.com/drive/v3/files/' + fileId +
              '?access_token=' + encodeURIComponent(oauthToken));
            xhr.send();
            */
/*
           gapi.client.request({
            'path': 'https://www.googleapis.com/drive/v3/files/' + fileId,
          })
          .execute((response,rawData)=>{
            log(response,'resp')
            log(rawData,'raw')
            if(callback) callback(response)
          })
*/
            gapi.client.drive.files.get({
              'fileId': fileId,
              fields: 'webContentLink'
            })
            .then((success)=>{
              log(success.result.webContentLink.result)    
            },(fail)=>{ log(fail,'File download fail') })

            //.catch((err)=>{ log(err) })
            
        }else{
            callback(null)
        }
        /*
          .on('end', () => {
              //Done
            if(callback)
                callback();
          })
          .on('error', (err) => {
            if (err)
              log({msg: err, type: 'error'});
          })
          .pipe(dest);
*/
          //dest.readAsText(response.fileBlob);
        })
    },


    fileDelete(name, callback=null){
      this.fileIdByName(name,(fileId)=>{
        if(fileId != null){
          gapi.client.drive.files.delete({
          'fileId': fileId
          })
          .then((response)=>{
            log(response,t='fileDelete log')
          })
          .catch((err)=>{ log(err,'fileDelete err '); callback(null) })
        }
      })
  },

    /////////////////////////////////////////////////////// !!!
    fileMove(from,to, callback=null) {
      alert("NOT IMPLEMENTED")
      this.dropbox.filesMove(obj)
      .then(function (response) {
          log(response)
          if(callback) callback(response)
      })
      .catch(function (error) {
          log(error)
          if(callback) callback(error)
      })
    },



    ////////////////////////////////////////////!!!!!!!!
    filesList(path = '') {
        alert("Not implemented")

        gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name)"
          })
          .then((response)=>{ log(response) })
          .catch((error)=>{ log(error) })
          /*
          .then(function(response) {
            appendPre('Files:');
            var files = response.result.files;
            if (files && files.length > 0) {
              for (var i = 0; i < files.length; i++) {
                var file = files[i];
                appendPre(file.name + ' (' + file.id + ')');
              }
            } else {
              appendPre('No files found.');
            }
          });
          */
    },

}