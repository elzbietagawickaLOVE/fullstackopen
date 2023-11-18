import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'notification/setNotification':
            return action.payload
        case 'notification/clearNotification':
            return ''
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useReducer(notificationReducer, '')

    return (
        <NotificationContext.Provider value={[notification, setNotification]}>
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext