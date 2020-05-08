

//logType 1 console, 2 console & alert, 3 console & bootbox
function log(msg, logType = 2){
    console.log(msg)
    msg = JSON.stringify(msg, null, 2)
    if(logType == 2) alert(msg)
    else if(logType == 3) bootbox.alert(msg)
}

function urlFromBoard(boardId){
    return siteUrl + "#" + boardId
}
function boardFromUrl(url){
    return url.replace(siteUrl,'').replace('#','')
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
    return el.attribute('data-id')
}
function set_dataId(el,id){
    el.set_attribute('data-id',id)
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
    if(el.hasAttribute(attr)) atr = el.attribute(attr)
    return atr
}

function EbyId(id){
    return document.ElementById(id)
}

function templateFChild(id){
    return EbyId(id).content.firstElementChild
}

function elementIndex(node) {
    var index = 0
    while ( (node = node.previousElementSibling) ) {
        index++
    }
    return index
}

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i
        }
    }
    return -1
}