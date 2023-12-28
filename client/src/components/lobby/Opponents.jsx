import React, { useEffect, useState } from 'react'
import OpponentCards from './OpponentCards'

const Opponents = (props) => {

    const [opponents, setOpponents] = useState([])
    const [numberOfPlayers, setNumberOfPlayers] = useState('two')
    
    let updateUsers = (data) => {

        let usersToChange = data.users
        if(usersToChange.find(item => item === localStorage.getItem('name'))){
            while(String(usersToChange[0]) !== localStorage.getItem('name')){
                usersToChange.push(usersToChange[0])
                usersToChange.splice(0,1)
            }        

        }
        
        setOpponents(usersToChange)
        switch (props.users.length) {
            case 2 :
                setNumberOfPlayers('two') 
                return
            case 3 :
                setNumberOfPlayers('three') 
                return
            case 4 :
                setNumberOfPlayers('four') 
                return
        }
    } 

    props.socket.on('getUsersResponse', (data) => {
        updateUsers(data)
    })



    useEffect(() => updateUsers(props) ,[props.users])


    
    console.log(opponents)

    return (
        <div className={numberOfPlayers + "-players"}>
          {opponents.slice(1).map((opponent, index) => (
            <div className={`opponent`} key={index} id={index+1}>
              <OpponentCards
                opponent={opponent}
                number={index}
                socket={props.socket}
              />
            </div>
          ))}
        </div>
    )
}

export default Opponents