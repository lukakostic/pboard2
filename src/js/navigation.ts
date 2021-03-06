


function goLogin() :void{
  set_url(siteUrl + "login/");
}

function goHome() :void{
  
  log('goHome');
  set_board("");
}

function goUp() :void{
  
  log('goUp');
  //boardHistory.pop() //since last url is yours

  let prev = boardHistory.prev();
  if(prev == null) prev = "";
  set_board(prev);
  //window.history.back();
}