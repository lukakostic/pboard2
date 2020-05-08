let driveAPI_Creds = {
  apiKey: 'AIzaSyDXQ9Z_V5TSX-yepF3DYKVjTIWVwpwuoXU',
  clientId: '644898318398-d8rbskiha2obkrrdfjf99qcg773n789i.apps.googleusercontent.com',
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
  scope: 'https://www.googleapis.com/auth/drive.metadata.readonly', //space separated
}

let storage = {
    
    getFileIdByName(_name){
        gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name)",
            'q': {
                name: _name
            }
          }).then((response)=>{
            var files = response.result.files;
            if (files && files.length > 0) {
              return files[0].id;
            }
            console.log('getId ', response);
            //return response.entries; //listFiles(response.entries);
        //    if(log) log({msg: response, type: 'log'});
          }).catch((err)=>{
              console.log('getId err ',err);
          });
    },


    fileDelete(name, callback=null, log=null){
        let fileId = this.getFileIdByName(name);
        if(fileId != null){
            gapi.client.drive.files.delete({
            'fileId': fileId
            }, (err) => {
                if (err)
                log({msg: err, type: 'error'});
                if(callback)
                    callback();
            });
        }else{
            return false;
        }
    },

    //file: path, name, mimeType
    fileUpload(file, callback=null, log=null) {
        if(fileObj.mimeType == null)
            fileObj.mimeType = 'text/plain';
        
        gapi.client.drive.files.create({
            resource: {'name' : file.name},
            media: {
                mimeType: file.mimeType,
                body: file.contents
            },
            fields: null
          }, (err, file)  => {
            if (err)
              log({msg: err, type: 'error'});
            if(callback)
                callback(file);
          });
    },

    /////////////////////////////////////////////////////// !!!
    fileMove(from,to, callback=null, log=null) {
        alert("NOT IMPLEMENTED")
      this.dropbox.filesMove(obj)
          .then(function (response) {
              if(log) log({msg: response, type: 'log'});
              else console.log(response);
              if(callback) callback(response);
          })
          .catch(function (error) {
              if(log) log({msg: error, type: 'error'});
              else console.error(error);
              if(callback) callback(error);
          });
    },

    //If downloaded, pass contents. Else pass null to callback
    fileDownload(name, callback=null, log = null){
        let fileId = this.getFileIdByName(name);

        if(fileId != null){

            let dest = new FileReader();
            dest.addEventListener("loadend", function () {
                if(callback) callback(dest.result);
                if(log) log({msg: response, type: 'log'});
            });

            try{
                gapi.client.drive.files.get({
                'fileId': fileId,
                alt: 'media'
                },(res)=>{
                console.log('download ',res);  
                alert(JSON.stringify(res));
                });
            }catch(err){
                log({msg: err, type: 'error'});
            }
        }else{
            callback(null);
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
    },


    ////////////////////////////////////////////!!!!!!!!
    filesList(path = '',log = null) {
        alert("Not implemented");

        gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name)"
          }).then(function (response) {
            //console.log('response', response);
            //return response.entries; //listFiles(response.entries);
            if(log) log({msg: response, type: 'log'});
          })
          .catch(function (error) {
            //console.error(error);
            if(log) log({msg: error, type: 'error'});
          });
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