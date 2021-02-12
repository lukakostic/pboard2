let driveAPI_Creds = {
    apiKey: 'AIzaSyDXQ9Z_V5TSX-yepF3DYKVjTIWVwpwuoXU',
    clientId: '644898318398-d8rbskiha2obkrrdfjf99qcg773n789i.apps.googleusercontent.com',
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    scope: 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file'
};
let storage = {
    fileIdByName(name, callback) {
        gapi.client.drive.files.list({
            'pageSize': 1,
            fields: "files(id)",
            q: "name='" + name + "'"
        })
            .then((response) => {
            let files = response.result.files;
            if (files != null && files.length > 0)
                callback(files[0].id);
            else
                callback(null);
        })
            .catch((err) => { loge(err, 'fileIdByName err '); callback(null); });
    },
    fileUpload(file, callback = null) {
        if (file.mimeType == null)
            file.mimeType = 'text/plain';
        this.fileIdByName(file.name, (fileId) => {
            if (fileId == null) {
                let fileBlob = new Blob([file.body], { type: 'text/plain' });
                let metadata = {
                    'name': file.name,
                    'mimeType': file.mimeType
                };
                let accessToken = gapi.auth.getToken().access_token;
                let form = new FormData();
                form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                form.append('file', fileBlob);
                let xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                xhr.responseType = 'json';
                xhr.onload = () => {
                    if (callback)
                        callback(xhr.response);
                };
                xhr.send(form);
            }
            else {
                let fileBlob = new Blob([file.body]);
                let accessToken = gapi.auth.getToken().access_token;
                let xhr = new XMLHttpRequest();
                xhr.open('PATCH', 'https://www.googleapis.com/upload/drive/v3/files/' + fileId);
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                xhr.responseType = 'json';
                xhr.onload = () => {
                    if (callback)
                        callback(xhr.response);
                };
                xhr.send(fileBlob);
            }
        });
    },
    fileDownload(name, callback) {
        this.fileIdByName(name, (fileId) => {
            if (fileId != null) {
                logw('get fileId is :', fileId);
                gapi.client.drive.files.get({
                    'fileId': fileId,
                    'alt': 'media'
                })
                    .then((response, rawData) => {
                    callback(response.body);
                })
                    .catch((fail) => {
                    loge('fail', fail);
                    callback(null);
                });
            }
            else {
                logw('get fileId is NULL');
                callback(null);
            }
        });
    },
    fileDelete(name, callback = null) {
        this.fileIdByName(name, (fileId) => {
            if (fileId != null) {
                gapi.client.drive.files.delete({
                    'fileId': fileId
                })
                    .then((response) => {
                    log(response, t = 'fileDelete log');
                })
                    .catch((err) => { loge(err, 'fileDelete err '); if (callback !== null)
                    callback(null); });
            }
        });
    },
    fileMove(from, to, callback = null) {
        alert("NOT IMPLEMENTED");
        this.dropbox.filesMove(obj)
            .then(function (response) {
            log(response);
            if (callback)
                callback(response);
        })
            .catch(function (error) {
            loge(error);
            if (callback)
                callback(error);
        });
    },
    filesList(path = '') {
        alert("Not implemented");
        gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name)"
        })
            .then((response) => { log(response); })
            .catch((error) => { loge(error); });
    },
};
