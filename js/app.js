'use strict'
// constants
const BOMB = '💣'
const FLAG = '🚩'
const SMILE = '😀'
const LOSE = '🤯'
const WIN = '😎'
const HEART = '💜'
// glabal variables
var gIsGameOver
var gBoard
const gLevel = {
    size: 4, mines: 2
}
var gFirstClickedCell
var gMinesOnBoard
var gFlagsOnBoardCount
var gGame
var gTimeId
var gTime
var gLivesLeft
//elements
var elBoard
var resetBtn = document.querySelector('.reset-btn')
var elTime = document.querySelector('.timer')
var elMinesOnBoard = document.querySelector('.mines-on-board')
var elLivesLeft = document.querySelector('.lives')
setgGame()
initGame()

function initGame() {
    gIsGameOver = false
    gLivesLeft = 3
    updateLivesLeft(gLivesLeft)
    gBoard = buildBoard(gLevel)
    gFirstClickedCell = null
    elBoard = document.querySelector('.board')
    renderBoard(gBoard, '.board')
    gFlagsOnBoardCount = 0
    gMinesOnBoard = +gLevel.mines
    resetBtn.innerText = SMILE
    elMinesOnBoard.innerText = gLevel.mines
    gTime = 0
    elTime.innerText = gTime
    resetTimer()
}
function buildBoard(gLevel) {

    const genArr = []
    const board = []
    // create an array of various cells 
    for (var i = 0; i < gLevel.size ** 2; i++) {
        var cellData = {
            isShown: false,
            isMine: i < gLevel.mines ? true : false,
            isMarked: false,
            minesAroundCount: null 
        }

        genArr.push(cellData)
    }
    let currentIndex = genArr.length;
    let temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = genArr[currentIndex]
        genArr[currentIndex] = genArr[randomIndex]
        genArr[randomIndex] = temporaryValue
    }
    while (genArr.length) board.push(genArr.splice(0, gLevel.size))
    return board
}

function renderBoard(board, selector) {
    // console.table(board)
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>\n'

        for (var j = 0; j < board[i].length; j++) {
            // define cell content if not Mine set the count
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = setMinesNeighborsCount(i, j, board)
            }
            var strClass //= board[i][j] ? 'cyan' : ''
            strHTML += `
                \t<td 
                    class="cell"
                    data-i="${i}" 
                    data-j="${j}" 
                    onclick="cellClicked(this,${i}, ${j})"
                    >
                </td>\n
            `
        }
        strHTML += '</tr>\n'
    }
    var elTable = document.querySelector(selector)
    elTable.innerHTML = strHTML
}

function updateLivesLeft(gLivesLeft) {
    var strLives = 'Lives: '
    for (var i = 0; i < gLivesLeft; i++) {
        strLives += HEART
    }
    elLivesLeft.innerText = strLives
}

elBoard.addEventListener("contextmenu", (event) => {

    event.preventDefault()
    if (gIsGameOver) return
    var elCell = event.target

    cellMarked(elCell)
})

function setMinesNeighborsCount(cellI, cellJ, board) {
    var neighborsCount = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}

function expandShown(board, elCell) {
    var cellI = elCell.dataset.i
    var cellJ = elCell.dataset.j
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            var elCell = document.querySelector(`[data-i = '${i}'][data-j = '${j}']`)
            if (!board[i][j].isMine && board[i][j].minesAroundCount <= 3) cellClicked(elCell)
        }
    }
}

function getMines(location, board) {
    var coordI = location.i
    var coordJ = location.j
    for (var i = coordI - 1; i <= coordI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = coordJ - 1; j <= coordJ + 1; j++) {
            if (i === coordI && j === coordJ) continue
            if (j < 0 || j >= board[i].length) continue
            var tempCell = gBoard[coordI][coordJ]
            if (!board[i][j].isMine) {
                gBoard[coordI][coordJ] = board[i][j]
                board[i][j] = tempCell
            }
        }
    }
}

