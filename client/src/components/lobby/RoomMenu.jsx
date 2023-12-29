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

    const mixDeck = () => {
        socket.emit('mixDeck', {room: localStorage.getItem('room')} )
    }

    const checkOrder = () => {
        socket.emit('checkOrder', {room: localStorage.getItem('room')})
    }

    useEffect(() =>{
        window.onpopstate = () => {
            socket.emit('leaveRoom', {name:localStorage.getItem('name'), room:localStorage.getItem('room')})
            navigate('/')
            socket.emit('getRooms')

        }
    })

    useEffect(() => {
        socket.on('checkOrderResponse', result => {
            result?console.log('its your turn'):console.log('wait your turn')
        })
    }, [socket])


    return (
        <div className='room-menu'>
            <button onClick={handleLeave} type="button">Leave the room</button>
            <button onClick={mixDeck} type="button">mix deck</button>
            <button onClick={checkOrder} type="button">end move</button>
        </div>
    )
}

export default RoomMenu