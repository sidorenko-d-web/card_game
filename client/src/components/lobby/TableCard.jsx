import React, { useEffect, useState } from 'react'

const TableCard = ({socket, prevCard, setPrevCard}) => {


    useEffect(() => {
        socket.on('sendCardToTableResponse', (data) => {
            if(data.room === localStorage.getItem('room')){
                setPrevCard({color:data.color, char: data.char})
            }
        })
    },[socket])

    return (
        <div className={'table-card '+prevCard.color} >{prevCard.char}</div>
    )
}

export default TableCard