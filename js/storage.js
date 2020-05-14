let driveAPI_Creds = {
  apiKey: 'AIzaSyDXQ9Z_V5TSX-yepF3DYKVjTIWVwpwuoXU',
  clientId: '644898318398-d8rbskiha2obkrrdfjf99qcg773n789i.apps.googleusercontent.com',
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
  scope: 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file' //space separated
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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


    //file: name, body
    fileUpload(file, callback=null) {
        if(file.mimeType == null)
            file.mimeType = 'text/plain'
        
            this.fileIdByName(file.name,(fileId)=>{
              

              if(fileId == null){ 
              

                var fileBlob = new Blob([file.body], {type: 'text/plain'});
                var metadata = {
                    'name': file.name, // Filename at Google Drive
                    'mimeType': file.mimeType // mimeType at Google Drive
                };
      
                var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
                var form = new FormData();
                form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
                form.append('file', fileBlob);
      
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                xhr.responseType = 'json';
                xhr.onload = () => {
                    console.log(xhr.response); // Retrieve uploaded file ID.
                    if(callback) callback(xhr.response)
                };
                xhr.send(form);


              }else{


                //var fileBlob = new Blob([file.body]);
                /*
                var metadata = {
                    'name': file.name, // Filename at Google Drive
                    'mimeType': file.mimeType // mimeType at Google Drive
                };
                */
      
                var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.

      
                var xhr = new XMLHttpRequest();
                xhr.open('PATCH', 'https://www.googleapis.com/upload/drive/v3/files/'+fileId);
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                xhr.responseType = 'json';
                xhr.onload = () => {
                    console.log(xhr.response); // Retrieve uploaded file ID.
                    if(callback) callback(xhr.response)
                };
                xhr.send(file.body);


              }
              })

    },


    //If downloaded, pass contents. Else pass null to callback
    fileDownload(name, callback){
      this.fileIdByName(name,(fileId)=>{
        if(fileId != null){

          gapi.client.drive.files.get({
            'fileId': fileId,
            'alt': 'media'
          })
          .then((response,rawData)=>{
            callback(response.body) //result: false, body: ''
          })
          .catch((fail)=>{
            console.log('fail',fail) 
            callback(null)
          })
  
        }else{
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