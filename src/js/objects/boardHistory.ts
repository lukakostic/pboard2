
/*Array<string> but has custom methods*/
// @ts-ignore - assigning [] to our weird type causes error. How to assign empty array to our type?
let boardHistory :Array<string> & {
  last: Function;
  add: Function;
  prev: Function;
} = []; //board IDs

//get last
boardHistory.last = function() :string{
  return this.slice(-1)[0];
}
//add board to history, skip if already last
boardHistory.add = function(boardIdOrUrl :string) :void{
  let bId = boardFromUrl(boardIdOrUrl);
  if(bId != this.last())
    this.push(bId);
}
//pop previous in history (pops current)
boardHistory.prev = function() :string|null{
  this.pop(); //pop current
  return this.pop(); //pop before current
}