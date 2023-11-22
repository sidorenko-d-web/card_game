import React from 'react'

const ClientCard = (props) => {

    let sendCardToTable = () => {
        props.socket.emit('sendCardToTable', {color:props.color, char:props.char, room:localStorage.getItem('room')})
    }

  return (
    <div key={props.index} className={'card '+ props.color} onClick={sendCardToTable}>{props.char} </div>
  )
}

export default ClientCard