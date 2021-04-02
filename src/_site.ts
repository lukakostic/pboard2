const currentVersion :number = 4;

let siteUrl :string = "https://lukakostic.github.io/pb/";
if(window.location.protocol == "file:") //If local.
  siteUrl = window.location.protocol+"//"+window.location.pathname;