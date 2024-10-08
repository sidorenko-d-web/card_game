import React, { useState, useEffect } from 'react'

import RoomMenu from './RoomMenu'
import './lobby.css'
import Opponents from './Opponents'
import Deck from './Deck'
import ClientCards from './ClientCards'
import TableCard from './TableCard'
import WinnerAlert from './WinnerAlert'

const Lobby = ({socket}) => {

    const [users, setUsers] = useState([])
    const [currentUserOrder, setcurrentUserOrder] = useState()
    const [prevCard, setPrevCard] = useState({color: 'any', char:'x'})
    const [multiMove, setMultiMove] = useState(false)
    const [changeColorMode, setChangeColorMode] = useState(false) 

    const updateUsersInRoom = (data) => { 
        setUsers(data)
    }

    
    useEffect( () => {
        socket.on('updateUsers', (data) =>  {
            updateUsersInRoom(data)
        })
        socket.on('changeOrderResponse', (user) => {
            setcurrentUserOrder(user)
        })
        socket.on('changeColorCardResponse', (color) => {
            setPrevCard({color, char:'change color'})
        })
        socket.on('restartCards', () => {
            setMultiMove(false)
            setChangeColorMode(false)
        })
    }, [socket])


    return (
        <main>
            <div className="game-field">
                <Deck socket={socket} currentUserOrder={currentUserOrder} multiMove={multiMove}/>
                <Opponents users={users} socket={socket}/>

                <ClientCards 
                    socket={socket} 
                    setChangeColorMode={setChangeColorMode} 
                    moveRuleStates={{currentUserOrder, multiMove, setMultiMove}} 
                    prevCard={prevCard}
                />

                <TableCard 
                    setMultiMove={setMultiMove} 
                    socket={socket} 
                    prevCard={prevCard} 
                    setPrevCard={setPrevCard} 
                    changeColorModeStates={{changeColorMode, setChangeColorMode}}/>
                <WinnerAlert socket={socket}/>
            </div>
            <div className="popups">
              
            </div>

            <RoomMenu 
                socket={socket}  
                moveRuleStates={{currentUserOrder, multiMove, setMultiMove}} 
                prevCard={prevCard}
            />
        </main>
    )
}

export default Lobby