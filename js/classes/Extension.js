class Extension {
    constructor(name = "", description = "", code = "", id = null) {
        if (id === null)
            id = Extension.makeId(16);
        this.id = id;
        this.name = name;
        this.description = description;
        this.code = code;
    }
    static makeId(maxLength) {
        let id = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        while (true) {
            id = "";
            let length = maxLength;
            for (let i = 0; i < length; i++)
                id += possible.charAt(Math.floor(Math.random() * possible.length));
            if (pb.extensions[id] == null)
                break;
        }
        return id;
    }
    static findExtensionByName(name) {
        let k = Object.keys(pb.extensions);
        for (let j = 0; j < k.length; j++)
            if (pb.extensions[k[j]].name == name)
                return k[j];
        return null;
    }
}
