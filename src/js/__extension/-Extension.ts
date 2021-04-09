class Extension {
	on :boolean;
	name :string;
	description :string;
	code :string;
    
    constructor(name = "", description = "", code = ""){
        this.name = name;
        this.description = description;
        this.code = code;
		  this.on = true;
    }

}