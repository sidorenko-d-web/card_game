import React, { useEffect, useState } from 'react'

const WinnerAlert = ({ socket }) => {
    const [popupStatus, setPopupStatus] = useState('none')
    const [winner, setWinner] = useState('')
    const [readyUsers, setReadyUsers] = useState(0)

    const restart = () => {
        socket.emit('restartGame', {room: localStorage.getItem('room')})
    }

    useEffect(() => {
        socket.on('getUserWinResponse', (winner) => {
            setPopupStatus('winner-alert')
            setWinner(winner)
        })

    }, [socket])

    return (
        <div className={popupStatus} id={readyUsers}>
            <h2>So the winner is {winner}!</h2>
            <button className="restart-btn" onClick={restart}>Restart</button>
        </div>
    )
}

export default WinnerAlert