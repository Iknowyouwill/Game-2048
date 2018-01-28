function showRandomAnimation(x, y, num) {
    var theCell = $('#number-cell-' + x + '-' + y);

    if (num == 0) {
        theCell.css('width', 0);
        theCell.css('height', 0);
    } else {
        var bgc = getBgc(num);
        theCell.css('background-color', bgc);
        theCell.text(num);
    }

    theCell.animate({
        width: cellSideLen + 'px',
        height: cellSideLen + 'px',
    }, 50);
}

function showMoveAnimation(fromx, fromy, tox, toy) {

    var fromCell = $('#number-cell-' + fromx + '-' + fromy);
    fromCell.animate({
        top: getPosition(tox, toy).top,
        left: getPosition(tox, toy).left,
    }, 200);
}