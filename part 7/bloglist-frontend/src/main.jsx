import ReactDOM from 'react-dom/client'
import App from './App'
import  './index.css'
import { configureStore } from '@reduxjs/toolkit'
import { NotificationProvider } from './contexts/notificationContext'
import  blogReducer  from './reducers/blogReducer'
import blogService from './services/blogs'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from 'react-query'
import userReducer from './reducers/userReducer'

const store = configureStore({
    reducer: {
        blogs: blogReducer,
        user: userReducer
    }
})

const queryClient = new QueryClient()

const initialState = async () => {
    const response = await blogService.getAll()
    store.dispatch({ type: 'blogs/setBlogs', payload: response })
}

initialState()

ReactDOM.createRoot(document.getElementById('root')).render(<QueryClientProvider client={queryClient}><NotificationProvider><Provider store={store}><App  /></Provider></NotificationProvider></QueryClientProvider>)