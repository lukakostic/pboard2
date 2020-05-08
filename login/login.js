
var authorizeButton = document.getElementById('authorize_button')
var signoutButton = document.getElementById('signout_button')

// On load, called to load the auth2 library and API client library.
function handleClientLoad() {
    gapi.load('client:auth2', ()=>{
        gapi.client.init({
                apiKey: 'AIzaSyDXQ9Z_V5TSX-yepF3DYKVjTIWVwpwuoXU',
                clientId: '644898318398-d8rbskiha2obkrrdfjf99qcg773n789i.apps.googleusercontent.com',
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
                scope: 'https://www.googleapis.com/auth/drive.metadata.readonly' //space separated
            }).then(function () {

                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            
                // Handle the initial sign-in state.
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

                authorizeButton.onclick = handleAuthClick;
                signoutButton.onclick = handleSignoutClick;
                
            }, function(error) {
                alert(JSON.stringify(error, null, 2));
            });
    });
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}


/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listFiles();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}


/**
 * Print files.
 */
function listFiles() {
  gapi.client.drive.files.list({
    'pageSize': 10,
    'fields': "nextPageToken, files(id, name)"
  }).then(function(response) {
      /*
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
    */
   redirect();
  });
}

function redirect(){
    window.location.href = web.siteUrl;
}