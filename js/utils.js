//Debug logs, only used for debug and not actual messages.
//console log
log = function(){
    for(let i = 0; i < arguments.length; i++)
    if(arguments[i] instanceof Error)
    alert(arguments[i])

    let context = "My Descriptive Logger Prefix:";
    return Function.prototype.bind.call(console.log, console);
    //return Function.prototype.bind.call(console.log, console, context);
}();
//alert log
alog = function(){
    let context = "My Descriptive Logger Prefix:";
    return Function.prototype.bind.call(console.log, console);
    //return Function.prototype.bind.call(console.log, console, context);
}();
//modal log
mlog = function(){
    let context = "My Descriptive Logger Prefix:";
    return Function.prototype.bind.call(console.log, console);
    //return Function.prototype.bind.call(console.log, console, context);
}();
//console log warning
logw = function(){
    let context = "My Descriptive Logger Prefix:";
    return Function.prototype.bind.call(console.warn, console);
    //return Function.prototype.bind.call(console.log, console, context);
}();
//console log warning
loge = function(){
    let context = "My Descriptive Logger Prefix:";
    return Function.prototype.bind.call(console.error, console);
    //return Function.prototype.bind.call(console.log, console, context);
}();

/*
//logType 1 console, 2 console & alert, 3 console & bootbox
function log(msg, title = '', logType = 2){
    if(typeof(title) == 'number') //log(a,1)
        logType = title

    if(title!='')
        console.log(title,msg)
    else
        console.log(msg)
    msg = title + '\n' + JSON.stringify(msg, null, 2)
    if(logType == 2) alert(msg)
    else if(logType == 3) bootbox.alert(msg)
}
*/

function parseCookieText(cookieTxt){
    log('parseCookieText raw text: ', cookieTxt)
    let len = cookieTxt.length
    let cookies = {}
    let name = "", content = "", readingName = true
    for(let i = 0;i<len;i++){
        if(cookieTxt[i] == '=' || cookieTxt[i] == ';'){
            if(readingName == false){
                cookies[name] = content
                name = ""
                content = ""
            }
            readingName = !readingName
            continue
        }
        if(readingName) name += cookieTxt[i]
        else content += cookieTxt[i]
    }
    if(readingName == false){
        cookies[name] = content
    }
    log('parseCookieText cookies: ', cookies)
    return cookies
}
function generateCookieText(cookies){
    log('generateCookieText cookies: ', cookies)
    let cookieTxt = ""
    for (let [key, value] of Object.entries(cookies))
        cookieTxt += key.toString() + '=' + value.toString() + ';'
    log('generateCookieText generated text: ', cookieTxt)
    return cookieTxt
}

//Cookie functions. format: "_=<cookie object JSON>"
function getMainCookie(){
    let cookies = parseCookieText(document.cookie)
    log('getMainCookie',cookies)
    let cookieObj = cookies['_'] //URI encoded string
    if(cookieObj == null || cookieObj == undefined || cookieObj == "") cookieObj = {}
    else cookieObj = JSON.parse(decodeURI(cookieObj)) //string isnt null
    return cookieObj
}
function setMainCookie(jsonContents){
    let cookies = parseCookieText(document.cookie)
    cookies['_'] = encodeURI(jsonContents)
    log('setMainCookie',cookies)
    document.cookie = generateCookieText(cookies)
}

function getCookie(name){
    return getMainCookie()[name]
}
function setCookie(name,value){
    let cookieObj = getMainCookies()
    cookieObj[name] = value
    setMainCookie(JSON.stringify(cookieObj))
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
            state = project.boards[id].type
        }
    }
    

    if(state==1||state==2)
        return dataId(el.parentNode)
    else if(state == 3)
        return board()
    

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
    if((attr in project.boards[id].attributes) == false){
        set_brdAttr(id,attr,val)
        return true
    }
    return false
}

//Set attribute of board by id
function set_brdAttr(id,attr,val){
    project.boards[id].attributes[attr] = val
}

//Get attribute of board by id
function brdAttr(id,attr){
    return project.boards[id].attributes[attr]
}

//Get attribute of board by id, or if it doesnt exist return val
function brdAttrOrDef(id,attr,val){
    if(attr in project.boards[id].attributes)
        return brdAttr(id,attr,val)
    return val
}


//Delete attribute of board by id
function delBrdAttr(id,attr){
    delete project.boards[id].attributes[attr]
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