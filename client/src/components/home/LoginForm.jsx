import React, {useState} from 'react'

const LoginForm = ({handleLogin}) => {
    const [name, setName] = useState('name')
    const [room, setRoom] = useState('room')


    const login = (e) => {
        if(!(name === '' && name === '')){
            localStorage.setItem('name', name)
            localStorage.setItem('room', room)
            handleLogin(e, name, room)
        }else{

        }
    }   

    return (
        <form>
            <div className="inputs">
                <label htmlFor="name">Enter your name
                    <input type="text" id='name' onChange={(e) => setName(e.target.value)} value={name} autoComplete='on'/>
                </label>
                <label htmlFor="room">Enter name of the room
                    <input type="text" id='room' onChange={(e) => setRoom(e.target.value)} value={room} autoComplete='on'/>
                </label>
            </div>
            <button type='button' onClick={login}>Login</button>
        </form>
    )
}

export default LoginForm