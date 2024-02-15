const express = require('express')
const app = express()
const PORT = 8080
const server = require('http').createServer(app)
const cors = require('cors')
const { disconnect } = require('process')
const orderClass = require('./orderClass')
const { reverse } = require('dns')

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
                    console.log(room.users.find(user => user.name == data.name))/////
                    console.log('f')
                if (!room.name === data.room && !room.status.gameStatus) { //add new user to room
                    if (room.users.find(user => user.name == data.name)) {///////
                        socket.join(data.room)
                        room.users.push({name:data.name, cards:0})
                        room.order.addUser({socketId:socket.id, name: data.name})
                        socket.emit('success', true)
                        setTimeout(() => {
                            io.to(data.room).emit('updateUsers', room.users)
                            io.to(data.room).emit('changeOrderResponse', room.order.order[0].socketId)
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
                users: [{name:data.name, cards:0}],
                deck: [...deckBase], 
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

    // socket.on('mixDeck', data => {
    //     rooms.filter(room => {
    //         if (room.name === data.room){
    //             localDeckBase = [...deckBase]
    //             let mixedDeck = []
    //             for (let index = 0; index < 108; index++) {
    //                 const randInt = randomInt(0, localDeckBase.length-1)
    //                 mixedDeck.push(localDeckBase[randInt])
    //                 localDeckBase.splice(randInt, 1)
    //             }
    //             room.deck = mixedDeck
    //         }
    //     })
    // })

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

    socket.on('getReadyUser', (data) => [
        rooms.filter(room => {
            if(room.name === data.room){
                if(!room.status.gameStatus){
                    if(room.status.readyUsers < room.users.length - 1 || room.users.length == 1){
                        room.status.readyUsers++
                    }else{
                        startGame(room)
                    }
                }
            }
        })
    ])

})

const startGame = (room) => {
    localDeckBase = [...deckBase]
    let mixedDeck = []
    for (let index = 0; index < 108; index++) {
        const randInt = randomInt(0, localDeckBase.length-1)
        mixedDeck.push(localDeckBase[randInt])
        localDeckBase.splice(randInt, 1)
    }
    
    room.deck = mixedDeck

    room.order.order.forEach(user => {
        for (let i = 0; i < 7; i++) {
            giveCardToUser(room, room.name, user.name, user.socketId)
            
        }
    });

    room.order.changeOrder(randomInt(0, 5))
    io.to(room.name).emit('changeOrderResponse', room.order.order[0].socketId)
    
    room.status.gameStatus = true
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

const giveCardToUser = (room, dataRoom, dataName, socketId) => {
    room.users.filter(user => {
        if(user.name == dataName){
            user.cards++
        }
    })
    io.to(socketId).emit('getCardFromDeckResponse', room.deck.splice(0, 1)[0])
    io.to(dataRoom).emit('updateUsers', room.users)
    io.to(dataRoom).emit('changeNumOfCards') 
}

const deleteCardFromUser = (room, dataRoom, dataName, data) => {
    room.users.filter(user => {
        if(user.name == dataName){
            user.cards--
        }
    })
    io.to(dataRoom).emit('sendCardToTableResponse', data)
    io.to(dataRoom).emit('updateUsers', room.users)
}

 
server.listen(PORT, () => {
    console.log('server started', new Date())
})