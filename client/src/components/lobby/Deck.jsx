import React, { useEffect, useState } from 'react'

const Deck = ({socket, currentUserOrder, multiMove}) => {

    const [deck, setDeck] = useState(108)

    let getCardFromDeck = () => {
        if(deck != 0 && !multiMove){
            if(socket.id == currentUserOrder){
                socket.emit('getCardFromDeck', {name: localStorage.getItem('name'), room: localStorage.getItem('room')})
            }else{
                console.log('failed order')
            }
        }
    }
    useEffect(() => {
        socket.on('changeNumOfCards', (data) => setDeck(data))
    },[socket])


    return (
        <div onClick={getCardFromDeck} className='deck'>{deck}</div>
    )
}

export default Deck