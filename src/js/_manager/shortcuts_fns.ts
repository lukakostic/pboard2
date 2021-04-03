function shortcuts_onkeydown(event :KeyboardEvent) :void{
	let ctrl = event.ctrlKey;
	let shift = event.shiftKey;
	let esc = (event.keyCode === 27 || event.key.startsWith("Esc"));
	
	let inDialog = (dialogManager.dialogBack.classList.contains('hidden')==false);
	let inInput = false;
	switch((<Element>event.target).tagName){
		case 'TEXTAREA':
		case 'INPUT':
			inInput = true;
	}
	
	if(event.key !== 'Tab') //so we dont mess with tabbing
		shortcuts_handleKey(event.key, inDialog,inInput, shift,ctrl,esc);
}


function shortcuts_handleKey(
	key:string,
	inDialog:boolean, inInput:boolean,
	shift:boolean, ctrl:boolean, esc:boolean
) :void{
	let keyL = key.toLowerCase();
	/*
	let jumpList = (indx :number)=>{
		let dots = mainView.htmlEl.querySelectorAll('[data-name="list-header"]>.dot');
		if(indx<0)indx=0;
		if(indx>=dots.length)indx=dots.length-1;
		navigation.focus(<HTMLElement> dots[indx]);
	};
	*/

	if(esc){
		if(inDialog)
			dialogManager.closeDialog(!shift,true); //if shift held, dont save
		else{
			if(shift)
				header.homeBtn.click();
			else
				header.upBtn.click();
		}
	}

	if(inInput || inDialog)return; //Only process if looking at boards
	event.preventDefault(); //if we focus on input field
	switch(keyL){ //Lowercase key, use key for non lowercase
		case 'h': //print shortcuts
			if(shift)
				shortcuts_printHelp();
			break;
		case '`': //focus default
			if(ctrl)
				navigation.focusDefault();
			break;
		case '~': // ` + shift  //focus first List or tile
			if(shift)
				navigation.focusView(mainView.elements[0]);
			break;
		case 'q': //click/open
			if(document.activeElement.classList.contains('dot'))
				document.activeElement.dispatchEvent(new CustomEvent('openEvent'));
			else
				(<HTMLElement>document.activeElement).click();
			break;
		case 'a': //Shift focus to list left
			if(!shift)break;
			if(mainView.type & ViewType.AlbumView)
				navigation.shiftFocusToView(-1,0,true);
			else
				navigation.shiftFocusToView(0,-1);
			break;
		case 'd': //Shift focus to list right
			if(!shift)break;
			if(mainView.type & ViewType.AlbumView)
				navigation.shiftFocusToView(1,0,true);
			else
				navigation.shiftFocusToView(0,1);
			break;
		case 'l': //Move right (L) or left (K)
		case 'k':
			if(navigation.selectedView && navigation.selectedView.parent){
				let newPos:number = navigation.selectedView.index + ((shift?5:1)*((keyL == 'k')?1:-1));
				moveBoardTo(navigation.selectedView.index,newPos,navigation.selectedView.parent.id);
				navigation.focusDefault();
				//jumpList(newPos);
			}
			break;
	}
	
}

function shortcuts_printHelp(){
	alert(
`H+shift - help
\`+ctrl - focus default
\`+shift - focus first list or tile
q - open / click (on non openable)
a+shift - shift focus to list left
d+shift - shift focus to list right
l - move right (+shift moves more)
k - move left (+shift moves more)
`);
}