const express = require('express')
const app = express()
const PORT = 8080
const server = require('http').createServer(app)
const cors = require('cors')
const { disconnect } = require('process')
const orderClass = require('./orderClass')
const { reverse } = require('dns')
const { restart } = require('nodemon')

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



io.on('connection', socket => {


    socket.emit('updateRoomsResponse', rooms)

    socket.on('login', data => {
        if (rooms.some(room => room.name === data.room)) {//join room
            rooms.find(room => {
                if (room.name === data.room && !room.status.gameStatus) { //add new user to room
                    if (!room.users.find(user => user.name == data.name)) {///////
                        socket.join(data.room)
                        room.users.push({name:data.name, cards:0})
                        room.order.addUser({socketId:socket.id, name: data.name})
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
            rooms.push({ 
                name: data.room, 
                users: [{name:data.name, cards:0, unoStatus: false}],
                deck: [], 
                order: new orderClass({
                    socketId:socket.id, 
                    name:data.name}),
                status:{
                    gameStatus:false,
                    readyUsers:0
                }
            })                                                                  //the structure of each room
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
                    const users = room.users.filter(user => user.name != data.name)
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
            if (room.name === data.room){
                giveCardToUser(room, data.room, data.name, socket.id)
            }
        })

    })

    socket.on('sendCardToTable', data => {
        rooms.filter(room => {
            if (room.name === data.room){
                deleteCardFromUser(room, data.room, data.name, data)
            }
        })
    })

    socket.on('changeOrder', (data) => { 
        rooms.filter(room => {
            if (room.name === data.room){
                room.order.changeOrder(1)
                io.to(data.room).emit('changeOrderResponse', room.order.order[0].socketId)
            }
        })
    })

    socket.on('stopCardInteraction', (data) => {
        rooms.filter(room => {
            if (room.name === data.room){
                room.order.changeOrder(2)
                io.to(data.room).emit('changeOrderResponse', room.order.order[0].socketId)
            }
        })
    })

    socket.on('reverseCardInteraction', (data) => {
        rooms.filter(room => {
            if (room.name === data.room){
                if(room.order.order.length == 2){
                    room.order.changeOrder(2)
                }else{
                room.order.reverseOrder()
                }
                io.to(data.room).emit('changeOrderResponse', room.order.order[0].socketId)
            }
        })
    })

    socket.on('plus2Card', (data) => {
        rooms.filter(room => {
            if (room.name === data.room){
                giveCardToUser(room, data.room, room.order.order[1].name, room.order.order[1].socketId)
                giveCardToUser(room, data.room, room.order.order[1].name, room.order.order[1].socketId)
                room.order.changeOrder(2)
                io.to(data.room).emit('changeOrderResponse', room.order.order[0].socketId)
            }
        })
    })

    socket.on('changeColorCard', (data) => {
        rooms.filter(room => {
            if(room.name === data.room){
                io.to(data.room).emit('changeColorCardResponse', data.color)
                room.order.changeOrder(1)
                io.to(data.room).emit('changeOrderResponse', room.order.order[0].socketId)

            }
        })
    })

    socket.on('plus4Card', (data) => {
        rooms.filter(room => {
            if(room.name === data.room){
                for (let i = 0; i < 4; i++) {
                    giveCardToUser(room, data.room, room.order.order[1].name, room.order.order[1].socketId)
                }
                io.to(data.room).emit('changeColorCardResponse', data.color)
                room.order.changeOrder(2)
                io.to(data.room).emit('changeOrderResponse', room.order.order[0].socketId)
            }
        })
    })

    socket.on('getReadyUser', (data) => {
        rooms.filter(room => {
            if(room.name === data.room){
                if(!room.status.gameStatus){
                    if(room.status.readyUsers < room.users.length - 1 || room.users.length == 1){
                        room.status.readyUsers++
                        io.to(data.room).emit('getReadyUserResponse', {type: data.type, readyUsers: room.status.readyUsers+'-'+room.users.length})
                    }else{
                        startGame(room)
                    }
                }
            }
        })
})

    socket.on('getUserWin', (data) => [
        rooms.filter(room => {
            if(room.name === data.room){
                io.to(data.room).emit('getUserWinResponse', data.winner)
                room.status.readyUsers = 0
                room.status.gameStatus = false
            }
        })
    ])

    socket.on('unoBtn', (data) => {
        rooms.filter(room => {
            if(room.name === data.room){
                room.users.filter(user => {
                    if (user.cards == 1 && user.name != data.name) {
                        if(!user.unoStatus){
                            const userFromOrder = room.order.order.filter(userInOrder => userInOrder.name == user.name)[0]
                            giveCardToUser(room, data.room, user.name, userFromOrder.socketId)
                            giveCardToUser(room, data.room, user.name, userFromOrder.socketId)
                        }
                    }
                    else if (user.cards == 1 && user.name == data.name) {
                        setUnoStatus(true, data.name, room)
                    }   
                })
            }
        })
    })
})

const setUnoStatus = (value, dataName, room) => {
    room.users.filter(user => {
        if(user.name == dataName){
            user.unoStatus = value
        }
    })
}

const startGame = (room) => {
    io.to(room.name).emit('restartCards')

    room.users.forEach(user => {
        user.cards = 0
        user.unoStatus = false
    });

    

    room.status.gameStatus = true
    
    room.deck = mixDeck()

    room.order.order.forEach(user => {
        for (let i = 0; i < 2; i++) {
            giveCardToUser(room, room.name, user.name, user.socketId)
        }
    });

    room.order.changeOrder(randomInt(0, 5))
     
    io.to(room.name).emit('getReadyUserResponse', {type: 'start', readyUsers: room.status.readyUsers+'-'+room.users.length})
    io.to(room.name).emit('updateUsers', room.users)
    io.to(room.name).emit('changeOrderResponse', room.order.order[0].socketId)  
}

const mixDeck = () => {
    localDeckBase = [...deckBase]
    let mixedDeck = []
    for (let index = 0; index < 108; index++) {
        const randInt = randomInt(0, localDeckBase.length-1)
        mixedDeck.push(localDeckBase[randInt])
        localDeckBase.splice(randInt, 1)
    }
    return mixedDeck
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

const giveCardToUser = (room, dataRoom, dataName, socketId) => {
    if(room.status.gameStatus){
        room.users.filter(user => {
            if(user.name == dataName){
                user.cards++
            }
        })
        io.to(socketId).emit('getCardFromDeckResponse', room.deck.splice(0, 1)[0])
        io.to(dataRoom).emit('updateUsers', room.users)
        io.to(dataRoom).emit('changeNumOfCards', room.deck.length)
        setUnoStatus(false, dataName, room) 
    }
}

const deleteCardFromUser = (room, dataRoom, dataName, data) => {
    if(room.status.gameStatus){
        room.users.filter(user => {
            if(user.name == dataName && room.status.gameStatus){
                user.cards--
            }
        })
        io.to(dataRoom).emit('sendCardToTableResponse', data)
        io.to(dataRoom).emit('updateUsers', room.users)
        setUnoStatus(false, dataName, room) 
    }
}

 
server.listen(PORT, () => {
    console.log('server started', new Date())
})