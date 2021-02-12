//@flow


function goLogin(){
  set_url(siteUrl + "login/")
}

function goHome(){
  // $FlowIgnore[extra-arg]
  log('goHome')
  set_board("")
}

function goUp(){
  // $FlowIgnore[extra-arg]
  log('goUp')
  //boardHistory.pop() //since last url is yours

  let prev = boardHistory.prev()
  if(prev == null) prev = ""
  set_board(prev)
  //window.history.back();
}