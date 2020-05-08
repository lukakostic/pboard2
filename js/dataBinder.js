let dataSave = false;
setInterval(()=>{
    if(dataSave){
        dataSave = false;
        saveAll();
    }
},5000);

function boardTitleChanged(){
    //alert("Board title changed");
    project.boards[board].name = event.srcElement.value;

    loadAllBoardsByDataId(board);

    dataSave = true;
}

function boardDescriptionChanged(){
    //alert("Board title changed");
    setBrdAttr(board,'description',event.srcElement.value);

    loadAllBoardsByDataId(board);

    dataSave = true;
}

function listTitleChanged(){
    console.log('list title changed');

    //alert("List title changed");
    let listId = event.srcElement.parentNode.parentNode.Attribute('data-id');
    project.boards[listId].name = $(event.srcElement).text();

    dataSave = true;
}









/*
class DataBinder {
    constructor() {
        this.bindings = [];
        this.interval = setInterval(()=>{
            update();
        },1);
    }

    update(){
        for(let i = 0; i < this.bindings.length; i++){
            
        }
    }


    //ways = 0 : twoway, ways = 1 : html to js, ways = 2 : js to html
    bindData(element, elementField, jsObject, jsObjectField, ways = 0){
        let binding = {};

        binding['element'] = element;
        binding['elementField'] = elementField;
        binding['jsObject'] = jsObject;
        binding['jsObjectField'] = jsObjectField;

        this.bindings.append(binding);
    }
    
    //ways = 0 : twoway, ways = 1 : html to js, ways = 2 : js to html
    unbindData(element, elementField, jsObject, jsObjectField, ways = 0){
        for(let i = 0; i < this.bindings.length; i++){
            if(this.bindings[i]['element'] == element && this.bindings[i]['elementField'] == elementField && this.bindings[i]['jsObject'] == jsObject && this.bindings[i]['jsObjectField'] == jsObjectField){
                this.bindings.splice(i,1);
            }
        }
    }


    unbindAll(){
        this.bindings = [];
    }
}
*/