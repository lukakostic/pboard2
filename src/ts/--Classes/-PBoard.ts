class PBoard {
    readonly name :string;
    readonly version :number;
    readonly preferences :{[index:string]:any};
    readonly boards : {[index:string]:Board};
    readonly addons :{[index:string]:Addon};
    readonly tags :{[index:string]:Tag};
    readonly attributes :{[index:string]:any};

	 //Used only during loading:
    //loadedBoardList:string[];
	 //loadedAddonList:string[];

    constructor(name :string = "", version :number = -1, attributes :any = {}){
        this.name = name;
        this.version = version;
        this.preferences = defaultPreferences();

        this.boards = {};
        this.addons = {};
        this.tags = {};
        this.attributes = attributes;

		  //this.loadedBoardList = null;
		  //this.loadedAddonList = null;
    }
	 serializeAllStructured(
		 do_pb = true, do_pbAttr = true, do_pbTags = true, do_addons = true, do_boards = true
	 ) :StructuredSave {
		return {
			pb: do_pb? this.serializePBData() :null,
			pbAttributes: do_pbAttr? this.serializeAttributes() :null,
			pbTags: do_pbTags? this.serializeTags() :null,
			addons: do_addons? this.serializeAllAddons() :null,
			addonsRemoved: do_addons?'*':null,
			boards: do_boards? this.serializeAllBoards() :null,
			boardsRemoved: do_boards?'*':null,
		};
	}
	 serializePBData():jsonStr{
		return JSON.stringify([
			timeNow(), //syncTime

			this.name,
			this.version,
			this.preferences,
			//Object.keys(this.boards), /////////// Board list
			//Object.keys(this.addons), /////////// Addon list
		]);
	}
	deserializePBData(json:string):void{
	  let o = JSON.parse(json);
	  Object.assign(this,{
			name : o[1],
			version : o[2],
			preferences : o[3],

			//loadedBoardList :o[4],
			//loadedAddonList :o[5],
		});
   }
	serializeAttributes():jsonStr{
		return JSON.stringify( this.attributes );
	}
	deserializeAttributes(json:string):void{
	  (this as any).attributes = JSON.parse(json);
   }
	serializeTags():jsonStr{
		return JSON.stringify( this.tags );
	}
	deserializeTags(json:string):void{
		(this as any).tags = JSON.parse(json);
	}
	serializeAllAddons():{[index:string]:jsonStr}{
		let a = {} as {[index:string]:string};
		for(let e in this.addons)
			a[e] = this.addons[e].serialize();
		return a;
	}
	deserializeAllAddons(o:{[index:string]:jsonStr}):void{
	  (this as any).addons = {};
		for(let b in o){
			let brd = new Addon(null,null,null,b);
			brd.deserialize(o[b]);
			(this as any).addons[b] = brd;
		}
	}
	serializeAllBoards():{[index:string]:string}{
		let a = {} as {[index:string]:string};
		for(let b in this.boards)
			a[b] = this.boards[b].serialize();
		return a;
	}
	deserializeAllBoards(o:{[index:string]:string}):void{
		(this as any).boards = {};
		for(let b in o){
			let brd = new Board(null,null,null,null,b);
			brd.deserialize(o[b]);
			(this as any).boards[b] = brd;
		}
	}
	 

}