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

export default{
    matchCardToDesc,
}