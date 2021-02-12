let LOG_DISABLED = false;
let LOGW_DISABLED = false;
let LOGE_DISABLED = false;
let log = function () {
    if (LOG_DISABLED)
        return function () { };
    for (let i = 0; i < arguments.length; i++)
        if (arguments[i] instanceof Error)
            alert(arguments[i]);
    return Function.prototype.bind.call(console.log, console);
}();
let logw = function () {
    if (LOGW_DISABLED)
        return function () { };
    return Function.prototype.bind.call(console.warn, console);
}();
let loge = function () {
    if (LOGE_DISABLED)
        return function () { };
    return Function.prototype.bind.call(console.error, console);
}();
let alog = function () {
    return Function.prototype.bind.call(console.log, console);
}();
let mlog = function () {
    return Function.prototype.bind.call(console.log, console);
}();
function hash(str) {
    let hash = 0;
    let char = 0;
    if (str.length == 0)
        return hash;
    for (let i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}
function getMainCookie() {
    let cookieObj = Cookies.get('_');
    if (cookieObj == null || cookieObj == undefined || cookieObj == "")
        cookieObj = {};
    else
        cookieObj = JSON.parse(decodeURI(cookieObj));
    return cookieObj;
}
function setMainCookie(cookieObj) {
    Cookies.set('_', encodeURI(JSON.stringify(cookieObj)));
}
function getCookie(name) {
    return getMainCookie()[name];
}
function setCookie(name, value) {
    let cookieObj = getMainCookie();
    cookieObj[name] = value;
    setMainCookie(cookieObj);
}
function urlFromBoard(boardId) {
    return siteUrl + "#" + boardId;
}
function boardFromUrl(url) {
    return url.replace(siteUrl, '').replace('#', '');
}
function qSel(query, element = document) {
    return element.querySelector(query);
}
function qSelAll(query, element = document) {
    return element.querySelectorAll(query);
}
function findFirstBoardId(el) {
    let id = nulledGetAttribute(el, 'data-id');
    if (id != null)
        return id;
    if (el.parentNode == null)
        return null;
    return findFirstBoardId(el.parentNode);
}
function parentElementBoard(el, state = -1) {
    if (state == -1) {
        let id = nulledGetAttribute(el, 'data-id');
        if (id == null) {
            if (el.parentNode == null)
                return null;
            else
                return parentElementBoard(el.parentNode);
        }
        else if (id == "") {
            alert('empty attribute');
            return null;
        }
        else {
            state = pb.boards[id].type;
        }
    }
    if (state == 1 || state == 2)
        return dataId(el.parentNode);
    else if (state == 3)
        return board;
    log('unknown board type');
    return null;
}
function dataId(el) {
    return el.getAttribute('data-id');
}
function set_dataId(el, id) {
    el.setAttribute('data-id', id);
}
function set_brdAttrIfNull(id, attr, val) {
    if ((attr in pb.boards[id].attributes) == false) {
        set_brdAttr(id, attr, val);
        return true;
    }
    return false;
}
function set_brdAttr(id, attr, val) {
    pb.boards[id].attributes[attr] = val;
}
function brdAttr(id, attr) {
    return pb.boards[id].attributes[attr];
}
function brdAttrOrDef(id, attr, val) {
    if (attr in pb.boards[id].attributes)
        return brdAttr(id, attr);
    return val;
}
function delBrdAttr(id, attr) {
    delete pb.boards[id].attributes[attr];
}
function nulledGetAttribute(el, attr) {
    let atr = null;
    if (el.hasAttribute(attr))
        atr = el.getAttribute(attr);
    return atr;
}
function EbyId(id) {
    return document.getElementById(id);
}
function EbyClass(className, element = document) {
    return element.getElementsByClassName(className);
}
function templateFChild(id) {
    let el = EbyId(id);
    if (el instanceof HTMLTemplateElement)
        return el.content.firstElementChild;
    else
        return null;
}
function elementIndex(node) {
    let index = 0;
    while (node = node.previousElementSibling)
        index++;
    return index;
}
function findWithAttr(array, attr, value) {
    for (let i = 0; i < array.length; i += 1)
        if (array[i][attr] === value)
            return i;
    return -1;
}
