class Extension {
    constructor(name = "", description = "", code = "", id = null){
        this.name = name
        this.description = description
        this.code = code
        this.id = id
        if (id === null) this.id = Board.makeId(16)
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

                
            if(pb.extensions[id] == null) break

        }

        return id;
    }
    
    static findExtensionByName(name){
        let k = Object.keys(pb.extensions)
        for(let j = 0; j < k.length; j++){
            if(pb.extensions[k[j]].name == name) return k[j]
        }
        return null
    }

}