let css = {
    styleElement: EbyId('style'),
    built_css: {},
    _css: {},
    css: function (cssRule, attribute, value) {
        if (cssRule === undefined)
            return this._css;
        cssRule = cssRule.replace(' ', '');
        if (attribute === undefined)
            return this._css[cssRule];
        if (value === undefined) {
            this.built_css._dirty_ = true;
            this.built_css[cssRule]._dirty_ = true;
            this._css[cssRule] = attribute;
        }
        else {
            attribute = attribute.replace(' ', '');
            value = value.replace(' ', '');
            this.built_css._dirty_ = true;
            this.built_css[cssRule]._dirty_ = true;
            this._css[cssRule][attribute] = value;
        }
    },
    build: function () {
        if (this.built_css['_dirty_'] == false)
            return this.built_css._built_;
    },
    fromCssString: function (cssStr) {
    },
    apply: function () {
    }
};
