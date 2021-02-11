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
        log('updating ', saveFile)

        if(saveFile['pb'] != undefined && saveFile.pb['version'] == currentVersion)
            return saveFile
        
        if(saveFile['version'] == 1){
            delete saveFile.preferences['manualSaveLoad']
            let pref = this.copyNewProperties(new PBoard().preferences,saveFile.preferences)
            saveFile.preferences = pref
            saveFile.version = 2
            return this.updateSaveFile(saveFile)
        }
        //saveFile.version>=3
        if(saveFile['version'] == 2){
            let pref = this.copyNewProperties(new PBoard().preferences,saveFile.preferences)
            saveFile.preferences = pref
            saveFile.version = 3

            newSaveFile = {
                syncTime: 0,
                pb: saveFile,
            }
            
            return this.updateSaveFile(newSaveFile)
        }
        //if(saveFile.pb.version == 3){}
        return null
    }
}