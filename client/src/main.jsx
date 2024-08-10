import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter as Router} from 'react-router-dom'
import io from 'socket.io-client'
console.log(import.meta.env.VITE_API_URL)

const socket = io.connect(import.meta.env.VITE_API_URL)


ReactDOM.createRoot(document.getElementById('root')).render(
  
    <Router>
      <App socket={socket}/>
    </Router>
  
)
 