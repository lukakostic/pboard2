const css = {
  styleElement: EbyId('style'),

 
  //0 arguments: return _css
  //1 argument: return _css[cssRule]
  //2 arguments: set _css[cssRule] = attribute
  //3 arguments: set _css[cssRule][attribute] = value
  /*
  css: function(cssRule,attribute,value){
    if(cssRule === undefined) return this._css
    cssRule = cssRule.replace(' ','') //remove spaces
    if(attribute === undefined) return this._css[cssRule]
    if(value === undefined){
      this.built_css._dirty_ = true
      this.built_css[cssRule]._dirty_ = true
      this._css[cssRule] = attribute //attribute is object
    }else{
      attribute = attribute.replace(' ','')
      value = value.replace(' ','')
      this.built_css._dirty_ = true
      this.built_css[cssRule]._dirty_ = true
      this._css[cssRule][attribute] = value //attribute is string
    }
  },
  */
}