const dbg = function(){
	for(let i = 0; i < arguments.length; i++)
		 if(arguments[i] instanceof Error)
			  alert(arguments[i]);
	let color = "background: #222; color: #bada55";
	return Function.prototype.bind.call(console.debug, console,'%c $ ', color);
	//let context = "My Descriptive Logger Prefix:";
	//return Function.prototype.bind.call(console.log, console, context);
}();
const s_dbg = function(){
	for(let i = 0; i < arguments.length; i++)
		 if(arguments[i] instanceof Error)
			  alert(arguments[i]);

	return Function.prototype.bind.call(console.groupCollapsed, console);
	//let context = "My Descriptive Logger Prefix:";
	//return Function.prototype.bind.call(console.log, console, context);
}();
const e_dbg = function(){
	for(let i = 0; i < arguments.length; i++)
		 if(arguments[i] instanceof Error)
			  alert(arguments[i]);
	return Function.prototype.bind.call(console.groupEnd, console);
	//let context = "My Descriptive Logger Prefix:";
	//return Function.prototype.bind.call(console.log, console, context);
}();

/*
//Debug logs, only used for debug and not actual messages.
let LOG_DISABLED = false;
let LOGW_DISABLED = false;
let LOGE_DISABLED = false;

//console log
const log = function(){
    if(LOG_DISABLED) return function(){};
    for(let i = 0; i < arguments.length; i++)
        if(arguments[i] instanceof Error)
            alert(arguments[i]);

    return Function.prototype.bind.call(console.log, console);
    //let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//log traced
const logt = function(){
    if(LOG_DISABLED) return function(){};
    for(let i = 0; i < arguments.length; i++)
        if(arguments[i] instanceof Error)
            alert(arguments[i]);
    return Function.prototype.bind.call(console.trace, console);
    //let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//console log warning
const logw = function(){
    if(LOGW_DISABLED)return function(){}
    return Function.prototype.bind.call(console.warn, console);
    //let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//console log error
const loge = function(){
    if(LOGE_DISABLED)return function(){}
    return Function.prototype.bind.call(console.error, console);
    //let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//alert log
const alog = function(){
    //if(LOG_DISABLED)return function(){}
    return Function.prototype.bind.call(console.log, console);
    //let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
//modal log
const mlog = function(){
    //if(LOG_DISABLED)return function(){}
    return Function.prototype.bind.call(console.log, console);
    //let context = "My Descriptive Logger Prefix:";
    //return Function.prototype.bind.call(console.log, console, context);
}();
*/