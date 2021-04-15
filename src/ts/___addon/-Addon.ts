class Addon {
	on :boolean;
	id:string;
	name :string;
	description :string;
	code :string;
    
    constructor(name:string = "", description:string = "", code:string = "", id :string = null){
        this.name = name;
        this.description = description;
        this.code = code;
		  this.on = true;

		  if(id === null){
				id = randomStr(8);  
				while(id in pb.addons)
					id = randomStr(8);
		  }
		  this.id = id;
    }

	 serialize():jsonStr{
		 return JSON.stringify([
			 this.id,
			 this.name,
			 this.on,
			 this.description,
			 this.code
		 ]);
	 }
	 deserialize(json:string):void{
		let o = JSON.parse(json);
		Object.assign(this,{
			 id : o[0],
			 name : o[1],
			 on : o[2],
			 description: o[3],
			 code: o[4]
		 });
	 }
}