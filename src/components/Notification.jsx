import React from 'react'

const Notification = ({notifications, setNotifications}) => {
  return (
    <>
        <div className="notifications-holder">
            <div className="notification error">
                <span>13</span> Uploads Failed
            </div>
            <div className="notification success">
                <span>99</span> Uploads Successful
            </div>
        </div>
    </>
  )
}

export default Notification