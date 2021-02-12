let authorizeButton, signoutButton, doRedirect = false;
function handleClientLoad_Login() {
    authorizeButton = EbyId('authorize_button');
    signoutButton = EbyId('signout_button');
    gapi.load('client:auth2', () => {
        gapi.client.init(driveAPI_Creds)
            .then(function () {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus_Login);
            updateSigninStatus_Login(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
        }, (error) => { loge(error); });
    });
}
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
    doRedirect = true;
}
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}
function updateSigninStatus_Login(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        if (doRedirect)
            window.location.href = siteUrl;
    }
    else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}
