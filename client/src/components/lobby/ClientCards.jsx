import React, { useEffect, useState } from "react";
import ClientCard from "./ClientCard";

const ClientCards = ({ socket, currentUserOrder, prevCard }) => {
    
    const [clientCards, setClientCards] = useState([]);
    const [amountOfClientCards, setAmountOfClientCards] = useState([]);
    

    let numberOfClientCards = 0;

    let addCard = (data) => {
        setClientCards((current) => [...current, data]);
        numberOfClientCards += 1;
        if (numberOfClientCards > 7) {
            setAmountOfClientCards("many");
        } else {
            setAmountOfClientCards("normal");
        }
    };
    let deleteCard = (index) => {
        const otherCards = clientCards;
        otherCards.splice(index, 1);
        setClientCards([...otherCards]);
    };

    useEffect(() => {
        socket.on("getCardFromDeckResponse", (data) => addCard(data));
        socket.on("clearClientCards", () => setClientCards([]));
    }, [socket]);

    return (
        <div className={"cardsList " + amountOfClientCards}>
            {clientCards.map((elem, index) => (
                <ClientCard
                    currentUserOrder={currentUserOrder}
                    key={index}
                    index={index}
                    color={elem.color}
                    char={elem.char}
                    socket={socket}
                    deleteCard={deleteCard}
                    prevCard={prevCard}
                />
            ))}
        </div>
    );
};

export default ClientCards;
