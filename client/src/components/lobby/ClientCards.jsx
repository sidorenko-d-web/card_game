import React, { useEffect, useState } from "react";
import ClientCard from "./ClientCard";

const ClientCards = ({ socket, moveRuleStates, prevCard, setChangeColorMode }) => {
    
    const [clientCards, setClientCards] = useState([]);
    const [amountOfClientCards, setAmountOfClientCards] = useState([]);
    const [unoCardState, setUnoCardState] = useState(false)
    

    let numberOfClientCards = 0;

    const checkWinSituation = () => {
        if(numberOfClientCards == 0){
            socket.emit('getUserWin', ({
                room:localStorage.getItem('room'), 
                winner: localStorage.getItem('name')
            }))
        }
    }

    const changeNumberOfClientCards = () => {
        if (numberOfClientCards >= 7) {
            setAmountOfClientCards("many");
        } else {
            setAmountOfClientCards("normal");
        }
    }

    let addCard = (data) => {
        console.log('a')
        setClientCards((current) => [...current, data]);
        numberOfClientCards += 1;
        changeNumberOfClientCards()
    };

    let deleteCard = (index) => {
        const otherCards = clientCards;
        otherCards.splice(index, 1);
        setClientCards([...otherCards]);
        numberOfClientCards = clientCards.length
        changeNumberOfClientCards()
        checkWinSituation()
    };

    useEffect(() => {
        socket.on("getCardFromDeckResponse", (data) => addCard(data));
        socket.on("restartCards", () => setClientCards([]));
    }, [socket]);

    return (
        <div className={"cardsList " + amountOfClientCards}>
            {clientCards.map((elem, index) => (
                <ClientCard
                    currentUserOrder={moveRuleStates.currentUserOrder}
                    multiMove={moveRuleStates.multiMove}
                    setMultiMove={moveRuleStates.setMultiMove}
                    key={index}
                    index={index}
                    color={elem.color}
                    char={elem.char}
                    socket={socket}
                    deleteCard={deleteCard}
                    prevCard={prevCard}
                    setChangeColorMode={setChangeColorMode}
                />
            ))}
        </div>
    );
};

export default ClientCards;
