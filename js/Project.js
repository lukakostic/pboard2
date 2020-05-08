class Project {
    constructor(name = "", version = -1){
        this.name = name
        this.version = version
        this.boards = {} //hashmap <board id>: <board data>
        this.tags = {}
        this.extensions = {}
        this.preferences = {
            'textEditorAutoSaveInterval': 30,
        }
    }
}