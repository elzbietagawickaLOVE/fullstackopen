import React, { useContext } from 'react'
import NotificationContext from '../contexts/notificationContext'

const Notification = () => {
    const [notification, setNotification] = useContext(NotificationContext)
  
    const style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1
    }
  
    const message = notification !== '' ? (<div style={style}>{notification}</div>) : ''
    return (
      <>
      {message}
      </>
    )
  }

  export default Notification