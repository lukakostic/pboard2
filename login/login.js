let authorizeButton = document.getElementById('authorize_button')
let signoutButton = document.getElementById('signout_button')

// On load, called to load the auth2 library and API client library.
function handleClientLoad() {
  gapi.load('client:auth2', ()=>{
    gapi.client.init(driveAPI_Creds)
    .then(function () {

      //Listen for sign in changes and call updateSigninStatus, as well as call the initial one
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())

      authorizeButton.onclick = handleAuthClick
      signoutButton.onclick = handleSignoutClick
      
    }, (error)=>{ log(error) })
  })
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn()
}
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut()
}

// Called when the signed in status changes, to update the UI
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none'
    signoutButton.style.display = 'block'
    setUrl(siteUrl) // Redirect to site
  } else {
    authorizeButton.style.display = 'block'
    signoutButton.style.display = 'none'
  }
}