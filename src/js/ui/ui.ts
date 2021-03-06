
//dragging
let drags :{
  dragOld: null | any;
  dragNew: null | any;
  dragItem: null | any;
  oldDragIndex: null | number;
  newDragIndex: null | number;
  dragStartTime: number; //used to click if drag < 0.01s (meant to click)
} = {
  dragOld: null, dragNew: null, dragItem: null, oldDragIndex: null, newDragIndex: null,
  dragStartTime: -999, //used to click if drag < 0.01s (meant to click)
};




//UI calculations interval, singleInstance check
let autoUI :number/*interval id*/ = -1; //set in htmlLoaded


//Called only once
function htmlLoaded() :void{
  if(autoUI == -1)
  autoUI = setInterval(()=>{
    //Fix this piece of shit mobile web dev crap
    document.body.style.setProperty("width","100vw");
  
    //Resize main board so it doesnt take whole screen width, rather just the middle 'document' area
    //Makes it easier to focus and see the boards than if they are spread thru whole width
    if(window.innerWidth>1250)
      html.listAlbum.style.width = '1250px';
    else
      html.listAlbum.style.width = '100%';
  
    //Make tab title same as board name
    if(pb != null){ //If loaded
      let brdName = pb.boards[board].name;
      if(brdName == "") brdName = "PBoard";
      else brdName += " - PBoard";
      document.title = brdName;
    }

    //singleInstanceCheck()////////////
  },100);
  
  html.find(); //find static html elements

  EbyId('homeBtn').onclick = goHome;
  EbyId('upBtn').onclick = goUp;
  //EbyId('convertBtn').onclick = ConvertBoard;
  EbyId('saveBtn').onclick = ()=>{sync.saveAll(null,true)};
  EbyId('loadBtn').onclick = ()=>{sync.loadAll()};

}

function pageOpened() :void{
  
  log("pageOpened()");

  extensions.invoke('pre_newPage');


  //clearBoards();
  //clearLists();
  draw();

  extensions.invoke('newPage');

  extensions.execute();
}



function clearBoards(lst = null) :void{
  log('clearBoards(',lst,')');

  let lists :Array<Element>|NodeListOf<Element>
   = [lst]; //Just one passed in,
  if(lst == null) lists = qSelAll('.list:not([id])'); //or all lists
  
  logw('lists', lists);
  
  for(let j = 0; j < lists.length; j++){

    let boards = qSelAll('.board:not([id])',lists[j]);//lists[j].childNodes
    for (let i = boards.length-1; i > -1; i--)
      $(boards[i]).remove();

  }
}

function clearLists() :void{
  
  log('clearLists()');
  let lists = EbyClass('list');
    
  for(let j = lists.length-1; j > -1; j--)
    if (lists[j].id == "")
      $(lists[j]).remove();
  
}



function draw() :void{
  
  log('draw()')
  if(pb.boards[board].type == BoardType.Board) drawBoardAlbum()
  else if(pb.boards[board].type == BoardType.List) drawListAlbum()
  // board type text

  loadBoardBackgroundImage()
  makeDraggable()

  setTimeout(()=>{expandInputAll()},200)
  setTimeout(()=>{expandInputAll()},1000)
}


function drawBoardAlbum() :void{
  
  log('drawBoardAlbum()')
  html.listAlbum.classList.add('d-none')
  html.boardAlbum.classList.remove('d-none')
  
  clearLists()
  //clearBoards()

  html.boardTitle.value = pb.boards[board].name
  html.boardDescription.value = brdAttr(board,'description')


  //fill lists & boards
  for(let l = 0; l < pb.boards[board].content.length; l++){

    let listEl = html.listTemplate.cloneNode(true)
    html.boardAlbum.appendChild(listEl)

    
    loadList(listEl,pb.boards[board].content[l])

  }

  
  $(html.boardTitle).select() //autopop

  fixAlbumUI()
  fixNewListUI()
}

