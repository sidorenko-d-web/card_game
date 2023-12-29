import React, { useEffect, useState } from 'react'
import userLogo from '../../sourses/Untitled.svg'

const OpponentCards = (props) => {

    let [cards, setCards] = useState(0) 
    
    
    
    let addCard = (name) => {
        if(name === props.opponent){
            setCards(cards => cards+1)
        }
    }

    let deleteCard = (name) => {
        if(name === props.opponent){
            setCards(cards => cards-1)
        }
    }


    useEffect(() => {
        props.socket.on('getCardFromDeckToOpponentResponse', name => addCard(name))

        props.socket.on('deleteCardFromOpponent', name => deleteCard(name) )
    },[props.socket])

    return (
        <>
        <div className="container">
            <h3 className='name'>{props.opponent ? props.opponent : 'Player ' + (props.number + 1)}</h3>
            <img src={userLogo} />
            <div className="opponentCards">
                {cards!=[]&&[...Array(cards)].map((elem, index)=> <div key={index} className='card'>x</div>)}
            </div>
        </div>

        </>
    )
}

export default OpponentCards
