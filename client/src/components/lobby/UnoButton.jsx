import React, { useState } from 'react'

const UnoButton = ({socket}) => {
    const [buttonAccessState, setButtonAccessState] = useState(true)

    const unoBtn = () => {
       if (buttonAccessState) {
            setButtonAccessState(false)
            setTimeout(() => {
                setButtonAccessState(true)
            }, 5000)
            socket.emit('unoBtn', {name:localStorage.getItem('name'), room:localStorage.getItem('room')})
       }
    }

    return (
        <button onClick={unoBtn} className={buttonAccessState?'green':'uno-btn-reload'}>Uno</button>
    )
}

export default UnoButton