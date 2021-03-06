

class Tag {
    id :string;
    name :string;
    parentTags :Array<string>; /*ids*/
    

    constructor(name = "",id :string|null =null){
        if (id === null) id = Board.makeId(16);
        this.id = id;

        this.name = name;
        this.parentTags = [];
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

                
            if(pb.tags[id] == null) break;

        }

        return id;
    }
    
    static findTagByName(name :string) :string|null{
        let k = Object.keys(pb.tags);
        for(let j = 0; j < k.length; j++){
            if(pb.tags[k[j]].name == name)return k[j];
        }
        return null;
    }

    static AllUpstreamParents(tagChild /*id*/ :string, oldLst = {}){ /////////*TODO*///// Idk what this does or is xd, how does it work
        let lst = oldLst;

        for(let i = 0; i < pb.tags[tagChild].parentTags.length; i++){
            if(lst[pb.tags[tagChild].parentTags[i]] == null){ //////////////////////////////////////////////////// Should it say != null ??????????????????
                let k = Object.keys(Tag.AllUpstreamParents(pb.tags[tagChild].parentTags[i],lst));
                for(let j = 0; j < k.length; j++){
                    lst[k[j]] = 1;
                }
            }
            lst[pb.tags[tagChild].parentTags[i]] = 1;
        }
        
        return lst;
    }
}
