let boardHistory = [];
boardHistory.last = function () {
    return this.slice(-1)[0];
};
boardHistory.add = function (boardIdOrUrl) {
    let bId = boardFromUrl(boardIdOrUrl);
    if (bId != this.last())
        this.push(bId);
};
boardHistory.prev = function () {
    this.pop();
    return this.pop();
};
