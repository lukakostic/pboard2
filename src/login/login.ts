let authorizeButton :HTMLElement = null;
let signoutButton :HTMLElement = null;
let doRedirect :boolean = false;


// On load, called to load the auth2 library and API client library.
function handleClientLoad_Login() {
  authorizeButton = EbyId('authorize_button');
  signoutButton = EbyId('signout_button');

  gapi.load('client:auth2', function():void{
    gapi.client.init(driveAPI_Creds)
    .then(function () {

      //Listen for sign in changes and call updateSigninStatus_Login, as well as call the initial one
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus_Login);
      updateSigninStatus_Login(gapi.auth2.getAuthInstance().isSignedIn.get());

      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
      
    }, (error:Error)=>{ throw error; });
  });
}

function handleAuthClick(event:Event) :void{
  gapi.auth2.getAuthInstance().signIn();
  doRedirect = true;
}
function handleSignoutClick(event:Event) :void{
  gapi.auth2.getAuthInstance().signOut();
}

// Called when the signed in status changes, to update the UI
function updateSigninStatus_Login(isSignedIn:boolean) :void{
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    if(doRedirect) window.location.href = siteUrl; // Redirect to site
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}