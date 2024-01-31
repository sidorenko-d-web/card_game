import React, { useState, useEffect } from 'react'

import RoomMenu from './RoomMenu'
import './lobby.css'
import Opponents from './Opponents'
import Deck from './Deck'
import ClientCards from './ClientCards'
import TableCard from './TableCard'

const Lobby = ({socket}) => {

    const [users, setUsers] = useState([])
    const [currentUserOrder, setcurrentUserOrder] = useState()
    const [prevCard, setPrevCard] = useState({color: 'any', char:'x'})

    const updateUsersInRoom = (data) => { 
        setUsers(data)
    }

    
    useEffect( () => {
        socket.on('updateUsers', (data) =>  {
            updateUsersInRoom(data)
        })
        socket.on('changeOrderResponse', (user) => {
            setcurrentUserOrder(user)
        })
    }, [socket])


    return (
        <main>
            <div className="game-field">
                <Deck socket={socket} currentUserOrder={currentUserOrder}/>
                <Opponents users={users} socket={socket}/>
                <ClientCards socket={socket} currentUserOrder={currentUserOrder} prevCard={prevCard}/>
                <TableCard socket={socket} prevCard={prevCard} setPrevCard={setPrevCard}/>
            </div>
            <RoomMenu socket={socket}  currentUserOrder={currentUserOrder}/>
        </main>
    )
}

export default Lobby