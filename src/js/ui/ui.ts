
//UI calculations interval, singleInstance check
let autoUI :number = -1; /*interval id, -1 = unset*/ //set in htmlLoaded

//#region Dialogs ////////~~~~~~~~~~~~~~~~~~~~~~~~~//////// {
let dialogBoardID :string|null = null; //Id of currently open board in some dialog
let dialogBoardView :View = null;
let dialogs = {}; //Dialog objects add themselves here as properties

function openDialog(boardId :string, boardView :View, dialog :string) :void{
  closeDialog(); //close and reset all first
  html.dialogBack.classList.toggle('hidden', false);
  dialogBoardID = boardId;
  dialogBoardView = boardView;
  dialogs[dialog].open();
}
//close all
function closeDialog(backClicked = false, all = true) :void{
  if(all)
  for(let k in dialogs)
    dialogs[k].close(backClicked?null:false);
  html.dialogBack.classList.toggle('hidden', true);
  dialogBoardID = null;
  dialogBoardView = null;
}
//#endregion Dialogs//////~~~~~~~~~~~~~~~~~~~~~~~~~////// }

//Called only once
function htmlLoaded() :void{
  //html.find(); //find static html elements

  if(autoUI == -1)
    autoUI = setInterval(autoUI_function,100);
  

  html.headerTitle.oninput = headerTitle_oninput;
  html.headerDescription.oninput = headerDescription_oninput;
  EbyId('headerExpand').onclick = headerExpand_onclick; 

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

  html.dialogBack.addEventListener('click',function(event){
    if(event.target == this) //if no bubbling
      closeDialog(true); //backClicked =true
  },false);
}


function pageOpened() :void{
  log("pageOpened()");

  extensions.invoke('pre_newPage');

  //clearBoards();
  //clearLists();
  
  html.main.innerHTML = ""; /////// Clear all
  setMainView(generateView(board,html.main));
  mainView.render();

  extensions.invoke('newPage');

  extensions.execute();
}

//Called when a new board is added, deleted, or changed
//usually you pass parentId and boardId
/* save: 0 = dont save, 1 = saveAll, 2 = save.dirty=true */
function boardsUpdated(boards :Array<string>,save: 0|1|2 = 1){
  pageOpened();
  //save == 0 = dont save
  if(save==1)
    sync.saveAll(); // save now
  else if(save == 2)
    sync.save.dirty = true; //auto save
}


/*
function draw() :void{
  log('draw()');

  setMainView(generateView("",html.main));
  
  pageOpened();

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