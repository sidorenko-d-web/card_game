import React, { useEffect, useState } from 'react'
import userLogo from '../../sourses/Untitled.svg'

const OpponentCards = (props) => {

    let [cards, setCards] = useState(props.numCards)

    useEffect(() => {
        setCards(props.opponent.cards)
    }, [props.opponent])

    return (
        <>
        <div className="container">
            <h3 className='name'>{props.opponent.name}</h3>
            <img src={userLogo} />
            <div className="opponentCards">
                {cards>0&&[...Array(cards)].map((elem, index)=> <div key={index} className='card'>x</div>)}
            </div>
        </div>

        </>
    )
}

export default OpponentCards
