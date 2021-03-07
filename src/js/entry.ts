
//Entry point
//Init drive api and listen for signIn changes
function OnStorageLoad() :void{
  htmlLoaded();

  gapi.load('client:auth2', ()=>{
    gapi.client.init(driveAPI_Creds)
    .then(()=>{
      //Listen for sign in changes and call updateSigninStatus, as well as call the initial one
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    },
    (error)=>{
      alog(error);
      goLogin(); //error initing drive, probably not logged in
    });
  });

}


//after Entry point
//Logged in (or not). Lets load everything up!
function updateSigninStatus(isSignedIn :boolean) :void{
  if(isSignedIn == false){
    goLogin();
    return;
  }
  
  board = boardFromUrl(url());
  
  logw('initial reset or load');
  
  if(sync.loadCachedContent() == false) //load from cache or reset
    resetData();
  else
    pageOpened(); //draw cache opened

  sync.loadAll(); //sync with cloud

  sync.start(false); ///////////////DONT AUTO SAVE/LOAD
}