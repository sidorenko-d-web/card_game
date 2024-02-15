import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cardRuleChecker from './cardRuleChecker'

const RoomMenu = ({ socket, moveRuleStates, prevCard }) => {
    const navigate = useNavigate()
    const [readyStatus, setReadyStatus] = useState(false)

    const handleLeave = () => {
        socket.emit('leaveRoom', { name: localStorage.getItem('name'), room: localStorage.getItem('room') })
        socket.emit('updateRooms')

        localStorage.removeItem('name')
        localStorage.removeItem('room')

        navigate('/')
    }

    const changeOrder = () => {
        if(socket.id == moveRuleStates.currentUserOrder && moveRuleStates.multiMove){
            moveRuleStates.setMultiMove(false)
            cardRuleChecker.cardInteraction(prevCard, socket, localStorage.getItem('room'), 'usualMode')
        }
    }

    const getReady = () => {
        socket.emit('getReadyUser', {room: localStorage.getItem('room')})
        setReadyStatus(true)
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
            <button onClick={getReady} className={readyStatus ? 'green' : 'common'} type="button">getReady</button>
            <button onClick={changeOrder} className={socket.id == moveRuleStates.currentUserOrder ? 'green': 'common'} type="button">end move</button>
        </div>
    )
}

export default RoomMenu