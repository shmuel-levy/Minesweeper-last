'use strict'

function resetTimer() {
    clearInterval(gTimeId)
    gTimeId = 0
}

function setDifficulty(elLevel){
    var size = elLevel.dataset.size
    var mines = elLevel.dataset.mines
    gLevel.SIZE = size
    gLevel.MINES = mines
    initGame()
}
function blockButtonUse(element, msgClass) {
    popUp(msgClass)
    element.style.backgroundColor = 'red'
    element.style.cursor = 'not-allowed'
    setTimeout(function () {
        element.style.backgroundColor = null
        element.style.cursor = null
    }, 400)

}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function findEmptyPos(gBoard) {
    // console.log('gBoard:', gBoard);
    var emptyPoss = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            // console.log('cell:', cell);
            if (cell.isMine===true) {
                // console.log('empty');
                var pos = { i: i, j: j }
                emptyPoss.push(pos)
            }
        }
    }
    var randIdx = getRandomIntInclusive(0, emptyPoss.length)
    var randPos = emptyPoss[randIdx]

    return randPos
}

