const gameStatus = {playing:0, stoped:1, paused:2, waiting:3, over: 4}
const socket = io()

let currentStatus = gameStatus.playing
let myMark = 'X'
let myColor = 'blue'
let otherColor = 'orange'
let otherMark = 'O'

const cells = createCells()

const luckNumbers = [7, 56, 73, 84, 146, 273, 292, 448]

cellsEventListener()

function setGameStatus(status) {
    switch(status) {
        case gameStatus.playing:
            showMessage('It is your turn!!!')
            currentStatus = gameStatus.playing
            break;
        case gameStatus.over:
            changeBoardColor('green','red')
            currentStatus = gameStatus.over
            break;
        case gameStatus.paused:
            showMessage('Game is paused')
            currentStatus = gameStatus.paused
            break;
        case gameStatus.waiting:
            showMessage(`Waiting Player ${otherMark} play`)
            currentStatus = gameStatus.waiting
            break;
        case gameStatus.stoped:
            break;
    }
}

function makeMove(cellNumber,value) {
    if(!cells[cellNumber].querySelector('.cell').innerHTML) {
        cells[cellNumber].querySelector('.cell').innerHTML = value
        cells[cellNumber].querySelector('.cell').style.fontSize = '120px'
        madeMove(value)
        return true
    }
    return false
}

function madeMove(player) {
    let luckNumber = playerWin(player)
    if(luckNumber) {
        showMessage(`Player ${player} Won`)
        setGameStatus(gameStatus.over)
        winnerCellsAnimation(luckNumber)
    } else {
        if(currentStatus === gameStatus.playing) {
            setGameStatus(gameStatus.waiting)
        } else if(currentStatus === gameStatus.waiting) {
            setGameStatus(gameStatus.playing)
        }
        if(gameFull()) {
            showMessage ('Game is Tied')
            setGameStatus(gameStatus.over)
        }
    }
}

function createCells() {
    const cells = []
    for (let i=0; i < 9; i++) {
        let board = document.querySelector('.board')
        let container = document.createElement('div')
        let middle = document.createElement('div')
        let cell = document.createElement('div')
        container.classList.add ('cell-container')
        middle.classList.add('middle-cell')
        cell.classList.add('cell')
        container.appendChild(middle)
        container.appendChild(cell)
        cells.push(container)
        board.appendChild(container)
    }
    return cells
}

function cellsEventListener() {
    cells.map((v,i)=>{
        v.querySelector('.cell').addEventListener('click',()=>{
            if(currentStatus===gameStatus.playing) {
                if (makeMove(i,myMark)) {
                    v.querySelector('.cell').style.color = myColor
                }
            } else if (currentStatus === gameStatus.waiting) {
                if(makeMove(i,otherMark)){
                    v.querySelector('.cell').style.color = otherColor
                }
            }
        })
    })
}

function changeBoardColor(from, to) {
    cells.map((v,i)=>{
        let middle = v.querySelector('.middle-cell')

        middle.style.backgroundColor = from
        middle.style.width = '120px'
        middle.style.height = '120px'
        v.style.backgroundColor = to
        middle.classList.add('animate-board')
        setTimeout(()=>{
            middle.style.backgroundColor = to
            if(middle.classList.contains('animate-board')) {
                middle.classList.remove('animate-board')
            }
        },2000)
    })
}

function showMessage(text) {
    messageBar = document.querySelector('.message-bar')
    messageBar.innerHTML = text
}

function playerWin(player) {
    let total = cells.reduce((result,wrap,index)=>{
        if(wrap.querySelector('.cell').innerHTML === player) {
            result += Math.pow(2,index)
            return result
        }

        return result
    },0)
    
    let luckNumber = luckNumbers.reduce((winnerNumber,number)=>{
        if(winnerNumber) return winnerNumber
        return (number & total) === number ? number : false
    },false)

    return luckNumber
}

function gameFull() {
    let total = cells.reduce((sum, wrap)=>{
        if(wrap.querySelector('.cell').innerHTML) {
            return sum + 1
        } else {
            return sum
        }
    },0)

    if(total===9) {
        return true
    }
    
    return false
}

function resetBoard() {
    cells.map(v => v.querySelector('.cell').innerHTML = '')
}

function getWinnerCellsIndexes(luckNumber){
    let numbers = [256, 128, 64, 32, 16, 8, 4, 2, 1]
    let arrIndex = numbers.reduce((indexes,number)=>{
        if(number <= luckNumber) {
            indexes.push(Math.log2(number))
            luckNumber -= number
        }

        return indexes
    },[])

    return arrIndex
}

function winnerCellsAnimation(luckNumber) {
    let indexes = getWinnerCellsIndexes(luckNumber)
    indexes.map((winnerCellIndex,i,array)=>{
        let cell = cells[winnerCellIndex].querySelector('.cell')
        let newCell = document.createElement('div')
        newCell.style.color = cell.innerHTML === myMark ? myColor : otherColor
        newCell.appendChild(document.createTextNode(cell.innerHTML))
        cell.innerHTML = ''
        cells[winnerCellIndex].appendChild(newCell)
        newCell.classList.add('winner-cells')
    })
}

changeBoardColor('red', 'green')