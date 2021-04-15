//Entry point
/* Since we are deffered script loading, the HTML was loaded. */

_Storage_.init(StorageType.ElectronLocal); //////init with desired StorageType
//_Storage_.init(StorageType.None); //////init with desired StorageType

_Header_.init();
_DialogManager_.init();
_AddonManager_.init();
_Sidebar_.init();
_Navigation_.init();
//init shortcuts:
document.body.addEventListener('keydown',shortcuts_onkeydown,true);

storage.OnStorageLoad(StorageType.None, null); //None/Local/Cache storage loaded


waitCall.Invoke();