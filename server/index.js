const express = require('express')
const app = express()
const PORT = 8080
const server = require('http').createServer(app)
const cors = require('cors')
const { disconnect } = require('process')
const orderClass = require('./order')

const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})

let rooms = []
let deckBase = []

let cardsToTwise = []
for (let i = 1; i <= 4; i++) {
    deckBase.push({
        char: 'change color',
        color: 'any'
    })
}
for (let i = 1; i <= 4; i++) {
    deckBase.push({
        char: 'plus4',
        color: 'any'
    })
}
for (let i = 1; i <= 4; i++) {
    let color
    switch (i) {
        case 1:
            color = 'red'
            break;
        case 2:
            color = 'yellow'
            break;
        case 3:
            color = 'blue'
            break;
        case 4:
            color = 'green'
            break;
    }



    for (let i = 1; i <= 9; i++) {
        cardsToTwise.push({
            char: i,
            color: color
        })
    }
    deckBase.push({
        char: '0',
        color: color
    })

    cardsToTwise.push({
        char: 'stop',
        color: color
    })
    cardsToTwise.push({
        char: 'reverse',
        color: color
    })
    cardsToTwise.push({
        char: 'plus2',
        color: color
    })
}
deckBase = [...deckBase, ...cardsToTwise, ...cardsToTwise]

app.get('/', (req, res) => {
    res.send('server')
})

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

io.on('connection', socket => {


    socket.emit('updateRoomsResponse', rooms)

    socket.on('login', data => {
        if (rooms.some(room => room.name === data.room)) {//join room
            rooms.find(room => {
                if (room.name === data.room) { //add new user to room
                    if (!room.users.includes(data.name)) {
                        socket.join(data.room)
                        room.users.push(data.name)
                        room.order.addUser(socket.id)
                        socket.emit('success', true)
                        setTimeout(() => {
                            io.to(data.room).emit('updateUsers', room.users)
                        }, 300)

                    } else {//pls change nickname
                        socket.emit('success', false)
                    }
                }
            })
        } else {//new room
            socket.join(data.room)
            rooms.push({ name: data.room, users: [data.name], deck: [...deckBase], order: new orderClass(socket.id)}) //the structure of each room
            socket.emit('success', true)
            io.emit('updateRoomsResponse', rooms)

        }
    })

    socket.on('leaveRoom', data => {
        rooms.find(room => {
            if (room.name === data.room) {
                if (room.users.length === 1) {//deletes empty room
                    const roomsFilter = rooms.filter(roomItem => roomItem != room)
                    rooms = roomsFilter
                    io.emit('updateRoomsResponse', rooms)
                } else {//cutting left user
                    const users = room.users.filter(user => user != data.name)
                    room.users = users
                    room.order.deleteUser(socket.id)
                }
                socket.leave(data.room)
                setTimeout(() => {
                    io.to(data.room).emit('updateUsers', room.users)
                }, 300)
                
            }
        })
    })

    socket.on('updateRooms', () => {
        socket.emit('updateRoomsResponse', [...rooms])
    })



    socket.on('getCardFromDeck', data => {//give card to user
        rooms.filter(room => {
            if (room.name === data.room) {
                socket.emit('getCardFromDeckResponse', room.deck.splice(0, 1)[0])
                io.to(data.room).emit('getCardFromDeckToOpponentResponse', data.name)  
                io.to(data.room).emit('changeNumOfCards', data.name)  
            }
        })

    })

    socket.on('sendCardToTable', data => {
        rooms.filter(room => {
            if (room.name === data.room){
                io.to(data.room).emit('sendCardToTableResponse', data)
                io.to(data.room).emit('deleteCardFromOpponent', data.name)
            }
        })
    })
    socket.on('mixDeck', data => {
        rooms.filter(room => {
            if (room.name === data.room){
                localDeckBase = deckBase
                let mixedDeck = []
                for (let index = 0; index < 108; index++) {
                    const randInt = randomInt(0, localDeckBase.length-1)
                    mixedDeck.push(localDeckBase[randInt])
                    localDeckBase.splice(randInt, 1)
                }
                room.deck = mixedDeck
            }
        })
    })

    socket.on('checkOrder', (data) => { //проверку надо перенести из сокета в функцию, и вызывать эту функцию каждый раз при различных действиях. 
                                        //В сокете же надо оставить смену хода которая назначена на соответствующую кнопку
        rooms.filter(room => {
            if (room.name === data.room){

                let result = false
                if(socket.id === room.order.order[0]){
                    result = true
                }
                
                socket.emit('checkOrderResponse', result)
            }
        })
    })

})


server.listen(PORT, () => {
    console.log('server started')
})