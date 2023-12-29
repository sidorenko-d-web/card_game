import React, { useState, useEffect } from 'react'

import RoomMenu from './RoomMenu'
import './lobby.css'
import Opponents from './Opponents'
import Deck from './Deck'
import ClientCards from './ClientCards'
import TableCard from './TableCard'

const Lobby = ({socket}) => {

    const [users, setUsers] = useState([])

    const updateUsersInRoom = (data) => { 
        setUsers(data)
    }

    
    useEffect( () => {
        socket.on('updateUsers', (data) =>  {
            updateUsersInRoom(data)
            console.log(data)
        })
    }, [socket])


    return (
        <main>
            
            <div className="game-field">
                <Deck socket={socket}/>
                <Opponents users={users} socket={socket}/>
                <ClientCards socket={socket}/>
                <TableCard socket={socket}/>
            </div>
            <RoomMenu socket={socket}/>
        </main>
    )
}

export default Lobby