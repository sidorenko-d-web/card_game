import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter as Router} from 'react-router-dom'
import io from 'socket.io-client'

const socket = io.connect('https://card-game-4za7.onrender.com')


ReactDOM.createRoot(document.getElementById('root')).render(
  
    <Router>
      <App socket={socket}/>
    </Router>
  
)
 