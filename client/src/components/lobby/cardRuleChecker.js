const matchCardToDesc = (prevCard, sentCard, multiMove) => {
   if(multiMove){
        if(prevCard.color == sentCard.color && prevCard.char == sentCard.char){
            return true
        }else{
            return false
        }
   }else{
        if(prevCard.color == sentCard.color || prevCard.char == sentCard.char || sentCard.color == 'any' || prevCard.color == 'any'){
            return true
        }else{
            return false
        }
   }
}

const cardInteraction = (sentCard, socket, room, mode) => {
    if(isNaN(Number(sentCard.char)) && mode != 'checkChangeColor'){
        switch (sentCard.char) {
            case 'stop':
                stopCard(socket, room)
                break;
            case 'reverse':
                reverseCard(socket, room)
                break;
            case 'plus2':
                plus2Card(socket, room)
                break;
        }
    }   
    else if(sentCard.char == 'change color'){
        return 'changeColor';
        
    }
    else if(sentCard.char == 'plus4'){
        return 'plus4'
    }
    else{
        socket.emit('changeOrder', {room})
    }


    
}

const reverseCard = (socket, room) => {
    socket.emit('reverseCardInteraction', {room})
}


const stopCard = (socket, room) => {
    socket.emit('stopCardInteraction', {room})
}

const plus2Card = (socket, room) => {
    socket.emit('plus2Card', {room})
}

export default{
    matchCardToDesc,
    cardInteraction
}