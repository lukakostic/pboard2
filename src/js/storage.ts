

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
          let files = response.result.files;
          if (files != null && files.length > 0)
            callback(files[0].id)
          else
            callback(null)
        })
        .catch((err)=>{/*$FlowIgnore[extra-arg]*/ loge(err,'fileIdByName err '); callback(null) })
    },


    //file: name, body
    fileUpload(file, callback=null) {
        if(file.mimeType == null)
            file.mimeType = 'text/plain'
        
            this.fileIdByName(file.name,(fileId)=>{
              

              if(fileId == null){ //doesnt exist yet. Save it.
              

                let fileBlob = new Blob([file.body], {type: 'text/plain'});
                let metadata = {
                    'name': file.name, // Filename at Google Drive
                    'mimeType': file.mimeType // mimeType at Google Drive
                };
      
                let accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
                let form = new FormData();
                form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
                form.append('file', fileBlob);
      
                let xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                xhr.responseType = 'json';
                xhr.onload = () => {
                    //log(xhr.response); // Retrieve uploaded file ID.
                    if(callback) callback(xhr.response)
                };
                xhr.send(form);


              }else{ //Already exists, update it.


                let fileBlob = new Blob([file.body]);
                /*
                let metadata = {
                    'name': file.name, // Filename at Google Drive
                    'mimeType': file.mimeType // mimeType at Google Drive
                };
                */
      
                let accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.

      
                let xhr = new XMLHttpRequest();
                xhr.open('PATCH', 'https://www.googleapis.com/upload/drive/v3/files/'+fileId);
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                xhr.responseType = 'json';
                xhr.onload = () => {
                    //log(xhr.response); // Retrieve uploaded file ID.
                    if(callback) callback(xhr.response)
                };
                xhr.send(fileBlob);


              }
              })

    },


    //If downloaded, pass contents. Else pass null to callback
    fileDownload(name, callback){
      this.fileIdByName(name,(fileId)=>{
        if(fileId != null){
          // $FlowIgnore[extra-arg]
          logw('get fileId is :',fileId)
          gapi.client.drive.files.get({
            'fileId': fileId,
            'alt': 'media'
          })
          .then((response,rawData)=>{
            callback(response.body) //result: false, body: ''
          })
          .catch((fail)=>{
            // $FlowIgnore[extra-arg]
            loge('fail',fail) 
            callback(null)
          })
  
        }else{
            // $FlowIgnore[extra-arg]
            logw('get fileId is NULL')
            callback(null)
        }

          
        })
    },


    fileDelete(name, callback=null){
      this.fileIdByName(name,(fileId)=>{
        if(fileId != null){
          gapi.client.drive.files.delete({
          'fileId': fileId
          })
          .then((response)=>{
            // $FlowIgnore[extra-arg]
            log(response,t='fileDelete log')
          })
          .catch((err)=>{ /*$FlowIgnore[extra-arg]*/loge(err,'fileDelete err '); if(callback!==null)callback(null) })
        }
      })
  },

    /////////////////////////////////////////////////////// !!!
    fileMove(from,to, callback=null) {
      alert("NOT IMPLEMENTED")
      this.dropbox.filesMove(obj) /////////////?????????
      .then(function (response) {
        // $FlowIgnore[extra-arg]
          log(response)
          if(callback) callback(response)
      })
      .catch(function (error) {
        // $FlowIgnore[extra-arg]
          loge(error)
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
          .then((response)=>{/*$FlowIgnore[extra-arg]*/ log(response) })
          .catch((error)=>{ /*$FlowIgnore[extra-arg]*/ loge(error) })
          /*
          .then(function(response) {
            appendPre('Files:');
            let files = response.result.files;
            if (files && files.length > 0) {
              for (let i = 0; i < files.length; i++) {
                let file = files[i];
                appendPre(file.name + ' (' + file.id + ')');
              }
            } else {
              appendPre('No files found.');
            }
          });
          */
    },

}