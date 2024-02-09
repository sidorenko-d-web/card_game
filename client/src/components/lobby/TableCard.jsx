import React, { useEffect, useState } from 'react'

const TableCard = ({socket, prevCard, setPrevCard, changeColorModeStates, setMultiMove}) => {

    const changeColor = (color) => {
        if(prevCard.char == 'change color') socket.emit('changeColorCard', {room: localStorage.getItem('room'), color})

        else socket.emit('plus4Card', {room: localStorage.getItem('room'), color})

        changeColorModeStates.setChangeColorMode(false)
        setMultiMove(false)
    }


    useEffect(() => {
        socket.on('sendCardToTableResponse', (data) => {
            if(data.room === localStorage.getItem('room')){
                setPrevCard({color:data.color, char: data.char})
            }
        })
    },[socket])

    return (
        !changeColorModeStates.changeColorMode?<div className={'table-card '+prevCard.color} >{prevCard.char}</div>
        :
        <div className="change-color-card table-card">
            <div onClick={() => changeColor('red')} className="change-color-item red"></div>
            <div onClick={() => changeColor('green')} className="change-color-item green"></div>
            <div onClick={() => changeColor('blue')} className="change-color-item blue"></div>
            <div onClick={() => changeColor('yellow')} className="change-color-item yellow"></div>
        </div>
    )
}

export default TableCard