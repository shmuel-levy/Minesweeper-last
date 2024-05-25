'use strict'

function resetTimer() {
    clearInterval(gTimeId)
    gTimeId = 0
}

function setDifficulty(elLevel){
    var size = elLevel.dataset.size
    var mines = elLevel.dataset.mines
    gLevel.size = size
    gLevel.mines = mines
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