let boardHistory :any = [] //board IDs

//get last
boardHistory.last = function(){
  return this.slice(-1)[0]
}
//add board to history, skip if already last
boardHistory.add = function(boardIdOrUrl){
  let bId = boardFromUrl(boardIdOrUrl)
  if(bId != this.last())
    this.push(bId)
}
//pop previous in history (pops current)
boardHistory.prev = function(){
  this.pop() //pop current
  return this.pop() //pop before current
}