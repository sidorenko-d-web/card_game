import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RoomMenu = ({ socket, currentUserOrder, setMultiMove }) => {
    const navigate = useNavigate()

    const handleLeave = () => {
        socket.emit('leaveRoom', { name: localStorage.getItem('name'), room: localStorage.getItem('room') })
        socket.emit('updateRooms')

        localStorage.removeItem('name')
        localStorage.removeItem('room')

        navigate('/')
    }

    const changeOrder = () => {
        if(socket.id == currentUserOrder){
            setMultiMove(false)
            socket.emit('changeOrder', {name:localStorage.getItem('name'), room:localStorage.getItem('room')})
        }
    }

    const mixDeck = () => {
        socket.emit('mixDeck', {room: localStorage.getItem('room')} )
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
            <button onClick={mixDeck} type="button">mix deck</button>
            <button onClick={changeOrder} className={socket.id == currentUserOrder ? 'green': 'common'} type="button">end move</button>
        </div>
    )
}

export default RoomMenu