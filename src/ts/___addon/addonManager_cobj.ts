let ADDONS_DISABLED = false;

let addonManager :_AddonManager_ = null;
class _AddonManager_ {
	addons :{[index:string]:Function};
	events:{[index:string]: {[index:string]:Function} };
	
	static init():void{ if(addonManager==null) addonManager = new _AddonManager_(); }

	constructor(){
		this.addons = {};
		//arrays of callbacks that get called when event invoked
	  this.events = { ///////////TODO change from holding Array<Function> to holding Array<{string:Function}>? So you can subscribe and unsubscribe too!
		  draw:{},
	  }
	}

  subcribe(event :string,fn:Function) :string{
		if(event in this.events == false) return;
	   
		let id = randomStr(5);
		while(id in this.events)
			id = randomStr(5);
		this.events[event][id] = fn;
		return id;
  }

  invoke(event :string) :void{
    if(ADDONS_DISABLED) return;
	 if(event in this.events == false) return;

    dbg('Invoking event:',event);

	 for(let sub in this.events[event])
	 	this.events[event][sub]();
  }

  loaded() :void{
    if(ADDONS_DISABLED) return;

    dbg('addons.reset()');
	 
	 for(let e in this.events) //Reset all events
	 	this.events[e] = {};

	//Load addons
	this.buildAddons();
	for(let ext in pb.addons)
		if(pb.addons[ext].on)
				this.addons[ext]();
  }

  buildAddons() :void{
	  this.addons = {};
	  
		for(let ext in pb.addons)
			this.addons[ext] = 
			new Function('x', 'y', pb.addons[ext].code);
  }


}