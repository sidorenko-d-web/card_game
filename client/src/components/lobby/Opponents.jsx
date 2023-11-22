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
        <div className={numberOfPlayers+'-players'}>
            <div className="opponent one">
                <OpponentCards opponent = {opponents[1]} number={1}  socket= {props.socket}/>
            </div>

            <div className="opponent two">

            </div>

            <div className="opponent three">

            </div>
        </div>
    )
}

export default Opponents