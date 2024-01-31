import { Route, Routes } from "react-router-dom"

import Home from './components/home/Home'
import Lobby from './components/lobby/Lobby'



function App({socket}) {

  return (
    <Routes>
      <Route path='/' element={<Home socket={socket}/>} />
      <Route path='/Lobby' element={<Lobby socket={socket}/>} />
    </Routes>
  )
}

export default App
 