function goLogin() {
    set_url(siteUrl + "login/");
}
function goHome() {
    log('goHome');
    set_board("");
}
function goUp() {
    log('goUp');
    let prev = boardHistory.prev();
    if (prev == null)
        prev = "";
    set_board(prev);
}
