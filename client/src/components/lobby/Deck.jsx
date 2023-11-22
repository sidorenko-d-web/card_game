import React, { useEffect, useState } from 'react'

const Deck = ({socket}) => {

    const [deck, setDeck] = useState(108)

    let getCardFromDeck = () => {
        socket.emit('getCardFromDeck',{name: localStorage.getItem('name'), room:localStorage.getItem('room')})
    }
    useEffect(() => {

        socket.on('changeNumOfCards', (data) => data.room === localStorage.getItem('room')&&setDeck(data.numOfCards))
    },[socket])


    return (
        <div onClick={getCardFromDeck} className='deck'>{deck}</div>
    )
}

export default Deck