let siteUrl = "https://lukakostic.github.io/pboard/";
let pb = null;
let board = "";
window.onhashchange = function () {
    set_board(boardFromUrl(url()));
};
function url() {
    return window.location.href;
}
function set_url(value) {
    boardHistory.add(value);
    window.location.href = value;
}
function set_board(value) {
    log("set_board('" + value + "')");
    board = value;
    boardHistory.add(value);
    window.location.hash = value;
    ui.pageOpened();
}
function resetData() {
    logw("resetData()");
    pb = new PBoard("", currentVersion);
    pb.boards[""] = new Board(BoardType.List, "", [], { references: 99999999999, main: true }, "");
    set_board("");
}
function buildPBoard() {
    extensions.invoke('buildPBoard');
    let saveFile = {
        syncTime: sync.lastSyncTime,
        pb: pb,
    };
    return JSON.stringify(saveFile);
}
function loadPBoard(content, checkTime = true) {
    log('content:');
    logw(content);
    extensions.invoke('loadPBoard');
    let saveFile = updater.updateSaveFile(JSON.parse(content));
    if (checkTime && sync.lastSyncTime != null && sync.lastSyncTime >= saveFile.syncTime)
        return false;
    sync.flashLoadingIndicator();
    sync.lastSyncTime = saveFile.syncTime;
    pb = saveFile.pb;
    ui.draw();
    return true;
}
function OnStorageLoad() {
    ui.htmlLoaded();
    gapi.load('client:auth2', () => {
        gapi.client.init(driveAPI_Creds).then(() => {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        }, (error) => {
            alog(error);
            goLogin();
        });
    });
}
function updateSigninStatus(isSignedIn) {
    if (isSignedIn == false)
        goLogin();
    else {
        board = boardFromUrl(url());
        logw('initial reset or load');
        if (sync.loadCachedContent() == false)
            resetData();
        else
            ui.pageOpened();
        sync.loadAll();
        sync.start(false);
    }
}
