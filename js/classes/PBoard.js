//

class PBoard {
    /*::
    name
    version
    boards
    extensions
    tags
    attributes
    preferences
    */
    constructor(name = "", version = -1, attributes = {}){
        this.name = name
        this.version = version
        this.boards = {} //hashmap <board id>: <board data>
        this.extensions = {}
        this.tags = {}
        this.attributes = attributes
        this.preferences = {
            'autoSaveInterval': 30,
            'autoLoadInterval': 5,
        }
    }
}

const BoardType = {
    Text : 1,
    Board : 2,
    List : 3,
    Project: 4
}


class Board {
    /*::
    id
    type
    name
    content //!
    tags
    attributes
    */

    constructor(type, name, content,  attributes = {}, id = null) {
        if (id === null) id = Board.makeId(8)
        
        this.id = id //string
        this.type = type //BoardType
        this.name = name //string
        this.content = content //text or array of ids [string]
        this.tags = {}
        this.attributes = attributes //object (isBoard,onMain, etc.)
    }


    static clone(brd){
        return new Board(brd.type, brd.name, brd.content, brd.attributes)
    }

    static idFromUrl(url) {
        let boardId = ""
        
        //get id from url
        if (url.includes('?b=')) {
            for (let i = url.indexOf('?b=') + 3; i < url.length && url[i] != '?'; i++)
                boardId += url[i]
        }

        return boardId
    }

    static makeId(maxLength) {
        let id = ""
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

        //find unique id
        while(true){

            id = ""
                
            //let length = Math.floor(Math.random() * maxLength) + 1;
            let length = maxLength

            //generate rand chars and append
            for (let i = 0; i < length; i++)
                id += possible.charAt(Math.floor(Math.random() * possible.length))

                
            if(pb.boards[id] == null) break

        }

        return id
    }

    //delete board by id, and dereference its children. Children get deleted if at 0 references.
    static deleteBoardById(id){
        if(id=="") return
        if(pb.boards[id].type != BoardType.Text){ //since they cant contain other boards
            for(let i = 0; i < pb.boards[id].content.length; i++){
                pb.boards[pb.boards[id].content[i]].attributes['references']--
                if(pb.boards[pb.boards[id].content[i]].attributes['references']<=0)
                    Board.deleteBoardById(pb.boards[id].content[i])
            }
        }

        delete pb.boards[id]
        
        //go thru every board and remove the id from contents
        let ids = Object.keys(pb.boards)

        for(let i = 0; i < ids.length; i++){
            if(pb.boards[ids[i]].type == BoardType.Text) continue

            let ind = pb.boards[ids[i]].content.indexOf(id)
            while(ind!=-1){
                pb.boards[ids[i]].content.splice(ind,1)
                ind = pb.boards[ids[i]].content.indexOf(id)
            }
        }

    }
}

