import { Route, Routes } from "react-router-dom"

import Home from './components/home/Home'
import Lobby from './components/lobby/Lobby'

import io from 'socket.io-client'
const socket = io.connect('http://localhost:8080')


function App() {

  return (
    <Routes>
      <Route path='/' element={<Home socket={socket}/>} />
      <Route path='/Lobby' element={<Lobby socket={socket}/>} />
    </Routes>
  )
}

export default App
