const currentVersion = 5;

let siteUrl = "https://lukakostic.github.io/pb/";
if(window.location.protocol == "file:") //If local.
  siteUrl = window.location.protocol+"//"+window.location.pathname;