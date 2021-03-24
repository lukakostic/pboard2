/* Main script tying everything together */

const currentVersion :number = 4;

//base site url
let siteUrl :string = "https://lukakostic.github.io/pb/";
if(window.location.protocol == "file:") //If local.
  siteUrl = window.location.protocol+"//"+window.location.pathname;

let pb :PBoard = null; //currently open PBoard object
let board :string = ""; //currently open board id (from url)

window.addEventListener('error', function(event){
  alert("!!ERROR!!\n\n"+event.message);
});

//set_board on url change
window.onhashchange = function(){
  if(boardFromUrl() != board) //if not same
    set_board(boardFromUrl());
};


//Enforce single instance of pboard across tabs? How to sync them? How to sync across 2 open-at-same-time devices?
/*
let singleInstanceHash = null;

setInterval(()=>{
  //singleInstanceCheck()////////////
},500);

function singleInstanceCheck(){
  //Check if only one instance of pboard is open
  if(singleInstanceHash != null){
    let c = getCookie('singleInstanceHash');
    if( c != singleInstanceHash)
      alert('Multiple instances of pboard open, close or the save can get corrupted or data lost. ['+c+']!=['+singleInstanceHash+']');
  }
  singleInstanceHash = Math.random();
  setCookie('singleInstanceHash', singleInstanceHash);
}
*/