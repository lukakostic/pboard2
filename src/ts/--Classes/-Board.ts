declare type BoardTypeT = number;
const BoardType = {
    Text : 1,
    Board : 2,
    List : 3,
}
declare type BoardId = string;

class Board {
	/* Only these fields are saved in build, others and functions arent. */
	 id :BoardId;
    type :BoardTypeT;
    name :string;
    content :BoardId[]|any; //! can be PBoard too
    tags :string[];
    attributes :{[index:string]: any} ; //object (isBoard,onMain, etc.)
	
	 temp :any; //runtime data, doesnt get saved
    

    constructor(type :BoardTypeT, name :string, content :any,  attributes :any = {}, id :BoardId|null = null) {
        if (id === null) id = Board.makeId(8);
        
        this.id = id;
        this.type = type;
        this.name = name;
        this.content = content;
        this.tags = [];
        this.attributes = attributes;

		  this.temp = {};
    }


	 set(oldVal:any,newVal:any):any{ //mark dirty if oldVal != newVal, doesnt set any property
		if(oldVal==newVal) return oldVal;
		sync.dirty.bChanged.add(this.id);
		return newVal;
	 }
	 setF(field:string,newVal:any):any{ //set property and mark dirty
		if(field in this == false)return undefined;
		if((this as any)[field]==newVal) return newVal;
		sync.dirty.bChanged.add(this.id);
		(this as any)[field] == newVal;
		return newVal;
	 }

	 serialize():jsonStr{
		 return JSON.stringify([
			 this.id,
			 this.type,
			 this.name,
			 this.content,
			 this.tags,
			 this.attributes
		 ]);
	 }
	 deserialize(json:string):void{
		 //console.log("Board deserialize " + json);
			let o = JSON.parse(json);

	  Object.assign(this,{
			id : o[0],
			type : o[1],
			name : o[2],
			content : o[3],
			tags : o[4],
			attributes : o[5],
		});
		
		//console.log(this);
	 }

    static clone(brd :Board) :Board{
        return Object.assign(new Board(null,null,null,null,brd.id), JSON.parse(JSON.stringify(brd)));
    }

    static makeId(maxLength :number) :string{
        let id = randomStr(maxLength);
        while(id in pb.boards)
		  	id = randomStr(maxLength);
        return id;
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