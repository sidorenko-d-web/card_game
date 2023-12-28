const express = require('express')
const app = express()
const PORT = 8080
const server = require('http').createServer(app)
const cors = require('cors')
const { disconnect } = require('process')

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

    console.log(socket.id + ' user connected')

    socket.emit('updateRoomsResponse', rooms)

    socket.on('login', data => {
        console.log('a')
        if (rooms.some(room => room.name === data.room)) {//join room
            rooms.find(room => {
                if (room.name === data.room) { //add new user to room
                    if (!room.users.includes(data.name)) {
                        socket.join(data.room)
                        room.users.push(data.name)
                        socket.emit('success', true)
                        io.to(data.room).emit('updateUsers', room.users)

                    } else {//pls change nickname
                        socket.emit('success', false)
                    }
                }
            })
        } else {//new room
            socket.join(data.room)
            rooms.push({ name: data.room, users: [data.name], deck: [...deckBase] })
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
                }
                socket.leave(data.room)
                io.to(data.room).emit('updateUsers', room.users)
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
                console.log(mixedDeck)
                room.deck = mixedDeck
            }
        })
    })

})

// io.on('connection', (socket) => {
//     console.log(socket.id + 'user is connected')



//     socket.on('login', (data) => {
//         if(rooms.some(elem => elem.room === data.room)){                          // connect to existed room
//             let currentRoom = rooms.findIndex(elem => elem.room == data.room)

//             if(rooms[currentRoom].users.findIndex(elem => elem == data.name)>-1){// change nickname
//                 socket.emit('success', false)
//             }else{                                                               // add new user to room
//                 rooms[currentRoom].users.push(data.name)
//                 socket.emit('success', true)
//                 io.emit('updateUsersResponse',{users:rooms[currentRoom].users, room:data.room})
//                 console.log(rooms[0].users, ' added user')

//             }
//         }   
//         else{                                                                    // create new room
//             socket.emit('success', true)
//             rooms.push({users:[data.name], room:data.room, deck:[...deckBase]})
//             io.emit('updateRoomsResponse', [...rooms])
//             let currentRoom = rooms.findIndex(elem => elem.room == data.room)
//             io.emit('updateUsersResponse',{users:rooms[currentRoom].users, room:data.room})
//             console.log(rooms[0].users, ' new room')
//         }
//     })

//     socket.on('updateRooms',() => {
//         io.emit('updateRoomsResponse', [...rooms])
//     })

//     socket.on('leaveRoom', (data) => {
//         let currentRoom = rooms.findIndex(elem => elem.room === data.room)
//         if(currentRoom !== -1){
//             if(rooms[currentRoom].users.length === 1){                                              //if room is empty delete room
//                 rooms.splice(currentRoom, 1)
//             }else{                                                                                  //else just cut left user  
//                 let leftUser = rooms[currentRoom].users.findIndex(elem => elem === data.name)
//                 rooms[currentRoom].users.splice(leftUser, 1)
//                 io.emit('updateUsersResponse',{users:rooms[currentRoom].users, room:data.room})

//             }
//         }
//         socket.emit('clearClientCards')
//         console.log( ' user left')

//     })

//     socket.on('getCardFromDeck', (data) => {                                                            //give card to user/
//         let currentRoom = rooms.findIndex(elem => elem.room == data.room)


//         io.emit('getCardFromDeckResponse', ({card:rooms[currentRoom].deck.splice(0,1)[0], name:data.name, room:data.room}))
//         io.emit('changeNumOfCards', ({numOfCards:rooms[currentRoom].deck.length, room:data.room}))
//     })

//     socket.on('sendCardToTable', data => {
//         io.emit('sendCardToTableResponse', data)
//     })



// })

server.listen(PORT, () => {
    console.log('server started')
})