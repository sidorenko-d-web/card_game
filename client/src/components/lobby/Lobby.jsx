import React, { useState, useEffect } from 'react'

import RoomMenu from './RoomMenu'
import './lobby.css'
import Opponents from './Opponents'
import Deck from './Deck'
import ClientCards from './ClientCards'
import TableCard from './TableCard'

const Lobby = ({socket}) => {

    const [users, setUsers] = useState([])
    const [order, setOrder] = useState([])

    const updateUsersInRoom = (data) => { 
        setUsers(data)
        setOrder(data)

    }

    const changeOrder = () => {
        let orderToChange = order
        orderToChange.push(order.splice(0,1)[0])
        console.log(orderToChange)
        setOrder(orderToChange)
    }
    
    useEffect( () => {
       socket.on('updateUsers', (data) =>  {
        updateUsersInRoom(data)
    })
    },[socket])


    return (
        <main>
            
            <div className="game-field">
                <Deck socket={socket}/>
                <Opponents users={users} socket={socket}/>
                <ClientCards socket={socket}/>
                <TableCard socket={socket}/>
            </div>
            <RoomMenu order={order} changeOrder={changeOrder} socket={socket}/>
        </main>
    )
}

export default Lobby