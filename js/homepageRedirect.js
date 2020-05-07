if (window.location.href.includes('?d=') == false) redirect2Homepage();

function redirect2Homepage(){
    window.location.href = siteUrl + "home/";
}