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

    async testDownload(fileId, wcLink, oToken, callback){

      await sleep(12000)
      console.error('Test1')

      //404 not found
      //https://drive.google.com/static/proxy.html?usegapi=1&jsh=m;/_/scs/apps-static/_/js/k=oz.gapi.en.jw7XZHvcak8.O/am=wQE/d=1/ct=zgms/rs=AGLTcCOXtLG11kt9d673FzpjO_GiLUGIQA/m=__features__

      {
        let r = gapi.client.request({
          'path': wcLink,
          'method': 'GET',
          'params': {'fileId': fileId, 'alt': 'media'},
          'headers': {'Authorization': 'Bearer ' + oToken }
        })
        r.execute((response,rawData)=>{ //not called at all
          console.log('resp',response)
          console.log('raw',rawData)
        })
      }

      await sleep(12000)
      console.error('Test2')

      //200 OK
      //.execute instead of .then
      //https://content.googleapis.com/drive/v3/files/1EGxCqt8mBEsEuNIUZFhYF7ELTkmA0TOh?fileId=1EGxCqt8mBEsEuNIUZFhYF7ELTkmA0TOh&alt=media&key=AIzaSyDXQ9Z_V5TSX-yepF3DYKVjTIWVwpwuoXU
      {
        let r = gapi.client.request({
          'path': 'https://www.googleapis.com/drive/v3/files/'+fileId,
          'method': 'GET',
          'params': {'fileId': fileId, 'alt': 'media'},
          'headers': {'Authorization': 'Bearer ' + oToken }
        })
        r.execute((response,rawData)=>{
          console.log('resp',response) //undefined
          console.log('raw',rawData) //body:'', content-length:0
        })
      }

      await sleep(12000)
      console.error('Test3')

      //200 OK
      //https://content.googleapis.com/drive/v3/files/1EGxCqt8mBEsEuNIUZFhYF7ELTkmA0TOh?alt=media&key=AIzaSyDXQ9Z_V5TSX-yepF3DYKVjTIWVwpwuoXU
      //body: '', result: false
      {
        gapi.client.drive.files.get({
          'fileId': fileId,
          'alt': 'media'
        })
        .then((response,rawData)=>{
          console.log('resp',response) //result: false, body: ''
          console.log('raw',rawData) //undefined
        })
        .catch((fail)=>{ console.log('fail',fail) })
      }

      await sleep(12000)
      console.error('Test4')
      
      //200 OK
      //https://content.googleapis.com/drive/v3/files/1EGxCqt8mBEsEuNIUZFhYF7ELTkmA0TOh?fileId=1EGxCqt8mBEsEuNIUZFhYF7ELTkmA0TOh&alt=media&key=AIzaSyDXQ9Z_V5TSX-yepF3DYKVjTIWVwpwuoXU
      //same as above
      {
        gapi.client.request({
          'path': 'https://www.googleapis.com/drive/v3/files/'+fileId,
          'method': 'GET',
          'params': {'fileId': fileId, 'alt': 'media'},
          'headers': {'Authorization': 'Bearer ' + oToken }
        })
        .then((response,rawData)=>{
          console.log('resp',response) //result: false, body: ''
          console.log('raw',rawData) //undefined
        })
        .catch((fail)=>{ console.log('fail',fail) })
      }

      await sleep(12000)
      console.error('Test5')

      //403 forbidden
      //https://www.googleapis.com/drive/v3/files/1EGxCqt8mBEsEuNIUZFhYF7ELTkmA0TOh?alt=media&access_token=ya29.a0AfH6SMA2hNeyDaUOZkQ0GXPcOC1Mt_f3wHBhMhfllXuEe-ZjVJTRr3r5ZiX3zz7PURVDGSnp2MXTJTcqt4ijfR5_E7xoPERFh01php6aw-NTuThDJSS5lB9xyEkpV6N5OuXCruCSec2-e-69q9xYuIWmCsUcq9deqwSJ
      //CORS
      {
        var xhr = new XMLHttpRequest();
        xhr.open('GET',
        'https://www.googleapis.com/drive/v3/files/' + fileId +
        '?alt=media&access_token=' + encodeURIComponent(oToken), true)
        xhr.responseType = "blob"
        xhr.onreadystatechange = ()=>{
          console.log('readyStateChange',xhr)
          //dest.readAsText(response.fileBlob);
        }
        xhr.setRequestHeader('Authorization', 'Bearer ' + oToken)
        xhr.send();
      }      


      await sleep(12000)
      console.error('Test6')

      //401 Unauthorized
      //https://drive.google.com/uc?id=1EGxCqt8mBEsEuNIUZFhYF7ELTkmA0TOh&export=download&access_token=ya29.a0AfH6SMA2hNeyDaUOZkQ0GXPcOC1Mt_f3wHBhMhfllXuEe-ZjVJTRr3r5ZiX3zz7PURVDGSnp2MXTJTcqt4ijfR5_E7xoPERFh01php6aw-NTuThDJSS5lB9xyEkpV6N5OuXCruCSec2-e-69q9xYuIWmCsUcq9deqwSJ
      //CORS
      {
        let reqUrl = wcLink + '&access_token=' + encodeURIComponent(oToken)
                
        var xhr = new XMLHttpRequest()
        xhr.open("GET", reqUrl, true)
        xhr.responseType = "blob"
        
        xhr.onreadystatechange = ()=>{
          console.log('readyStateChange',xhr)
          //dest.readAsText(response.fileBlob);
        }

        xhr.setRequestHeader('Authorization', 'Bearer ' + oToken)
        xhr.send()
      }

     await sleep(12000)
     console.error('Test7')

    //200 OK
    //https://drive.google.com/uc?id=1EGxCqt8mBEsEuNIUZFhYF7ELTkmA0TOh&export=download
    //CORS
    {
      let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = ()=>{
          console.log('response',xhr)
      }
      xhr.open('GET', wcLink, true)

      xhr.setRequestHeader('Authorization', 'Bearer ' + oToken)
      xhr.send()
    }

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