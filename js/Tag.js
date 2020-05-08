class Tag {
    constructor(name = "",id=null){
        this.name = name
        this.id = id //string
        if (id === null) this.id = Board.makeId(16)
        this.parentTags = []
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
            for (var i = 0; i < length; i++)
                id += possible.charAt(Math.floor(Math.random() * possible.length))

                
            if(project.tags[id] == null) break

        }

        return id
    }
    
    static findTagByName(name){
        let k = Object.keys(project.tags)
        for(let j = 0; j < k.length; j++){
            if(project.tags[k[j]].name == name)return k[j]
        }
        return null
    }

    static getAllUpstreamParents(tagChild, oldLst = {}){
        let lst = oldLst

        for(let i = 0; i < project.tags[tagChild].parentTags.length; i++){
            if(lst[project.tags[tagChild].parentTags[i]] == null){
                let k = Object.keys(Tag.getAllUpstreamParents(project.tags[tagChild].parentTags[i],lst))
                for(let j = 0; j < k.length; j++){
                    lst[k[j]] = 1
                }
            }
            lst[project.tags[tagChild].parentTags[i]] = 1
        }
        
        return lst
    }
}
