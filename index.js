const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

const gameDefinitions = {playerX:0, playerO:0}

io.on('connection',socket=>{
    if(gameDefinitions.playerX===0) {
        gameDefinitions.playerX = socket.id
        socket.emit('definition','X')
    } else if (gameDefinitions.playerO===0) {
        gameDefinitions.playerO = socket.id
        socket.emit('definition','O')
        io.emit('gameStatus','start')
    }

    console.log(gameDefinitions.playerX, gameDefinitions.playerO)
    socket.on('gameMove',(move)=>{
        if(move.value = 'X') {
            socket.broadcast.emit('gameMove',move)
        } else {
            console.log(socket.id)
            socket.broadcast.emit('gameMove',move)
        }
    })
})

const PORT = 3000 || process.env.PORT

server.listen(PORT, ()=>console.log(`server running on ${PORT}`))