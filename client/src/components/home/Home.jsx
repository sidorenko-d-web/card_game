import React, { useState, useEffect } from 'react'
import "./home.css";
import { useNavigate } from 'react-router-dom';
import OnlineRooms from './OnlineRooms';
import LoginForm from './LoginForm';


const Home = ({ socket }) => {
    const [rooms, setRooms] = useState([])

    const navigate = useNavigate()

    const handleLogin = (e, name, room) => {
        e.preventDefault()
        socket.emit('login', { name, room })
    }


    useEffect(() => {
        socket.on('updateRoomsResponse', (data) => {
                setRooms(data)
        })

        socket.on('success', (success) => {
            if(success){
                navigate('/lobby')
            }else{
                localStorage.removeItem('name')
                localStorage.removeItem('room')
            }

        })
    }, [socket])

    
    
    
    return (
        <>
            <OnlineRooms rooms={rooms} />
            <LoginForm handleLogin={handleLogin}/>
        </>
    )
}

export default Home