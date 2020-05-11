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

    getData(_url, oToken=null, callback) {
      let xmlhttp = new XMLHttpRequest()
      xmlhttp.onreadystatechange = ()=>{
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
              callback(xmlhttp)
          }
      }
      xmlhttp.open('GET', _url, true)
      if(oToken == null) oToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token

      xmlhttp.setRequestHeader('Authorization', 'Bearer ' + oToken)
      xmlhttp.send()
  },

    testDownload(fileId, wcLink, oToken, callback){

      //Weird proxy 404 thing
      
        let resource = {
          'alt':'media'
        }
        gapi.client.request({
          'path': wcLink,
          'method': 'GET',
          //'body': resource
        })
        .execute((response,rawData)=>{
          log(response,'resp')
          log(rawData,'raw')
          if(callback) callback(response)
        })
      

      //403 forbidden
      /*
        var xhr = new XMLHttpRequest();
        xhr.open('GET',
        'https://www.googleapis.com/drive/v3/files/' + fileId +
        '?alt=media&access_token=' + encodeURIComponent(oToken), true)
        xhr.responseType = "blob"
        xhr.onreadystatechange = ()=>{
          log(xhr,'readyStateChange')
          //dest.readAsText(response.fileBlob);
        }
        xhr.setRequestHeader('Authorization', 'Bearer ' + oToken)
        xhr.send();
      */

      //returns id in resp and metadata? in raw
      /*
      let resource = {
        'alt':'media'
      }
      gapi.client.request({
        'path': 'https://www.googleapis.com/drive/v3/files/' + fileId,
        'method': 'GET', //not req
        'body': resource //not req
      })
      .execute((response,rawData)=>{
        log(response,'resp')
        log(rawData,'raw')
        if(callback) callback(response)
      })
      */

      //401 Unauthorized
      /*
     let reqUrl = wcLink + '&access_token=' + encodeURIComponent(oToken)
            
     var xhr = new XMLHttpRequest()
     xhr.open("GET", reqUrl, true)
     xhr.responseType = "blob"
     
     xhr.onreadystatechange = ()=>{
       log(xhr,'readyStateChange')
       //dest.readAsText(response.fileBlob);
     }

     xhr.setRequestHeader('Authorization', 'Bearer ' + oToken)
     xhr.send()
     */

    this.getData(wcLink, oToken, (resp)=>{
      log(resp)
  })

    /*
    var url = 'https://www.googleapis.com/drive/v2/files/' + fileId;
    this.getData(url, (responseMeta)=>{
      log(responseMeta,'getId')
      this.getData(JSON.parse(responseMeta.responseText).downloadUrl, (resp)=>{
          log(resp)
      })
    })
    */
    //.catch((err)=>{ log(err) })

    },

    //If downloaded, pass contents. Else pass null to callback
    fileDownload(name, callback){
      this.fileIdByName(name,(fileId)=>{
        if(fileId != null){
          /*
          let dest = new FileReader()
          dest.addEventListener("loadend", function () {
              log(dest.result)
              if(callback) callback(dest.result)
          })
          */
        
          let oauthToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token

          gapi.client.drive.files.get({
            'fileId': fileId,
            fields: 'webContentLink'
          })
          .then((success)=>{
          this.testDownload(fileId, success.result.webContentLink, oauthToken, callback)
          },(fail)=>{ log(fail,'webContentLink fail') })
          


            
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