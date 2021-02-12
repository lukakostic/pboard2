let sync = {
    fileName: 'pboard.pb',
    fileId: null,
    lastSyncTime: null,
    syncedOnline: false,
    syncSkips: 0,
    syncSkipsTimes: 5,
    save: {
        dirty: false,
        interval: null,
    },
    load: {
        interval: null,
    },
    setSyncTime: function () {
        this.lastSyncTime = (new Date()).getTime();
    },
    flashLoadingIndicator: () => {
        ui.startLoadingIndicator();
        setTimeout(() => {
            ui.stopLoadingIndicator();
        }, 2000);
    },
    loadCachedContent: function () {
        let contents = window.localStorage.getItem('cached');
        if (contents == null || contents == undefined)
            return false;
        if (loadPBoard(contents))
            logw('loading from cache');
        else
            logw('not loading from cache');
        extensions.invoke('loadCached');
        return true;
    },
    saveCachedContent: (contents) => {
        window.localStorage.setItem('cached', contents);
    },
    saveAll: function (callback = null, really = false) {
        if (really == false)
            return;
        try {
            extensions.invoke('pre_saveAll');
            sync.setSyncTime();
            let contents = buildPBoard();
            log('saveAll ', contents);
            if (sync.syncedOnline == false)
                return console.warn('Wont save: Not once synced with online. Wait or refresh.');
            ui.startSavingIndicator();
            sync.saveCachedContent(contents);
            storage.fileUpload({ name: sync.fileName, body: contents }, () => {
                if (callback != null)
                    callback();
                ui.stopSavingIndicator();
                extensions.invoke('saveAll');
                sync.save.dirty = false;
            });
        }
        catch (e) {
            alog(e);
        }
    },
    loadAll: function (callback = null) {
        try {
            extensions.invoke('pre_loadAll');
            storage.fileDownload(sync.fileName, (contents) => {
                sync.syncedOnline = true;
                if (contents != null && contents != '') {
                    log('loading contents ', contents);
                    loadPBoard(contents);
                    extensions.invoke('loadAll');
                }
                else {
                    logw('loaded null, resetting');
                    resetData();
                }
                if (callback)
                    callback(contents);
            });
        }
        catch (e) {
            alog(e);
        }
    },
    start: function (doAutoLoadSave = true) {
        if (doAutoLoadSave == false || pb.preferences['autoLoadInterval'].toString() == "0")
            return;
        this.save.interval = setInterval(() => {
            if (sync.save.dirty == false)
                return;
            sync.save.dirty = false;
            log('sync save');
            sync.saveAll();
        }, pb.preferences['autoSaveInterval'] * 1000);
        this.load.interval = setInterval(() => {
            if (document.hasFocus()) {
                sync.syncSkips = sync.syncSkips - 1;
            }
            else
                sync.syncSkips = 0;
            if (sync.syncSkips <= 0) {
                sync.syncSkips = sync.syncSkipsTimes;
                sync.loadAll();
            }
        }, pb.preferences['autoLoadInterval'] * 1000);
    },
};
