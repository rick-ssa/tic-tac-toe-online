const gameStatus = {playing:0, stoped:1, paused:2, waiting:3, over: 4}

let currentStatus = gameStatus.playing
let myMark = 'X'
let myColor = 'blue'
let otherColor = 'orange'
let ohterMark = 'O'

const cells = createCells()

cellsEventListener()


function makeMove(cellNumber,value) {
    if(!cells[cellNumber].querySelector('.cell').innerHTML) {
        cells[cellNumber].querySelector('.cell').innerHTML= value
        cells[cellNumber].querySelector('.cell').style.fontSize = '120px'
        return true
    }

    return false
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
                    currentStatus = gameStatus.waiting
                    showMessage('Waiting other player')
                }
            } else if (currentStatus === gameStatus.waiting) {
                if(makeMove(i,ohterMark)){
                    v.querySelector('.cell').style.color = otherColor
                    currentStatus = gameStatus.playing
                    showMessage('It is your turn')
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

changeBoardColor('green', 'red')