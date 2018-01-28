function getPosition(i, j) {
    return {
        top: cellSpace + i * (cellSpace + cellSideLen),
        left: cellSpace + j * (cellSpace + cellSideLen),

    }
}

function getBgc(val) {
    switch (val) {
        case 2:
            return 'rgb(240, 230, 161)';
        case 4:
            return 'rgb(240, 232, 145)';
        case 8:
            return 'rgb(232, 187, 107)';
        case 16:
            return 'rgb(240, 182, 76)';
        case 32:
            return 'rgb(213, 157, 55)';
        case 64:
            return 'rgb(223, 139, 67)';
        case 128:
            return 'rgb(221, 125, 42)';
        case 256:
            return 'rgb(223, 119, 29)';
        case 512:
            return 'rgb(195, 108, 34)';
        case 1024:
            return 'rgb(207, 102, 53)';
        case 2048:
            return 'rgb(172, 75, 29)';
        case 4096:
            return 'rgb(210, 100, 36)';
        case 8192:
            return 'rgb(239, 106, 29)';
        default:
            return 'black';
    }
}

function hasSpace(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0)
                return true;
        }
    }
    console.log('ok')
    return false;
}

function canMoveLeft(board) {

    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            /****
             * 1.当前格子不空
             * 2.当前格子的左边空
             * 3.当前格子数字与左边相等
             * 4.只要有一个能移动就是可以移动
             * ***/
            if (board[i][j] != 0) {
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp(board) {

    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            /****
             * 1.当前格子不空
             * 2.当前格子的上边空
             * 3.当前格子数字与上面的相等
             * 4.只要有一个能移动就是可以移动
             * ***/
            if (board[i][j] != 0) {
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight(board) {

    for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; j--) {
            /****
             * 1.当前格子不空
             * 2.当前格子的右边空
             * 3.当前格子数字与右边的相等
             * 4.只要有一个能移动就是可以移动
             * ***/
            if (board[i][j] != 0) {
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown(board) {
    /**     0  1  2  3
     *      0  1  2  3
     *      0  1  2  3
     *      _  _  _  _
     */
    for (let j = 0; j < 4; j++) {
        for (let i = 2; i >= 0; i--) {
            /****
             * 1.当前格子不空
             * 2.当前格子的下边空
             * 3.当前格子数字与下边的相等
             * 4.只要有一个能移动就是可以移动
             * ***/
            if (board[i][j] != 0) {
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function noRowBlock(row, col1, col2, board) {
    for (let i = col1 + 1; i < col2; i++) {
        if (board[row][i] != 0) return false; //只要中间存在阻碍就无法移动
    }
    return true;
}

function noColBlock(col, row1, row2, board) {
    for (let i = row1 + 1; i < row2; i++) {
        if (board[i][col] != 0) return false; //只要中间存在阻碍就无法移动
    }
    return true;
}

function canMove(board) {
    if (!canMoveDown(board) &&
        !canMoveLeft(board) &&
        !canMoveRight(board) &&
        !canMoveUp(board)) {
        return false;
    }

    return true;
}


//移动
function moveLeft() {
    /****
     *      _  1  2  3
     *      _  1  2  3
     *      _  1  2  3
     *      _  1  2  3
     */
    var thisScore = 0;
    if (!canMoveLeft(board)) {

        return false;
    }
    //move
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            /****
             * 1.当前格子不为空
             * 2.左边的格子数字为0或者相等
             * 3.左边没有阻碍
             */
            if (board[i][j]) {

                for (let k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noRowBlock(i, k, j, board)) {
                        //move

                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[i][k] == board[i][j] && noRowBlock(i, k, j, board) && !conflicated[i][k]) {
                        //move

                        showMoveAnimation(i, j, i, k);
                        for (let x = 0; x < 4; x++) {
                            conflicated[i][x] = true;
                        }
                        conflicated[i][k] = true;
                        //add
                        board[i][k] += board[i][j];
                        //add score
                        thisScore += board[i][j];

                        board[i][j] = 0;
                        break;

                    }
                }
            }
        }
    }
    changeScore(thisScore);
    setTimeout(() => {
        updateBoardView();
    }, 200);
    //或者
    // setTimeout('updateBoardView()', 200);
    return true;
}

function moveUp() {
    /****
     *      _  _  _  _
     *      0  1  2  3
     *      0  1  2  3
     *      0  1  2  3
     */
    var thisScore = 0;
    if (!canMoveUp(board)) {
        return false;
    }
    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {

            if (board[i][j]) {
                for (let k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noColBlock(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);

                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[k][j] == board[i][j] && noColBlock(j, k, i, board) && !conflicated[k][j]) {
                        showMoveAnimation(i, j, k, j);

                        for (let x = 0; x < 4; x++) {
                            conflicated[x][j] = true;
                        }
                        board[k][j] += board[i][j];

                        thisScore += board[i][j];

                        board[i][j] = 0;
                        break;
                    }
                }
            }
        }
    }
    changeScore(thisScore);
    setTimeout(() => {
        updateBoardView();
    }, 200);
    //或者
    // setTimeout('updateBoardView()', 200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board)) {

        return false;
    }
    var thisScore = 0;
    //move
    for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; j--) {
            /****
             * 1.当前格子不为空
             * 2.右的格子数字为0或者相等
             * 3.右边没有阻碍
             */
            if (board[i][j]) {

                for (let k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noRowBlock(i, j, k, board)) {
                        //move

                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noRowBlock(i, j, k, board) && !conflicated[i][k]) {
                        //move

                        showMoveAnimation(i, j, i, k);
                        for (let x = 0; x < 4; x++) {
                            conflicated[i][x] = true;
                        }
                        //add
                        board[i][k] += board[i][j];

                        thisScore += board[i][j];

                        board[i][j] = 0;
                        continue;
                    }
                }
            }
        }
    }
    changeScore(thisScore);
    setTimeout(() => {
        updateBoardView();
    }, 200);
    //或者
    // setTimeout('updateBoardView()', 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    var thisScore = 0;
    for (let j = 0; j < 4; j++) {
        for (let i = 2; i >= 0; i--) {

            if (board[i][j]) {
                for (let k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noColBlock(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);

                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        break;
                    } else if (board[k][j] == board[i][j] && noColBlock(j, i, k, board) && !conflicated[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        for (let x = 0; x < 4; x++) {
                            conflicated[x][j] = true;
                        }
                        board[k][j] += board[i][j];

                        thisScore += board[i][j];

                        board[i][j] = 0;
                        break;
                    }
                }
            }
        }
    }
    changeScore(thisScore);
    setTimeout(() => {
        updateBoardView();
    }, 200);
    //或者
    // setTimeout('updateBoardView()', 200);
    return true;
}






//响应式优化
docW = document.documentElement.clientWidth;
var gridContainerWidth = 0.92 * docW;
var cellSideLen = 0.18 * docW;
var cellSpace = 0.04 * docW;

function prepareForMobile() {
    if (docW > 800) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLen = 100;
    }
    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLen);
    $('.grid-cell').css('height', cellSideLen);
    $('.grid-cell').css('border-redius', 0.02 * cellSideLen);
}