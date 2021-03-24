const boardHistory = {
  history: <Array<string>> [],

  //get last
  last() :string{
    return this.history.slice(-1)[0];
  },
  //add board to history, skip if already last
  add(boardIdOrUrl :string) :void{
    let bId = boardFromUrl(boardIdOrUrl);
    if(bId != this.last())
      this.history.push(bId);
  },
  //pop previous in history (pops current)
  prev() :string|null{
    this.history.pop(); //pop current
    if(this.history.length<=0) return "";
    return this.history.pop(); //pop before current
  }
}