import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RoomMenu = ({ socket, changeOrder, order }) => {
    


    const navigate = useNavigate()

    const handleLeave = () => {
        socket.emit('leaveRoom', { name: localStorage.getItem('name'), room: localStorage.getItem('room') })
        socket.emit('updateRooms')
        localStorage.removeItem('name')
        localStorage.removeItem('room')

        navigate('/')
    }

    const mixDeck = () => {
        socket.emit('mixDeck', {room: localStorage.getItem('room')} )
    }

    console.log(order[0])
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
            <button onClick={mixDeck} type="button">mix deck</button>
            <button onClick={changeOrder} className={order[0] == localStorage.getItem(name)?'btn-green':'btn-red'} type="button">end move</button>
        </div>
    )
}

export default RoomMenu