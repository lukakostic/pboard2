declare type BoardTypeT = number;
const BoardType :{[index:string]: BoardTypeT} = {
    Text : 1,
    Board : 2,
    List : 3,
}

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
            'autoSaveInterval': 10,
            'autoLoadInterval': 20
        }
    }
}
declare type BoardId = string;
class Board {
    id :BoardId;
    type :BoardTypeT;
    name :string;
    content :Board[]|any; //! can be PBoard too
    tags :Object;
    attributes :{[index:string]: any} ; //object (isBoard,onMain, etc.)
    

    constructor(type :BoardTypeT, name :string, content :any,  attributes :any = {}, id :BoardId|null = null) {
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
        let boardId :BoardId = "";
        
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
    static deleteBoardById(id :BoardId) :void{
        if(id=="") return;
        delete pb.boards[id];
        
        //go thru every board and remove the id from contents
        for(let i in pb.boards){
            if(pb.boards[i].type == BoardType.Text) continue;

            let ind = pb.boards[i].content.indexOf(id);
            while(ind!=-1){
                pb.boards[i].content.splice(ind,1);
                ind = pb.boards[i].content.indexOf(id);
            }
        }
    }

    static countReferences(id :BoardId) :number{
        let refs = 0;
        for(let i in pb.boards)
          if(i != id && Array.isArray(pb.boards[i].content))
            for(let k = 0; k < pb.boards[i].content.length; k++)
              if(id == pb.boards[i].content[k])
                refs++;
        return refs;
      }
}