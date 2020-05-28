let currentVersion = 3

let updater = {
    copyNewProperties: function(from, to){
        let fields = Object.keys(from)
        for(let i = 0; i < fields.length; i++)
            if((fields[i] in to) == false)
                to[fields[i]] = from[fields[i]]
            
        return to
    },

    updateSaveFile: function(saveFile){
        if(saveFile['version'] == currentVersion)
            return saveFile
        
        if(saveFile['version'] == 1){
            delete saveFile.preferences['manualSaveLoad']
            let pref = this.copyNewProperties(new Project().preferences,saveFile.preferences)
            saveFile.preferences = pref
            saveFile.version = 2
            return this.updateSaveFile(saveFile)
        }
        //saveFile.version>=3
        if(saveFile['version'] == 2){
            let pref = this.copyNewProperties(new Project().preferences,saveFile.preferences)
            saveFile.preferences = pref
            saveFile.version = 3

            newSaveFile = {
                syncTime: 0,
                project: saveFile,
            }
            
            return this.updateSaveFile(newSaveFile)
        }
        //if(saveFile.project.version == 3){}
        return null
    }
}