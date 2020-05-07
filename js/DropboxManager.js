class DropboxManager {
    constructor(ACCESS_TOKEN) {
        this.access = ACCESS_TOKEN;
        ////////////////////////////////////////////////////////// idfk
        function fetch2(url,other) {
            return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              let params = "";
              let inParams = false;
              for(let i = 0; i < url.length; i++){
                if(url[i]=="#")break;
                if(url[i]=="?"){
                    inParams = true;
                    continue;
                }
                if(inParams){
                    params+=url[i];
                }
              }

              console.log(url);
              console.log(params);
              console.log(other);

              xhr.open(other['method']||'GET', url, true);
              
              let hdrs = Object.keys(other['headers']||{});
              
              for(let i = 0; i < hdrs.length; i++)
                xhr.setRequestHeader(hdrs[i],other['headers'][hdrs[i]]);

              xhr.onload = () => resolve(xhr.responseText);
              xhr.onerror = () => reject(xhr.statusText);
              xhr.send(params);
            });
          }
          //////////////////////////////////////////////////////////

        this.dropbox = new Dropbox.Dropbox({ accessToken: this.access, fetch: fetch});
    }

    static accessFromUrl(url) {
        let ac = "";
        if (url.includes('?d=')) {
            for (let i = url.indexOf('?d=') + 3; i < url.length && url[i] != '?'; i++)
                ac += url[i];
        }
        return ac;
    }

    static fromUrl(url) {
        return new DropboxManager(DropboxManager.accessFromUrl(url));
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

      
    list(path = '',log = null) {
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