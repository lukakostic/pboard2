
//UI calculations interval, singleInstance check
let autoUI :number = -1; /*interval id, -1 = unset*/ //set in htmlLoaded


//Called only once
function htmlLoaded() :void{
  //html.find(); //find static html elements

  if(autoUI == -1)
    autoUI = setInterval(autoUI_function,100);
  

  //newlist, used for adding lists in multi board
  /* //////////////////////////////////////TODO this should be handled by AlbumView
  EbyId('newlist').onsubmit = (event)=>{
    event.preventDefault();
    newList(event);
  };
  input.onkeypress = (event)=>{
    if(event.key === 'Enter'){
      event.preventDefault();
      alert(input.value);
    }
  };
  */

  EbyId('homeBtn').onclick = goHome;
  EbyId('upBtn').onclick = goUp;
  //EbyId('convertBtn').onclick = ConvertBoard;
  EbyId('saveBtn').onclick = ()=>{sync.saveAll(null,true)};
  EbyId('loadBtn').onclick = ()=>{sync.loadAll()};
  EbyId('saveDownloadBtn').onclick = ()=>{
    function saveBlobFile (name :string, type :string, data) {
      if (data !== null && navigator.msSaveBlob)
          return navigator.msSaveBlob(new Blob([data], { type: type }), name);
      let a = $("<a style='display: none;'/>");
      let url = window.URL.createObjectURL(new Blob([data], {type: type}));
      a.attr("href", url);
      a.attr("download", name);
      $("body").append(a);
      a[0].click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }

    let text = buildPBoard();
    let dateTag = (new Date()).toISOString().replace('T',' ').substring(2,16);
    let filename = "PBoard "+dateTag+".txt";
    saveBlobFile(filename,"data:attachment/text",text);
    
  };

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


////////////////////////////////////////////////// TODO move to View
function clearBoards(no,nope,nopp,never) :void{}
function clearLists(no,nope,nopp,never) :void{}
/*
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
*/


function draw() :void{
  log('draw()');

  if(pb.boards[board].type == BoardType.Board)
    setMainView(new AlbumView("",html.main));
  else if(pb.boards[board].type == BoardType.List) //////////TODO add PBoard?
    setMainView(new ListView("",html.main));
  
  mainView.render();

  return; ////////////////TODO Just while testing View
  
  ///////////////////////////////////////TODO change to view?
  //if(pb.boards[board].type == BoardType.Board) drawBoardAlbum();
  //else if(pb.boards[board].type == BoardType.List) drawListAlbum(); //////////TODO add PBoard?
  // board type text


  loadBoardBackgroundImage();
  makeDraggable(); /////////////TODO move to view

  ////////////////TODO wtf is this shit, needs change
  setTimeout(()=>{expandInputAll()},200);
  setTimeout(()=>{expandInputAll()},1000);
}

////////////////////// TODO move to view
function drawBoardAlbum(no,nope,nopp,never){}
function drawListAlbum(no,nope,nopp,never){}
/*
function drawBoardAlbum() :void{
  log('drawBoardAlbum()')
  html.listAlbum.classList.add('d-none')
  html.boardAlbum.classList.remove('d-none')
  
  clearLists();
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

  fixAlbumUI();
  fixNewListUI();
}

function drawListAlbum() :void{
  log('drawListAlbum()');
  html.boardAlbum.classList.add('d-none');
  html.listAlbum.classList.remove('d-none');

  clearBoards(html.mainList);

  html.boardTitle.value = pb.boards[board].name;
  html.boardDescription.value = brdAttr(board,'description');
  
  loadList(html.mainList,board);

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
/*
  fixListUI(html.mainList);
}
*/



function loadBackground(brdEl, id) :void{
  brdEl.style.backgroundImage = "url('"+brdAttr(id,'background')+"')";
  brdEl.style.repeatMode = "no-repeat";
  brdEl.style.backgroundSize = "cover";
}

function loadList(){}
 //////////////////////////////TODO replace by View
 /*
function loadList(listEl, brd) :void{
  log('loadList(',listEl,"'"+JSON.stringify(brd)+"'",')');

  if (typeof brd === 'string' || brd instanceof String)
    brd = pb.boards[(<string> brd)];

  let titleText = <HTMLInputElement>EbyName('list-title',listEl); ////////////??????

  //could cause issues with main board (probably not)?
  //can only be blur while as input, so turn to div
  //  titleText.outerHTML = titleText.outerHTML.replace('<input','<div').replace('</input>','</div>');
  //  titleText.onclick = ()=>{listTitleClicked(this)};
  //  titleText.onblur = null;


  titleText.addEventListener('click',listTitleClicked,true); //////////////???????
  titleText.onblur = (event)=>{ listTitleBlur(event) }; /////////////???????

//  $(titleText).val(brd.name);
  $(titleText).html(brd.name); //we assume its div at start
//  $(titleText).prop("readonly",true);
  set_dataId(listEl, brd.id);


  for(let i = 0; i < brd.content.length; i++){
    let brd2 = pb.boards[brd.content[i]];
    if(brd2.type == BoardType.Text){

      let el = html.textBrdTemplate.cloneNode(true);
      listEl.appendChild(el);
      loadTextBoard(el,brd2);
    
    }else if(brd2.type == BoardType.Board){

      let el = html.boardBrdTemplate.cloneNode(true)
      listEl.appendChild(el)
      loadBoardBoard(el,brd2)

    }
  }
  fixListUI(listEl);
}
*/

function loadBoardBackgroundImage() :void{ /////////////////////TODO replace by View?
  let brdEl = html.main;
  
  brdEl.style.backgroundImage = "url('"+brdAttr(board,'background')+"')";
  brdEl.style.backgroundRepeat = "no-repeat";
  brdEl.style.backgroundSize = "cover";
}

function loadAllBoardsByDataId(){}
 ///////////////////////////TODO replace by View
 /*
function loadAllBoardsByDataId(brdId) :void{
  let boardEls = EbyNameAll('tile');

  for(let i = 0; i < boardEls.length; i++){
    if(dataId(boardEls[i])==brdId){
      if(pb.boards[brdId].type == BoardType.Text)
        loadTextBoard(boardEls[i],brdId);
      else if(pb.boards[brdId].type == BoardType.Board)
        loadBoardBoard(boardEls[i],brdId);
    }
  }
}
*/