const gameStatus = {playing:0, stoped:1, paused:2, waiting:3, over: 4}

let currentStatus = gameStatus.playing
let myMark = '&times;'
let myColor = 'blue'
let otherColor = 'orange'

const cells = createCells()

cellsEventListener()


function makeMove(cellNumber,value) {
    cells[cellNumber].querySelector('.cell').innerHTML= value
    cells[cellNumber].querySelector('.cell').style.fontSize = '120px'
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
                makeMove(i,myMark)
                v.querySelector('.cell').style.color = otherColor
                currentStatus = gameStatus.waiting
            }
        })
    })
}

function changeBoardColor(from, to) {
    cells.map((v,i)=>{
        v.querySelector('.middle-cell').style.backgroundColor = from
        v.style.backgroundColor = to
        
    })
}

changeBoardColor('blue', 'green')