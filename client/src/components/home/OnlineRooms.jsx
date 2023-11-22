import React from 'react'

const OnlineRooms = ( {rooms} ) => {//displays all room names
    

    return (
        <>
            <div className='onlineRooms'>
                <h4>Online rooms</h4>
                {
                    rooms && rooms != [] && rooms.map((elem, index) => (
                        <div key={index} className="room">
                            {elem.name}
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default OnlineRooms