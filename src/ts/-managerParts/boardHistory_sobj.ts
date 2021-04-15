const boardHistory = {
  history: [] as string[],

  //get last
  last() :string{
	return (this.history.length == 0)?
	null: this.history[this.history.length-1];
  },
  //add board to history, skip if already last
  add(boardId :BoardId) :void{
	  
	dbg('bh add ("'+boardId+'")',this.history);
    if(boardId !== this.last())
      this.history.push(boardId);
  },
  //pop previous in history (pops current)
  prev() :void{
	  dbg('bh prev',this.history);
	 this.history.pop(); //pop current
	 set_board(
		 (this.history.length>0)?this.history.pop() //pop and get before current
		 :"");
  }
}