function drawListAlbum() :void{
  
  log('drawListAlbum()')
  html.boardAlbum.classList.add('d-none')
  html.listAlbum.classList.remove('d-none')

  clearBoards(html.mainList)

  html.boardTitle.value = pb.boards[board].name
  html.boardDescription.value = brdAttr(board,'description')
  
  loadList(html.mainList,board)

  

  /*
  let ids = Object.keys(pb.boards);
  //fill boards
  for(let i = 0; i < ids.length; i++){
    if(pb.boards[ids[i]].attributes['onMain'] == true){
      if(pb.boards[ids[i]].type == BoardType.Text){

        let el = html.textBrdTemplate.cloneNode(true);
        html.mainList.appendChild(el);
        loadTextBoard(el,pb.boards[ids[i]]);
      
      }else if(pb.boards[ids[i]].type == BoardType.Board){

        let el = html.boardBrdTemplate.cloneNode(true);
        html.mainList.appendChild(el);
        loadBoardBoard(el,pb.boards[ids[i]]);

      }
      
    }
  }
  */
  fixListUI(html.mainList);
}
  



function loadTextBoard(textBoardEl, brd) :void{
  
  log('loadTextBoard(',textBoardEl,"'"+JSON.stringify(brd)+"'",')');

  if (typeof brd === 'string' || brd instanceof String)
  brd = pb.boards[(<string> brd)];

  set_dataId(textBoardEl, brd.id)

  $(EbyClass('textBtn',textBoardEl)[0]).contents()[1].nodeValue = brd.name
  
  if(brd.content.length>0) 
    EbyClass('descriptionIcon', textBoardEl)[0].classList.remove('d-none')
  else 
    EbyClass('descriptionIcon', textBoardEl)[0].classList.add('d-none')

  loadBackground(textBoardEl,brd.id)
}

function loadBackground(brdEl, id) :void{
  brdEl.style.backgroundImage = "url('"+brdAttr(id,'background')+"')";
  brdEl.style.repeatMode = "no-repeat";
  brdEl.style.backgroundSize = "cover";
}

function loadBoardBoard(boardBoardEl, brd) :void{
  
  log('loadBoardBoard(',boardBoardEl,"'"+JSON.stringify(brd)+"'",')')

  if (typeof brd === 'string' || brd instanceof String)
    brd = pb.boards[(<string> brd)]

  set_dataId(boardBoardEl, brd.id)
  $(EbyClass('textBtn',boardBoardEl)[0]).contents()[0].nodeValue = brd.name

  loadBackground(boardBoardEl, brd.id)
}

function loadList(listEl, brd) :void{
  
  log('loadList(',listEl,"'"+JSON.stringify(brd)+"'",')')

  if (typeof brd === 'string' || brd instanceof String)
    brd = pb.boards[(<string> brd)]

  let titleText = <HTMLInputElement>(EbyClass('title-text',listEl)[0]); ////////////??????

  //could cause issues with main board (probably not)?
  //can only be blur while as input, so turn to div
  //  titleText.outerHTML = titleText.outerHTML.replace('<input','<div').replace('</input>','</div>');
  //  titleText.onclick = ()=>{listTitleClicked(this)};
  //  titleText.onblur = null;


  titleText.addEventListener('click',listTitleClicked,true) //////////////???????
  titleText.onblur = (event)=>{ listTitleBlur(event) } /////////////???????

//  $(titleText).val(brd.name);
  $(titleText).html(brd.name) //we assume its div at start
//  $(titleText).prop("readonly",true);
  set_dataId(listEl, brd.id)

  
  
  for(let i = 0; i < brd.content.length; i++){
    let brd2 = pb.boards[brd.content[i]]
    if(brd2.type == BoardType.Text){

      let el = html.textBrdTemplate.cloneNode(true)
      listEl.appendChild(el)
      loadTextBoard(el,brd2)
    
    }else if(brd2.type == BoardType.Board){

      let el = html.boardBrdTemplate.cloneNode(true)
      listEl.appendChild(el)
      loadBoardBoard(el,brd2)

    }
  }
  fixListUI(listEl)

}


function loadBoardBackgroundImage() :void{
  let brdEl = EbyId('main');
  
  brdEl.style.backgroundImage = "url('"+brdAttr(board,'background')+"')";
  brdEl.style.backgroundRepeat = "no-repeat";
  brdEl.style.backgroundSize = "cover";
}

function loadAllBoardsByDataId(brdId) :void{
  let boardEls = EbyClass('board');

  for(let i = 0; i < boardEls.length; i++){
    if(dataId(boardEls[i])==brdId){
      if(pb.boards[brdId].type == BoardType.Text)
        loadTextBoard(boardEls[i],brdId);
      else if(pb.boards[brdId].type == BoardType.Board)
        loadBoardBoard(boardEls[i],brdId);
    }
  }

}