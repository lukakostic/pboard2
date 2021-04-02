/********************************************
Logger allows you to log without polluting the browser console.log
It only shows you logs (ouptuts to console.log) when you ask it to.
It also allows you to:
~group logs
~color them (info, warning, error)
~indent them or prepend characters (to differentiate log groups)

this way you can log things relating to UI drawing, Storage,
or any other section of code you might want to log.
Then you can show just that part.

It should also allow to automatically log every function called..
*********************************************/
/*
const LOG_GROUP :{[index:string]:any} = { //groups, each has the log function for group (see below)
	Any: [' '], //Default info
	Other: ['&'],

	Boards: ['$'],
	Drawing: ['#'],
	Storage: ['_'],
};


//Main object/function:
function ___log(logGroup :any, ...args :any[]){ //long name easy to differentiate in code

}
//Log with Any group
let log =(...args :any[])=> LOG_GROUP.Any.log(...args);
//Log with Other group
let log_ =(...args :any[])=> LOG_GROUP.Other.log(...args);

//Add log function to every LOG_Group so i can call group.log instead of passing group all the time
for(let g in LOG_GROUP){
	LOG_GROUP[g].log = function(...args :any[]){
		___log(this as any,...args);
	}.bind(LOG_GROUP[g]);
}

//Entry factory
log.factory = function(...messages:any[]) :any {
	return {
		messages : messages,
	};
}
log.entries = [] as any[];

//Show logs
log.Show = function(){

}


//Shorter log functions:
//log into any
function ___log_(...args:any[]){

}
*/