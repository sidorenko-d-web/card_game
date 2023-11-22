import React, { useEffect, useState } from 'react'

const TableCard = ({socket}) => {

    const [cardParams, setCardParams] = useState({color:'any', char: 'x'})

    useEffect(() => {
        socket.on('sendCardToTableResponse', (data) => {
            if(data.room === localStorage.getItem('room')){
                setCardParams({color:data.color, char: data.char})
            }
        })
    },[socket])

    return (
        <div className={'table-card '+cardParams.color} >{cardParams.char}</div>
    )
}

export default TableCard