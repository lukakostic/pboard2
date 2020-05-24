let currentVersion = 2

let updater = {
    copyNewProperties: function(from, to){
        let fields = Object.keys(from)
        for(let i = 0; i < fields.length; i++)
            if((fields[i] in to) == false)
                to[fields[i]] = from[fields[i]]
            
        return to
    },

    updateProject: function(proj){
        if(proj.version == currentVersion)
            return proj
        
        if(proj.version == 1){
            delete proj.preferences['manualSaveLoad']
            let pref = this.copyNewProperties(new Project().preferences,proj.preferences)
            proj.preferences = pref
            proj.version = 2
            return updateProject(proj)
        }
        return null
    }
}