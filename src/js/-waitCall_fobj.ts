function waitCall(f:Function){
	waitCall.list.push(f);
}

waitCall.list = [] as Function[];

waitCall.Invoke = ()=>{ //Call all
	waitCall.list.forEach(f=>f());
	waitCall.list = [];
}