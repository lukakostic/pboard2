class PBoard {
    name :string;
    version :number;
    boards : {[index:string]:Board};
    extensions :{[index:string]:Extension};
    tags :{[index:string]:Tag};
    attributes :{[index:string]:any};
    preferences :{[index:string]:any};
    
    constructor(name :string = "", version :number = -1, attributes :any = {}){
        this.name = name;
        this.version = version;
        this.boards = {};
        this.extensions = {};
        this.tags = {};
        this.attributes = attributes;
        this.preferences = {
            'autoSaveInterval': 30,
            'autoLoadInterval': 5
        }
    }
}

declare type BTypeT = number;
interface BoardTypeT{ [index:string]: BTypeT }
const BoardType :BoardTypeT = {
    Text : 1,
    Board : 2,
    List : 3,
    PBoard: 4 //whole new local board
}


class Board {
    id :string;
    type :BTypeT;
    name :string;
    content :any; //! can be PBoard too
    tags :Object;
    attributes :Object; //object (isBoard,onMain, etc.)
    

    constructor(type :BTypeT, name :string, content :any,  attributes :any = {}, id :string|null = null) {
        if (id === null) id = Board.makeId(8)
        
        this.id = id;
        this.type = type;
        this.name = name;
        this.content = content;
        this.tags = {};
        this.attributes = attributes;
    }


    static clone(brd :Board) :Board{
        return new Board(brd.type, brd.name, brd.content, brd.attributes);
    }

    static idFromUrl(url :string) :string{
        let boardId = "";
        
        //get id from url
        if (url.includes('?b=')) {
            for (let i = url.indexOf('?b=') + 3; i < url.length && url[i] != '?'; i++)
                boardId += url[i];
        }

        return boardId;
    }

    static makeId(maxLength :number) :string{
        let id = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

        //find unique id
        while(true){

            id = "";
                
            //let length = Math.floor(Math.random() * maxLength) + 1;
            let length = maxLength;

            //generate rand chars and append
            for (let i = 0; i < length; i++)
                id += possible.charAt(Math.floor(Math.random() * possible.length));

                
            if(pb.boards[id] == null) break;

        }

        return id;
    }

    //delete board by id, and dereference its children. Children get deleted if at 0 references.
    static deleteBoardById(id :string) :void{
        if(id=="") return;
        if(pb.boards[id].type != BoardType.Text){ //since they cant contain other boards
            for(let i = 0; i < pb.boards[id].content.length; i++){
                pb.boards[pb.boards[id].content[i]].attributes['references']--;
                if(pb.boards[pb.boards[id].content[i]].attributes['references']<=0)
                    Board.deleteBoardById(pb.boards[id].content[i]);
            }
        }

        delete pb.boards[id];
        
        //go thru every board and remove the id from contents
        let ids = Object.keys(pb.boards);

        for(let i = 0; i < ids.length; i++){
            if(pb.boards[ids[i]].type == BoardType.Text) continue;

            let ind = pb.boards[ids[i]].content.indexOf(id);
            while(ind!=-1){
                pb.boards[ids[i]].content.splice(ind,1);
                ind = pb.boards[ids[i]].content.indexOf(id);
            }
        }

    }
}