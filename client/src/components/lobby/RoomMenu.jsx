import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cardRuleChecker from './cardRuleChecker'
import UnoButton from './UnoButton'

const RoomMenu = ({ socket, moveRuleStates, prevCard }) => {
    const navigate = useNavigate()
    const [readyStatus, setReadyStatus] = useState(false)
    const [readyUsers, setReadyUsers] = useState('0')

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
        if(!readyStatus){
            socket.emit('getReadyUser', {room: localStorage.getItem('room'), type:'startReady'})
            setReadyStatus(true)
        }
    }

    

    useEffect(() =>{
        window.onpopstate = () => {
            socket.emit('leaveRoom', {name:localStorage.getItem('name'), room:localStorage.getItem('room')})
            navigate('/')
            socket.emit('getRooms')
        }
    })

    useEffect(() => {
        socket.on('getReadyUserResponse', (data) => {
            if (data.type == 'startReady'){
                setReadyUsers(data.readyUsers)
            } else if (data.type == 'start'){
                setReadyUsers('-none')
                setReadyStatus(false)
            }
        })
    })
 

    return (
        <div className='room-menu'>
            <button onClick={handleLeave} type="button">Leave the room</button>
            <button onClick={getReady} className={'common status-btn'+ readyUsers}type="button">getReady</button>
            <button onClick={changeOrder} className={socket.id == moveRuleStates.currentUserOrder ? 'green': 'common'} type="button">end move</button>
            <UnoButton socket={socket}/>
        </div>
    )
}

export default RoomMenu