function GameOver(isOnMine) {
    if (!isOnMine) {

        var flaggedMinesCount = 0
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
                    flaggedMinesCount++
                }
            }
        }
        if (flaggedMinesCount === gMinesOnBoard && gMinesOnBoard === gFlagsOnBoardCount) {
            gIsGameOver = true
            resetBtn.innerText = WIN
        }
    } else {
        gLivesLeft--
        updateLivesLeft(gLivesLeft)
        var elLivesLeft = document.querySelector('.lives')
        var strLives = ''
        for (var i = 0; i < gLivesLeft; i++) {
            strLives += HEART
        }
        elLivesLeft.innerText = strLives
        // var mines = []
        if (gLivesLeft === 0) {
            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard[i].length; j++) {
                    if (gBoard[i][j].isMine) {
                        gBoard[i][j].isShown = true
                        var elCell = document.querySelector(`[data-i = '${i}'][data-j = '${j}']`)
                        elCell.classList.add('mine')
                        elCell.innerText = BOMB
                    }
                }
            }
            gIsGameOver = true
            resetBtn.innerText = LOSE
        }
    }
    if (gIsGameOver) {
        resetTimer()
    }
}
function setHint() {
    const elHint = document.querySelector('.hint')

    if (gGame.hintsCount <= 0 || !gGame.isOn || gGame.isMegaHint || gGame.isSafe) {
        blockButtonUse(elHint, 'pop1')
        return
    }
    if (!gGame.isManualMode && !gGame.isSevenBoom) {
        if (gGame.shownCount === 0) {
            blockButtonUse(elHint, 'pop1')
            return
        }
    }

    gGame.isHint = !gGame.isHint
    if (gGame.isHint) elHint.style.backgroundColor = '#cfcb4e'
    else elHint.style.backgroundColor = null
}

function cellClicked(elCell) {

    var elCellI = elCell.dataset.i
    var elCellJ = elCell.dataset.j

    if(!gFirstClickedCell){
        gFirstClickedCell = {i:elCellI , j:elCellJ}
        if(gBoard[gFirstClickedCell.i][gFirstClickedCell.j].isMine){
            getMines(gFirstClickedCell , gBoard)
        }
    }
    if (gIsGameOver) return

    if (!gTimeId) {
        gTimeId = setInterval(() => {
            gTime++
            elTime.innerText = gTime
        }, 1000)
    }

    if (gBoard[elCellI][elCellJ].isShown === true || gBoard[elCellI][elCellJ].isMarked === true) return

    if (gBoard[elCellI][elCellJ].isMine === true) {
        gBoard[elCellI][elCellJ].isShown = true
        elCell.innerText = BOMB
       GameOver(gBoard[elCellI][elCellJ].isMine)
        return
    }

    if (gBoard[elCellI][elCellJ].minesAroundCount !== 0) {
        // model
        gBoard[elCellI][elCellJ].isShown = true
        // DOM
        elCell.classList.add(`checked`)
        elCell.classList.add(`color-${gBoard[elCellI][elCellJ].minesAroundCount}`)
        elCell.innerText = gBoard[elCellI][elCellJ].minesAroundCount
        return
    }
    if (gBoard[elCellI][elCellJ].minesAroundCount === 0) {
        gBoard[elCellI][elCellJ].isShown = true
        elCell.classList.add('checked')
        elCell.innerText = ' '
        expandShown(gBoard, elCell)
    }
    return
}

function cellMarked(elCell) {
    // this will update the model
    var elCellI = elCell.dataset.i
    var elCellJ = elCell.dataset.j

    if (gBoard[elCellI][elCellJ].isShown) return
    //model
    gBoard[elCellI][elCellJ].isMarked = !gBoard[elCellI][elCellJ].isMarked
    gBoard[elCellI][elCellJ].isMarked ? gFlagsOnBoardCount++ : gFlagsOnBoardCount--
    // DOM
    elCell.innerText = gBoard[elCellI][elCellJ].isMarked ? FLAG : ""
    elCell.classList.toggle('marked')

    var minesOnBoardCount = +elMinesOnBoard.textContent
    elMinesOnBoard.innerText = gBoard[elCellI][elCellJ].isMarked ? minesOnBoardCount - 1 : minesOnBoardCount + 1

   GameOver()
}
function setgGame() {
    gGame = {
        isOn: false,
        isWin: false,
        isSafe: false,
        isHint: false,
        isManualSet: false,
        isManualMode: false,
        isSevenBoom: false,
        isMegaHint: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        minesHits: 0,
        minesLeft: 0,
        livesCount: parseInt(gLevel.size / 4),
        hintsCount: 3,
        safeCount: 3,
        megaHintsCount: 1,
        terminateCount: 1,
        steps: 0,
    }
}
