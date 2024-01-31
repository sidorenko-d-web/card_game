import React from "react";
import cardRuleChecker from './cardRuleChecker'

const ClientCard = (props) => {

    let sendCardToTable = () => {
        if(props.socket.id == props.currentUserOrder){
            if(cardRuleChecker.matchCardToDesc(props.prevCard, {color: props.color, char: props.char})){
                props.socket.emit("sendCardToTable", {
                    color: props.color,
                    char: props.char,
                    name: localStorage.getItem("name"),
                    room: localStorage.getItem("room"),
                });
                props.deleteCard(props.index);
            }else{
                console.log('wrong card')
            }
        }
        else{
            console.log('failed order')
        }
    };

    return (
        <div
            key={props.index}
            className={"card " + props.color}
            onClick={sendCardToTable}
        >
            {props.char}{" "}
        </div>
    );
};

export default ClientCard;
