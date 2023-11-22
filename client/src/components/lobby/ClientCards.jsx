import React, { useEffect, useState } from 'react'
import ClientCard from './ClientCard'

const ClientCards = ({socket}) => {
    
    const [clientCards, setClientCards] = useState([])
    const [amountOfClientCards, setAmountOfClientCards] = useState([])
    let numberOfClientCards = 0

    let addCard = (data) => {
        setClientCards(current => [...current, data])
        numberOfClientCards+=1
        if(numberOfClientCards>7){
            setAmountOfClientCards('many')
        }else{

            setAmountOfClientCards('normal')
        }

        
    }

    useEffect(() => {
        socket.on('getCardFromDeckResponse', (data) => addCard(data))
        socket.on('clearClientCards', () => setClientCards([]))
    },[socket])

    return (
        <div className={'cardsList '+ amountOfClientCards}>
            {
                //clientCards.map((elem, index) => <div key={index} className={'card '+ elem.color}>{elem.char} </div>)
                    clientCards.map((elem, index) => <ClientCard key={index} color={elem.color} char={elem.char} socket={socket}/>)
            }
        </div>
    )
}

export default ClientCards