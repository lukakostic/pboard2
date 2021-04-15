const DBG = { //debug colors
	a: {s:'_', c:"background: #222; color: #bada55;"},
	b: {s:'#', c:"background: #208a27; color: #ffffff;"},
}

const dbg = function(){
	return Function.prototype.bind.call(console.debug, console, ...DBG_COL(DBG.a));
}();
const dbg2 = function(){
	return Function.prototype.bind.call(console.debug, console, ...DBG_COL(DBG.b));
}();
const dbgw = function(){
	return Function.prototype.bind.call(console.warn, console, ...DBG_COL(DBG.a));
}();
const s_dbg = function(){
	return Function.prototype.bind.call(console.groupCollapsed, console);
}();
const e_dbg = function(){
	return Function.prototype.bind.call(console.groupEnd, console);
}();
function DBG_COL(col:any){
	return ['%c'+col.s,col.c];
}
function DBG_COL_FN(defCol:any,args:IArguments):any[]{
	let color = defCol;
	let newArg = [...args];
	console.log("COL:");
	console.log(newArg);
	for(let i = 0; i < newArg.length; i++){ //Find color
		let leave = false;
		for(let c in DBG)
			if(newArg[i](DBG as any)[c] ){
				color = (DBG as any)[c];
				newArg = newArg.splice(i,1);
				leave = true;
				break;
			}
		if(leave) break;
	}
	return [...DBG_COL(color), ...newArg ];
}

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