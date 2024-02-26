import React, { useEffect, useState } from 'react'

const WinnerAlert = ({ socket }) => {
    const [popupStatus, setPopupStatus] = useState(false)
    const [winner, setWinner] = useState('')
    const [readyUsers, setReadyUsers] = useState('0')
    const [readyStatus, setReadyStatus] = useState(false)


    const restart = () => {
        if(!readyStatus){
            setReadyStatus(true)
            socket.emit('getReadyUser', {room: localStorage.getItem('room'), type: 'restartReady'})
        }
    }

    useEffect(() => {
        socket.on('getUserWinResponse', (winner) => {
            setPopupStatus(true)
            setWinner(winner) 
        })

        socket.on('getReadyUserResponse', (data) => {
            if (data.type == 'restartReady'){
                setReadyUsers(data.readyUsers)
            } else if (data.type == 'start'){
                setReadyStatus(false)
                setPopupStatus(false)
                setReadyUsers('0')
            }
        })

    }, [socket])

    return (
        popupStatus && 
        <div id={readyUsers} className='winner-alert'>
            <h2>So the winner is {winner}!</h2>
            <button className={"restart-btn status-btn" + readyUsers} onClick={restart}>Restart</button>
        </div>
    )
}

export default WinnerAlert