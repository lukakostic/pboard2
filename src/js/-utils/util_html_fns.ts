//////////////////////////////////////////////Finders:

/////html id selectors
function EbyId(id :string) :HTMLElement|null{
	return document.getElementById(id);
}
function templateFChild(id :string) :HTMLElement|null{
	let el = EbyId(id);
	if((<HTMLTemplateElement>el)["content"] != undefined) //is template
		 return (<HTMLTemplateElement> el).content.firstElementChild as HTMLElement;
	return null;
}

/////data-name selectors
function EbyName(name :string, element :HTMLElement) :HTMLElement|HTMLInputElement|null{
	return element.querySelector('[data-name="'+name+'"]');
}
function EbyNameAll(name :string, element :HTMLElement|Document = document){
	return element.querySelectorAll('[data-name="'+name+'"]');
}


//Get/Set Board id (data-id) from html element
/*
function dataId(el) :string{
	return el.getAttribute('data-id');
}
function set_dataId(el, id :string) :void{
	el.setAttribute('data-id',id);
}


function atr(el :HTMLElement,atr :string,atrVal :string|undefined = undefined) :void|string{
	if(atrVal === undefined)
		 return el.setAttribute(atr,atrVal);
	else
		 return el.getAttribute(atr);
}
function atr_dataId(el,id :string|null = null) :string{
	return atr(el,'data-id',id);
}
*/

/* (el, 'touchstart mousedown', fn, bubble)*/
/*
function listenEvents(element :HTMLElement, eventNames :string, fn :Function, bubble :boolean = true){
	eventNames.split(' ').forEach(
		 e=>element.addEventListener(e,<any>fn,bubble)
	);
}
*/

/*
function elementIndex(node :Element) :number{
	let index = 0;
	while(node = node.previousElementSibling)
		 index++;
	return index;
}

function findWithAttr(array :any[], attr:string, value:any) {
	for(let i = 0; i < array.length; i += 1)
		 if(array[i][attr] === value)
			  return i;
	return -1;
}
*/
