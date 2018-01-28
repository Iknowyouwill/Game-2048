var board = new Array();
var score = 0;
var conflicated = new Array(); //控制叠加
var overlay = $('.overlay');
var curscore = $('#score');
var addscore = $('#addScore');


$(function() {
    prepareForMobile();
    newGame();

});



function newGame() {
    //初始化棋盘
    initGame();
    //随机生成两个格子
    generateRandomNumber();
    generateRandomNumber();
}

function initGame() {
    var Pos;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            var gridCell = $('#grid-cell-' + i + '-' + j);
            Pos = getPosition(i, j);
            gridCell.css('top', Pos.top);
            gridCell.css('left', Pos.left);
        }
    }

    for (let i = 0; i < 4; i++) {
        board[i] = new Array();
        conflicated[i] = new Array();
        for (let j = 0; j < 4; j++) {
            board[i][j] = 0;
            conflicated[i][j] = false; //初始化为未叠加态
        }

    }
    // // board[0][0] = 4;
    // board[0][1] = 4;
    // board[0][2] = 8;
    // board[0][3] = 8;

    // board[0][0] = 4;
    // board[1][0] = 4;
    // board[2][0] = 8;
    // board[3][0] = 2048;

    updateBoardView();
    score = 0;
}

function updateBoardView() {
    $('.number-cell').remove();

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            var numberCell = 'number-cell-' + i + '-' + j;
            $('#grid-container').append('<div class="number-cell" id="' + numberCell +
                '"></div>');
            var theCell = $('#' + numberCell);
            var pos = getPosition(i, j);
            theCell.css('top', pos.top);
            theCell.css('left', pos.left);

            if (board[i][j] == 0) {
                theCell.css('width', 0);
                theCell.css('height', 0);
            } else {
                theCell.css('width', cellSideLen);
                theCell.css('height', cellSideLen);
                var bgc = getBgc(board[i][j]);
                theCell.css('background-color', bgc);
                theCell.text(board[i][j]);
            }

        }
    }
    $('.number-cell').css('line-height', cellSideLen + 'px');
    $('.number-cell').css('font-size', 0.4 * cellSideLen + 'px');

    for (i in conflicated) {
        for (j in conflicated[i]) {
            conflicated[i][j] = false;
        }
    }
    gameWin();
}

function generateRandomNumber() {
    if (hasSpace(board)) {

        //生成随机坐标
        var randx = Math.round(Math.random() * 3);
        var randy = Math.round(Math.random() * 3);
        var times = 1;
        while (times++ < 50) {
            if (board[randx][randy] == 0)
                break;
            randx = Math.round(Math.random() * 3);
            randy = Math.round(Math.random() * 3);
        }
        for (let i = 0; board[randx][randy] && i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
        }
        // 生成2或4
        var randnum = Math.random() > 0.5 ? 2 : 4;
        board[randx][randy] = randnum;
        //将随机块显示出来
        showRandomAnimation(randx, randy, randnum);
    }
    return false;
}

//电脑端
$(document).keydown(function(e) {
    // console.log(e.keyCode);

    switch (e.keyCode) {
        case 37: //left
            e.preventDefault();
            if (moveLeft()) {
                setTimeout(() => {
                    generateRandomNumber();
                }, 200)
            }
            setTimeout(() => { isGameOver(board) }, 300);
            break;
        case 38: //up
            e.preventDefault();
            if (moveUp()) {
                setTimeout(() => {
                    generateRandomNumber();
                }, 200)
            }
            setTimeout(() => { isGameOver(board) }, 300);
            break;
        case 39: //right
            e.preventDefault();
            if (moveRight()) {
                setTimeout(() => {
                    generateRandomNumber();
                }, 200)
            }
            setTimeout(() => { isGameOver(board) }, 300);
            break;
        case 40: //down
            e.preventDefault();
            if (moveDown()) {
                setTimeout(() => {
                    generateRandomNumber();
                }, 200)
            }
            setTimeout(() => { isGameOver(board) }, 300);
            break;
        default:
            break;
    }
});

//触控设备
var startx, starty,
    endx, endy;
document.addEventListener('touchemove', (e) => {
    e.preventDefault();
})
document.addEventListener('touchstart', function(e) {
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
});
document.addEventListener('touchend', function(e) {
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;
    var dx = endx - startx,
        dy = endy - starty;
    if (Math.abs(dx) < 0.2 * docW && Math.abs(dy) < 0.2 * docW) {
        return;
    }
    //x
    if (Math.abs(dx) >= Math.abs(dy)) {
        //move right
        if (dx > 0) {
            if (moveRight()) {
                setTimeout(() => { generateRandomNumber() }, 200);
                setTimeout(() => { isGameOver(board) }, 300);
            }
        }
        //move left 
        else {
            if (moveLeft()) {
                setTimeout(() => { generateRandomNumber() }, 200);
                setTimeout(() => { isGameOver(board) }, 300);
            }
        }
    }
    //y 
    else {
        //move down
        if (dy > 0) {
            if (moveDown()) {
                setTimeout(() => { generateRandomNumber() }, 200);
                setTimeout(() => { isGameOver(board) }, 300);
            }
        }
        //move up
        else {
            if (moveUp()) {
                setTimeout(() => { generateRandomNumber() }, 200);
                setTimeout(() => { isGameOver(board) }, 300);
            }
        }

    }
});


//遮罩层


function resume() {
    overlay.hide();
    gameWin = () => {};
}

function restart() {
    overlay.hide();
    newGame();
}





function changeScore(val) {
    if (val == 0) return;
    addscore.show();
    addscore.text('+' + val);
    addscore.fadeOut();
    score += val;
    curscore.text(score);
}


//游戏结束事件
function isGameOver(board) {

    if (!hasSpace(board) && !canMove(board)) {
        console.log('Gameover');
        gameover();
    }
}

function gameover() {
    if (confirm('Game Over!\n是否重新开始')) {
        newGame();
    }
}

function gameWin() {
    for (i in board) {
        for (j in board[i]) {
            if (board[i][j] == 2048) {
                console.log('恭喜你,达成2048!!');
                overlay.show();
            }
        }
    }
}