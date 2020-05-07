class StorageManager {

    constructor(){}

    //file: path, name, mimeType

    /////////////////////////////////////////////////////// !!!
    fileDelete(filePath, callback=null, log=null){
        fileId = null;


        //get id from path

        alert("NOT IMPLEMENTED");

        gapi.client.drive.files.delete({
           fileId: fileId
          }, (err) => {
            if (err)
              log({msg: err, type: 'error'});
            if(callback)
                callback();
          });

    }

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
    }

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
    }

    fileDownload(filePath, callback=null, log = null){
        fileId = null;


        //get id from path

        alert("NOT IMPLEMENTED");

        let dest = new FileReader();
        dest.addEventListener("loadend", function () {
            if(callback) callback(dest.result);
            if(log) log({msg: response, type: 'log'});
          });

        gapi.client.drive.files.get({
           fileId: fileId,
           alt: 'media'
          })
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

          //dest.readAsText(response.fileBlob);
    }

    filesList(path = '',log = null) {
      this.dropbox.filesListFolder({ path: path })
        .then(function (response) {
          //console.log('response', response);
          //return response.entries; //listFiles(response.entries);
          if(log) log({msg: response, type: 'log'});
        })
        .catch(function (error) {
          //console.error(error);
          if(log) log({msg: error, type: 'error'});
        });
    }

}