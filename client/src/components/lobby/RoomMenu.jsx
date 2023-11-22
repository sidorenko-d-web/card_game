import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RoomMenu = ({ socket }) => {
    


    const navigate = useNavigate()

    const handleLeave = () => {
        socket.emit('leaveRoom', { name: localStorage.getItem('name'), room: localStorage.getItem('room') })
        socket.emit('updateRooms')
        localStorage.removeItem('name')
        localStorage.removeItem('room')

        navigate('/')
    }

    
    useEffect(() =>{
        window.onpopstate = () => {
            socket.emit('leaveRoom', {name:localStorage.getItem('name'), room:localStorage.getItem('room')})
            navigate('/')
            socket.emit('getRooms')

        }
    })


    return (
        <div className='room-menu'>
            <button onClick={handleLeave} type="button">Leave the room</button>
        </div>
    )
}

export default RoomMenu