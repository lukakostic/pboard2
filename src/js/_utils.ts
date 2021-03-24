/* Commonly used methods, without side effects. */

///////////////////////////////////////////////////////////////////////////////////// Logs {

//Debug logs, only used for debug and not actual messages.
let LOG_DISABLED = false;
let LOGW_DISABLED = false;
let LOGE_DISABLED = false;

//console log
const log = function(){
    if(LOG_DISABLED) return function(){};
    for(let i = 0; i < arguments.length; i++)
        if(arguments[i] instanceof Error)
            alert(arguments[i]);

    return Function.prototype.bind.call(console.log, console);
    //let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//log traced
const logt = function(){
    if(LOG_DISABLED) return function(){};
    for(let i = 0; i < arguments.length; i++)
        if(arguments[i] instanceof Error)
            alert(arguments[i]);
    return Function.prototype.bind.call(console.trace, console);
    //let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//console log warning
const logw = function(){
    if(LOGW_DISABLED)return function(){}
    return Function.prototype.bind.call(console.warn, console);
    //let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//console log error
const loge = function(){
    if(LOGE_DISABLED)return function(){}
    return Function.prototype.bind.call(console.error, console);
    //let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//alert log
const alog = function(){
    //if(LOG_DISABLED)return function(){}
    return Function.prototype.bind.call(console.log, console);
    //let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//modal log
const mlog = function(){
    //if(LOG_DISABLED)return function(){}
    return Function.prototype.bind.call(console.log, console);
    //let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();

///////////////////////////////////////////////////////////////////////////////////// Logs }

///////////////////////////////////////////////////////////////////////////////////// Cookies {

declare let Cookies: any; //3rd party in external


//Cookie functions. format: "_=<cookie object JSON>"
function getMainCookie(){
    let cookieObj = Cookies.get('_'); //URI encoded json unnamed object string
    if(cookieObj == null || cookieObj == undefined || cookieObj == "") cookieObj = {};
    else cookieObj = JSON.parse(decodeURI(cookieObj)); //since string isnt null
    //log('getMainCookie cookieObj',cookieObj)
    return cookieObj;
}
function setMainCookie(cookieObj){
    //log('setMainCookie cookieObj',cookieObj)
    Cookies.set('_',encodeURI(JSON.stringify(cookieObj)));
    //log('doc.cookie after setting main',document.cookie)
}


function getCookie(name){
    //log('getCookie[',name,']')
    return getMainCookie()[name];
}
function setCookie(name,value){
    //log('setCookie[',name,']:',value)
    let cookieObj = getMainCookie();
    cookieObj[name] = value;
    setMainCookie(cookieObj);
}


///////////////////////////////////////////////////////////////////////////////////// Cookies }

///////////////////////////////////////////////////////////////////////////////////// PBoard stuff {

function urlFromBoard(boardId :string) :string{
    return siteUrl + "#" + boardId;
}
function boardFromUrl(_url :string = '') :string{
    if(_url === '') _url = window.location.href;
    return _url.replace(siteUrl,'').replace('#','');
}
/*
function findFirstBoardId(el) :string|null{
    let id = nulledGetAttribute(el,'data-id');
    if(id!=null) return id;
    if(el.parentNode == null) return null;
    return findFirstBoardId(el.parentNode);
}
*/

// if text/board get list element (state=1/2), if list return Board (state=3), else float up till first
/*
function parentElementBoard(el,state=-1) :string|null{

    if(state==-1){
        let id = nulledGetAttribute(el,'data-id');
        if(id == null){
            if(el.parentNode==null)
                return null;
            return parentElementBoard(el.parentNode);
        }else if(id == ""){ //has attribute but empty
            alert('empty attribute');
            return null;
        }else{
            state = pb.boards[id].type;
        }
    }
    
    if(state==1||state==2)
        return dataId(el.parentNode);
    else if(state == 3)
        return board;

    log('unknown board type');

    return null;
}
*/
///////////////////////////////////////////////////////////////////////////////////// PBoard stuff }

///////////////////////////////////////////////////////////////////////////////////// Html stuff {


//Get/Set Board id (data-id) from html element
/*
function dataId(el) :string{
    return el.getAttribute('data-id');
}
function set_dataId(el, id :string) :void{
    el.setAttribute('data-id',id);
}
*/



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

//select 1 element by query
function qSel(query :string,element :Element|Document = document){
    return element.querySelector(query);
}
//select all elements by query
function qSelAll(query :string,element :Element|Document = document){
    return element.querySelectorAll(query);
}

function def(a :any, b :any, ifA :Function = x=>x!=null) :any{
    return ifA(a)?a:b;
}


function EbyId(id :string) :HTMLElement|null{
    return document.getElementById(id);
}

/* //You should only use classes for automatic css and visual stuff, not for JS functionality
function EbyClass(className :string, element :HTMLElement|Document = document) :HTMLCollectionOf<Element>|null{
    return element.getElementsByClassName(className);
}
*/

function EbyName(name :string, element :HTMLElement) :HTMLElement|null{
    return element.querySelector('[data-name="'+name+'"]');
}
function EbyNameAll(name :string, element :HTMLElement|Document = document){
    return element.querySelectorAll('[data-name="'+name+'"]');
}

function templateFChild(id :string) :Element|null{
    let el = EbyId(id);
    if(el["content"] != undefined) //is template
        return (<HTMLTemplateElement> el).content.firstElementChild;
    return null;
}

function elementIndex(node :Element) :number{
    let index = 0;
    while(node = node.previousElementSibling)
        index++;
    return index;
}

function findWithAttr(array, attr, value) {
    for(let i = 0; i < array.length; i += 1)
        if(array[i][attr] === value)
            return i;
    return -1;
}


///////////////////////////////////////////////////////////////////////////////////// Html stuff }