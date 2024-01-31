const matchCardToDesc = (prevCard, sentCard) => {
    if(prevCard.color == sentCard.color || prevCard.char == sentCard.char || sentCard.color == 'any' || prevCard.color == 'any'){
        return true
    }else{
        return false
    }
}

export default{
    matchCardToDesc,
}