let extensions = {
    listeners: {
        newPage: [],
        pre_newPage: [],
        saveAll: [],
        pre_saveAll: [],
        loadAll: [],
        pre_loadAll: [],
        draw: [],
        buildPBoard: [],
        loadPBoard: [],
        loadCached: [],
    },
    invoke: function (listener = "") {
        log('Invoking listener:', listener);
        for (let i = 0; i < this.listeners[listener].length; i++)
            if (this.listeners[listener])
                this.listeners[listener][i]();
        this.listeners[listener] = [];
    },
    execute: function () {
        log('extensions.execute()');
        let exts = brdAttrOrDef(board, 'extensions', []);
        for (let i = 0; i < exts.length; i++) {
            if (exts[i].on) {
                log('executing extension ' + exts[i].id);
                eval(pb.extensions[exts[i].id].code);
            }
        }
    }
};
