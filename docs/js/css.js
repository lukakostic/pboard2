//

let css = {
  styleElement: EbyId('style'),

  built_css: {}, //holds the built strings of this.css object. Has all properties of this.css
  /*
  {
    _dirty_: false, //is the built content correct? changed when any element changed, until built
    _built_: '.red:{width:200px;height:100px;}\n',

    '.red':{
      _dirty_: false, //is the built content correct? changed when any attribute changed, until built
      _built_: '.red:{width:200px;height:100px;}',
    }
  }
  */

  _css: {},
  //{ match:{ attribute:value } }
  /*
  {
    '.red':{
      'width':'200px',
      'height':'100px',
    }
  }
  */

  //0 arguments: return _css
  //1 argument: return _css[cssRule]
  //2 arguments: set _css[cssRule] = attribute
  //3 arguments: set _css[cssRule][attribute] = value
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

  build: function(){
    //if no css has been modified
    if(this.built_css['_dirty_'] == false) return this.built_css._built_

  },

  //Populate css block by parsing css
  fromCssString: function(cssStr){
    
    //Not implemented.
  },

  //apply values from this.css
  apply: function(){

  }
}