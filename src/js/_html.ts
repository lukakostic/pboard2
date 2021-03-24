//Static html elements
//Since its all deffered, or at  least this should be, no worries about it not existing.
const html = {
    main : EbyId('main'),

    albumTemplate : templateFChild('album-template'),
    list2Template : templateFChild('list-template'),
    tileTemplate : templateFChild('tile-template'),

    tabStart : EbyId('tabStart'),
    tabEnd : EbyId('tabEnd'),

    loadingIndicator : EbyId('loadingIndicator'),
    savingIndicator : EbyId('savingIndicator'),

    extrasDialog : EbyId('extrasDialog'),
    extrasTitle : EbyId('extrasTitle'),
    extrasContent : EbyId('extrasContent'),
    extrasBack : EbyId('extrasBack')
  
}