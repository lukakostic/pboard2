class StorageManager {

    constructor(){
        this.drive = 
        //this.dropbox = new Dropbox.Dropbox({ accessToken: this.access, fetch: fetch});
    }


    filesDelete(obj, callback=null, log=null){
        this.dropbox.filesDelete(obj)
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

    filesUpload(obj, callback=null, log=null) {
        this.dropbox.filesUpload(obj)
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

    filesMove(obj, callback=null, log=null) {
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

    filesDownload(obj, callback=null, log = null){
        this.dropbox.filesDownload(obj)
        .then(function (response) {
          let blob = response.fileBlob;
          let reader = new FileReader();
    
          reader.addEventListener("loadend", function () {
            if(callback) callback(reader.result);
            if(log) log({msg: response, type: 'log'});
          });
    
          reader.readAsText(blob);
        })
        .catch(function (error) {
            if(callback) callback(null);
            if(log) log({msg: error, type: 'error'});
        });
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