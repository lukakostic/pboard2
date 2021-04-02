
//enum value to enum key
function enumToStr(obj :any, val :any) :string|null{
	for(let k in obj) if(obj[k] == val) return k;
	return null;
}

//return number hash of string
function hash(str :string) :number{
	let hash = 0;
	let char = 0;
   if (str.length == 0) return hash;
	for (let i = 0; i < str.length; i++) {
		char = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}





///////////////////////////////////////////////////////////////////////////////////// Cookies {
/*
declare let Cookies: any; //3rd party in external


//Cookie functions. format: "_=<cookie object JSON>"
function getMainCookie(){
		let cookieObj = Cookies.get('_'); //URI encoded json unnamed object string
		if(cookieObj == null || cookieObj == undefined || cookieObj == "") cookieObj = {};
		else cookieObj = JSON.parse(decodeURI(cookieObj)); //since string isnt null
		//log('getMainCookie cookieObj',cookieObj)
		return cookieObj;
}
function setMainCookie(cookieObj :any){
		//log('setMainCookie cookieObj',cookieObj)
		Cookies.set('_',encodeURI(JSON.stringify(cookieObj)));
		//log('doc.cookie after setting main',document.cookie)
}


function getCookie(name :string){
		//log('getCookie[',name,']')
		return getMainCookie()[name];
}
function setCookie(name :string,value :any){
		//log('setCookie[',name,']:',value)
		let cookieObj = getMainCookie();
		cookieObj[name] = value;
		setMainCookie(cookieObj);
}
	
	*/
	///////////////////////////////////////////////////////////////////////////////////// Cookies }