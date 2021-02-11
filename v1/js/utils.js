/* Commonly used methods, without side effects. */

//Debug logs, only used for debug and not actual messages.
let LOG_DISABLED = true
let LOGW_DISABLED = true
let LOGE_DISABLED = false

//console log
log = function(){
    if(LOG_DISABLED)return function(){}
    for(let i = 0; i < arguments.length; i++)
    if(arguments[i] instanceof Error)
    alert(arguments[i])

    return Function.prototype.bind.call(console.log, console);
    let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//console log warning
logw = function(){
    if(LOGW_DISABLED)return function(){}
    return Function.prototype.bind.call(console.warn, console);
    let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//console log error
loge = function(){
    if(LOGE_DISABLED)return function(){}
    return Function.prototype.bind.call(console.error, console);
    let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//alert log
alog = function(){
    //if(LOG_DISABLED)return function(){}
    return Function.prototype.bind.call(console.log, console);
    let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//modal log
mlog = function(){
    //if(LOG_DISABLED)return function(){}
    return Function.prototype.bind.call(console.log, console);
    let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();

function hash(str){
	var hash = 0
	if (str.length == 0) return hash
	for (let i = 0; i < str.length; i++) {
		char = str.charCodeAt(i)
		hash = ((hash<<5)-hash)+char
		hash = hash & hash // Convert to 32bit integer
	}
	return hash
}

//Cookie functions. format: "_=<cookie object JSON>"
function getMainCookie(){
    let cookieObj = Cookies.get('_') //URI encoded json unnamed object string
    if(cookieObj == null || cookieObj == undefined || cookieObj == "") cookieObj = {}
    else cookieObj = JSON.parse(decodeURI(cookieObj)) //since string isnt null
    //log('getMainCookie cookieObj',cookieObj)
    return cookieObj
}
function setMainCookie(cookieObj){
    //log('setMainCookie cookieObj',cookieObj)
    Cookies.set('_',encodeURI(JSON.stringify(cookieObj)))
    //log('doc.cookie after setting main',document.cookie)
}


function getCookie(name){
    //log('getCookie[',name,']')
    return getMainCookie()[name]
}
function setCookie(name,value){
    //log('setCookie[',name,']:',value)
    let cookieObj = getMainCookie()
    cookieObj[name] = value
    setMainCookie(cookieObj)
}

function urlFromBoard(boardId){
    return siteUrl + "#" + boardId
}
function boardFromUrl(url){
    return url.replace(siteUrl,'').replace('#','')
}

function qSel(query,element = document){
    return element.querySelector(query)
}
function qSelAll(query,element = document){
    return element.querySelectorAll(query)
}

function findFirstBoardId(el){
    let id = nulledGetAttribute(el,'data-id')
    if(id!=null) return id
    if(el.parentNode == null) return null
    return findFirstBoardId(el.parentNode)
}

// if text/board get list element (state=1/2), if list return Board (state=3), else float up till first
function parentElementBoard(el,state=-1){

    if(state==-1){
        let id = nulledGetAttribute(el,'data-id')
        if(id == null){
            if(el.parentNode==null) return null
            else return parentElementBoard(el.parentNode)
        }else if(id == ""){ //has attribute but empty
            alert('empty attribute')
            return null
        }else{
            state = pb.boards[id].type
        }
    }
    
    if(state==1||state==2)
        return dataId(el.parentNode)
    else if(state == 3)
        return board

    log('unknown board type')

    return null
}

//Get/Set Board id (data-id) from html element
function dataId(el){
    return el.getAttribute('data-id')
}
function set_dataId(el,id){
    el.setAttribute('data-id',id)
}

//Set attribute of board by id, if it already doesnt have it
function set_brdAttrIfNull(id,attr,val){
    if((attr in pb.boards[id].attributes) == false){
        set_brdAttr(id,attr,val)
        return true
    }
    return false
}

//Set attribute of board by id
function set_brdAttr(id,attr,val){
    pb.boards[id].attributes[attr] = val
}

//Get attribute of board by id
function brdAttr(id,attr){
    return pb.boards[id].attributes[attr]
}

//Get attribute of board by id, or if it doesnt exist return val
function brdAttrOrDef(id,attr,val){
    if(attr in pb.boards[id].attributes)
        return brdAttr(id,attr,val)
    return val
}


//Delete attribute of board by id
function delBrdAttr(id,attr){
    delete pb.boards[id].attributes[attr]
}



function nulledGetAttribute(el,attr){
    let atr = null
    if(el.hasAttribute(attr)) atr = el.getAttribute(attr)
    return atr
}

function EbyId(id){
    return document.getElementById(id)
}
function EbyClass(className, element = document){
    return element.getElementsByClassName(className);
}

function templateFChild(id){
    return EbyId(id).content.firstElementChild
}

function elementIndex(node) {
    let index = 0
    while ( node = node.previousElementSibling )
        index++
    
    return index
}

function findWithAttr(array, attr, value) {
    for(let i = 0; i < array.length; i += 1)
        if(array[i][attr] === value)
            return i
        
    return -1
}