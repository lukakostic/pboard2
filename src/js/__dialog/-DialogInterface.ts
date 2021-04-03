interface DialogInterface {
	//constructor(back:HTMLElement)
	dialog: HTMLElement;
	back: HTMLElement;

	focus : Function;
	close : Function;
	
	backClicked :Function;
}