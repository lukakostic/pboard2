let ui = {

  //dragging
  dragOld: null, dragNew: null, dragItem: null, oldDragIndex: null, newDragIndex: null,

  //UI calculations interval, singleInstance check
  autoUI: null, //set in htmlLoaded


  htmlLoaded: function(){
    this.autoUI = setInterval(()=>{
      //Fix this piece of shit mobile web dev crap
      document.body.style.setProperty("width","100vw")
    
      //Resize main board so it doesnt take whole screen width, rather just the middle 'document' area
      //Makes it easier to focus and see the boards than if they are spread thru whole width
      if(window.innerWidth>1250)
        static.listAlbum.style.width = '1250px'
      else
        static.listAlbum.style.width = '100%'
    
      //Make tab title same as board name
      if(project != null){ //If loaded
        let brdName = project.boards[board].name
        if(brdName == "") brdName = "PBoard"
        else brdName += " - PBoard"
        document.title = brdName
      }

      singleInstanceCheck()
    },100)
    
    static.find()

    EbyId('homeBtn').onclick = goHome
    EbyId('upBtn').onclick = goUp
    //EbyId('convertBtn').onclick = ConvertBoard;
    //EbyId('saveBtn').onclick = SaveAll;
    //EbyId('loadBtn').onclick = LoadAll;

  },

  pageOpened: function(){
    log("pageOpened()")

    extensions.invoke('pre_newPage')

    
    if(board == ""){
      static.header.style.display = 'none'
      static.headerMain.style.display = 'block'
    }else{
      static.header.style.display = 'block'
      static.headerMain.style.display = 'none'
    }

    //clearBoards()
    //clearLists()
    this.draw()

    extensions.invoke('newPage')

    extensions.execute()
  },


  loadBoardBackgroundImage: function(){
    let brdEl = EbyId('main')
    
    brdEl.style.backgroundImage = "url('"+brdAttr(board,'background')+"')"
    brdEl.style.repeatMode = "no-repeat"
    brdEl.style.backgroundSize = "cover"
  },



  startSavingIndicator: function(){
    static.savingIndicator.style.display = 'block'
  },
  stopSavingIndicator: function(){
    static.savingIndicator.style.display = 'none'
  },

  startLoadingIndicator: function(){
    static.loadingIndicator.style.display = 'block'
  },
  stopLoadingIndicator: function(){
    static.loadingIndicator.style.display = 'none'
  },

  expandInputAll: function(){
    let expandoInputs = EbyClass('expandInput')
    for (let i = 0; i < expandoInputs.length; i++)
      this.expandInput(expandoInputs[i])
  },

  expandInput: function(el){
    el.style.height = '1px'
    el.style.height = (1+el.scrollHeight)+'px'
    el.parentNode.style.height = el.style.height
  },

  clearLists: function(){
    log('clearLists()')
    let lists = EbyClass('list')
      
    for(let j = lists.length-1; j > -1; j--)
      if (lists[j].id == "")
        $(lists[j]).remove()
    
  },

  makeDraggable: function(){

    //make boards draggable
    let draggableLists = $('.draggableList')
    if(draggableLists.length !== 0)
    draggableLists.sortable({
      items: '.draggable',
      start: (event, drag)=>{
        log('drag start')
          ui.dragItem = drag.item
          ui.oldDragIndex = elementIndex(ui.dragItem[0])
          ui.dragNew = ui.dragOld = drag.item.parent()
      },
      stop: (event, drag)=>{
        log('drag stop')
        //With a delay so that dragging a board doesnt click its button at end
        setTimeout(()=>{
          //actually move the board
          ui.newDragIndex = elementIndex(ui.dragItem[0])

          
          project.boards[dataId(ui.dragOld[0])].content.splice(ui.oldDragIndex-1,1)
          project.boards[dataId(ui.dragNew[0])].content.splice(ui.newDragIndex-1,0,dataId(ui.dragItem[0]))
          
          ui.dragItem = null
          sync.saveAll()

        },50)
      },
      change: (event, drag)=>{  
        log('drag change')
          if(drag.sender) ui.dragNew = drag.placeholder.parent()
          ui.fixListUI(ui.dragNew[0])
      },
      connectWith: ".draggableList"
  }).disableSelection()



    //make lists draggable
    let draggableAlbums = $('.draggableAlbum')
    if(draggableAlbums.length !== 0)
    draggableAlbums.sortable({
      items: '.draggableList',
      start: (event, drag)=>{
        log('drag list start')
          ui.dragItem = drag.item
          ui.oldDragIndex = elementIndex(ui.dragItem[0])
      },
      stop: (event, drag)=>{
        log('drag list stop')
        //With a delay so that dragging a board doesnt click its button at end
        setTimeout(()=>{
          //actually move the board
          ui.newDragIndex = elementIndex(ui.dragItem[0])

          
          project.boards[board].content.splice(ui.oldDragIndex,1)
          project.boards[board].content.splice(ui.newDragIndex,0,dataId(ui.dragItem[0]))
          
          ui.dragItem = null
          sync.saveAll()

        },50)
      },
      change: (event, ui)=>{
        log('drag list change')
        //if(ui.sender) dragNew = ui.placeholder.parent();
          
        //fixNewListUI();
      }
  }).disableSelection()

  /*
  $(".textBtn").each(function() {

    this.addEventListener("mousedown", function(t) {
      $(this.parentNode).trigger("mousedown",t);
      $(this.parentNode).trigger("onmousedown",t);
    },true);
    this.addEventListener("mouseup", function(t) {
      $(this.parentNode).trigger("mouseup",t);
      $(this.parentNode).trigger("onmouseup",t);
    },true);
    
    this.addEventListener("onmousedown", function(t) {
      $(this.parentNode).trigger("mousedown",t);
      $(this.parentNode).trigger("onmousedown",t);
    },true);
    this.addEventListener("onmouseup", function(t) {
      $(this.parentNode).trigger("mouseup",t);
      $(this.parentNode).trigger("onmouseup",t);
    },true);

  });
  */
  },

  draw: function(){
    log('draw()')
    if(project.boards[board].type == Board.Types.Board) this.drawBoardAlbum()
    else if(project.boards[board].type == Board.Types.List) this.drawListAlbum()
    // board type text

    this.loadBoardBackgroundImage()
    this.makeDraggable()

    setTimeout(()=>{ui.expandInputAll()},200)
    setTimeout(()=>{ui.expandInputAll()},1000)
  },
    
  clearBoards: function(lst = null) {
    log('clearBoards(',lst,')')

    let lists = [lst]
    if(lst == null) lists = qSelAll('.list:not([id])')

    logw('lists', lists)
    
    for(let j = 0; j < lists.length; j++){

      let boards = qSelAll('.board:not([id])',lists[j])//lists[j].childNodes
      for (let i = boards.length-1; i > -1; i--)
        $(boards[i]).remove()

    }
  },

  fixListUI: function(listEl=null){
    if(listEl!=null){
      let newPanel = EbyClass('newPanel',listEl)[0]
      newPanel.parentNode.appendChild(newPanel)
    }else{
      let album = fixAlbumUI()
      let lists = EbyClass('list', album)[0]
      for(let i = 0; i<lists.length; i++)
        if(lists[i].id=="") this.fixListUI(lists[i])
      
    }
  },

  //move newlist to bottom again
  fixNewListUI: function(){
    let newlist = EbyId('newlist')
    newlist.parentNode.appendChild(newlist)
  },

  fixAlbumUI: function(){
    let album = EbyId('boardAlbum')
    let columnWidth = 310 //px //300 + 5*2 margin
    if(album){
      album.style.setProperty('width',((columnWidth*album.childElementCount)+10 + 8).toString() + 'px') //add some space for album pad (2 * 5px atm) + some extra just in case
      
      return album
    }
    return null
  },

  drawBoardAlbum: function(){
    log('drawBoardAlbum()')
    static.listAlbum.classList.add('d-none')
    static.boardAlbum.classList.remove('d-none')
    
    this.clearLists()
    //clearBoards()

    static.boardTitle.value = project.boards[board].name
    static.boardDescription.value = brdAttr(board,'description')


    //fill lists & boards
    for(let l = 0; l < project.boards[board].content.length; l++){

      let listEl = static.listTemplate.cloneNode(true)
      static.boardAlbum.appendChild(listEl)

      
      this.loadList(listEl,project.boards[board].content[l])

    }

    
    $(static.boardTitle).select() //autopop

    this.fixAlbumUI()
    this.fixNewListUI()
  },

  drawListAlbum: function(){
    log('drawListAlbum()')
    static.boardAlbum.classList.add('d-none')
    static.listAlbum.classList.remove('d-none')

    this.clearBoards(static.mainList)

    this.loadList(static.mainList,"")

    

    /*
    let ids = Object.keys(project.boards);
    //fill boards
    for(let i = 0; i < ids.length; i++){
      if(project.boards[ids[i]].attributes['onMain'] == true){
        if(project.boards[ids[i]].type == Board.Types.Text){

          let el = static.textBrdTemplate.cloneNode(true);
          static.mainList.appendChild(el);
          loadTextBoard(el,project.boards[ids[i]]);
        
        }else if(project.boards[ids[i]].type == Board.Types.Board){

          let el = static.boardBrdTemplate.cloneNode(true);
          static.mainList.appendChild(el);
          loadBoardBoard(el,project.boards[ids[i]]);

        }
        
      }
    }
    */
    this.fixListUI(static.mainList)
  },


  loadTextBoard: function(textBoardEl, brd){
    log('loadTextBoard(',textBoardEl,"'"+JSON.stringify(brd)+"'",')')

    if (typeof brd === 'string' || brd instanceof String)
    brd = project.boards[brd]

    set_dataId(textBoardEl, brd.id)

    $(EbyClass('textBtn',textBoardEl)[0]).contents()[1].nodeValue = brd.name
    
    if(brd.content.length>0) 
      EbyClass('descriptionIcon', textBoardEl)[0].classList.remove('d-none')
    else 
      EbyClass('descriptionIcon', textBoardEl)[0].classList.add('d-none')

    this.loadBackground(textBoardEl,brd.id)
  },

  loadBackground: function(brdEl, id){
    brdEl.style.backgroundImage = "url('"+brdAttr(id,'background')+"')"
    brdEl.style.repeatMode = "no-repeat"
    brdEl.style.backgroundSize = "cover"
  },

  loadBoardBoard: function(boardBoardEl, brd){
    log('loadBoardBoard(',boardBoardEl,"'"+JSON.stringify(brd)+"'",')')

    if (typeof brd === 'string' || brd instanceof String)
      brd = project.boards[brd]

    set_dataId(boardBoardEl, brd.id)
    $(EbyClass('textBtn',boardBoardEl)[0]).contents()[0].nodeValue = brd.name

    this.loadBackground(boardBoardEl, brd.id)
  },

  loadList: function(listEl, brd){
    log('loadList(',listEl,"'"+JSON.stringify(brd)+"'",')')

    if (typeof brd === 'string' || brd instanceof String)
      brd = project.boards[brd]

    titleText = EbyClass('title-text',listEl)[0]

    //could cause issues with main board (probably not)?
    //can only be blur while as input, so turn to div
    //  titleText.outerHTML = titleText.outerHTML.replace('<input','<div').replace('</input>','</div>');
    //  titleText.onclick = ()=>{listTitleClicked(this)};
    //  titleText.onblur = null;


    titleText.addEventListener('click',listTitleClicked,true)
    titleText.onblur = ()=>{ listTitleBlur() }

  //  $(titleText).val(brd.name);
    $(titleText).html(brd.name) //we assume its div at start
  //  $(titleText).prop("readonly",true);
    set_dataId(listEl, brd.id)

    
    
    for(let i = 0; i < brd.content.length; i++){
      let brd2 = project.boards[brd.content[i]]
      if(brd2.type == Board.Types.Text){

        let el = static.textBrdTemplate.cloneNode(true)
        listEl.appendChild(el)
        this.loadTextBoard(el,brd2)
      
      }else if(brd2.type == Board.Types.Board){

        let el = static.boardBrdTemplate.cloneNode(true)
        listEl.appendChild(el)
        this.loadBoardBoard(el,brd2)

      }
    }
    this.fixListUI(listEl)

  },

  loadAllBoardsByDataId: function(brdId){
    let boardEls = EbyClass('board')

    for(let i = 0; i < boardEls.length; i++)
      if(dataId(boardEls[i])==brdId){
        if(project.boards[brdId].type == Board.Types.Text)
          this.loadTextBoard(boardEls[i],brdId)
        else if(project.boards[brdId].type == Board.Types.Board)
          this.loadBoardBoard(boardEls[i],brdId)
      }
    
  },

}