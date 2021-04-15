

function loadBackground(el:HTMLElement, id :BoardId) :void{ //////////TODO Use this, apply to html.main too!
  el.style.backgroundImage = "url('"+brdAttr(id,'background')+"')";
  el.style.backgroundRepeat = "no-repeat";
  el.style.backgroundSize = "cover";
}

function textareaAutoSize(el :HTMLElement) :void{
  el.style.height = '1px';
  el.style.height = (1+el.scrollHeight)+'px';
//  el.parentNode.style.height = el.style.height;
}
