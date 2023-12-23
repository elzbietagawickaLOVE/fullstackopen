import { useState, useEffect, useRef, useReducer } from 'react'
import { useDispatch } from 'react-redux'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import { likeBlog } from './reducers/blogReducer'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { BrowserRouter as Router, Routes } from 'react-router-dom'
import { deleteBlog } from './reducers/blogReducer'
import NotificationContext from './contexts/notificationContext'
import { useContext } from 'react'
import { addBlog } from './reducers/blogReducer'
import { useSelector } from 'react-redux'
import { Route } from 'react-router-dom'
import usersService from './services/users'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const App = () => {
  const [notification, setNotification] = useContext(NotificationContext)
  const blogFormRef = useRef()
  const blogs = useSelector(state => state.blogs)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: 'user/setUser', payload: user })
      blogService.setToken(user.token)
      
    }

    usersService.getAll().then(users =>
      setUsers(users))

  }, [])
  
  const notificationLifeCycle = (text, ms) => {
    setNotification({ type: 'notification/setNotification', payload: text})
    setTimeout(() => {
      setNotification({ type: 'notification/clearNotification', payload: '' })
    }, ms * 1000)
  }

  const blogLike = blogToLike => {
    let newBlog = { ...blogToLike}
    newBlog.likes = newBlog.likes + 1
    newBlog.user = newBlog.user.id
    dispatch(likeBlog(newBlog.id, newBlog))
  }
  
  const removeBlog = blogToRemove => {
    if(confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.user.username}`)) {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        dispatch({ type: 'user/setUser', payload: user })
        blogService.setToken(user.token)
      }

      dispatch(deleteBlog(blogToRemove.id))
    }
      
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch({ type: 'user/setUser', payload: user })
      setUsername('')
      setPassword('')
    } catch (exception) {
      notificationLifeCycle('wrong credentials', 5)
    }
  }
  
  const createBlog = someBlog => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: 'user/setUser', payload: user })
      blogService.setToken(user.token)
    }

    const blogObject = {
      url: someBlog.url,
      title: someBlog.title,
      like: 0,
      user: user.id
    }
    blogFormRef.current.toggleVisibility()
    
    dispatch(addBlog(blogObject))

    notificationLifeCycle(`a new blog ${blogObject.title} by ${user.name} added`, 5)
  }

  const loginForm = () => (
    <Togglable buttonLabel='show login'>
      <LoginForm
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    </Togglable>
  )
  const Home = () => (
    <>
    <div className='mx-auto w-fit	flex flex-col	 flex-nowrap'>
      {blogs.map(blog =>
        <div className='underline text-center	text-4xl p-2'><Link key={blog.id} to={`/blogs/${blog.id}`}>{blog.title}</Link></div>
      )}
    </div>
    <div className='mx-auto w-fit mt-5'>
    <Togglable buttonLabel='add blog' ref={blogFormRef}>

      <BlogForm createBlog={createBlog} />
    </Togglable>
    </div>
  </>
  )

  const Users = () => (
    <div className='mx-auto w-fit	'>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

  const User = () => {
    const id = useParams().id
    const user = users.find(user => user.id === id)
    if(!user) return null
    return (
      <div>
        <h2>{user.name}</h2>
        <h3>added blogs</h3>
        <ul>
          {user.blogs.map(blog =>
            <li key={blog.id}>{blog.title}</li>
          )}
        </ul>
      </div>
    )
  }
  const blogForm = () => (
    <Router>
      <div className='p-2 max-w flex space-x-4 content-start	flex-row flex-nowrap	justify-end'>
        <Link to="/" className='shadow modern-gradient1 p-5 font-medium'>HOME</Link>
        <Link to="/users" className='shadow bg-[#520063] p-5 font-medium'>USERS</Link>
        <div className='shadow bg-[#520063] p-5 font-medium'>{user.name} LOGGED IN</div>
        <button className='font-semibold shadow modern-gradient p-5' onClick={logout}>LOGOUT</button>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<Blog blogLike={blogLike} removeBlog={removeBlog} />} />
      </Routes>
    </Router>
  )

  const logout = () => {
    window.localStorage.clear()
    dispatch({ type: 'user/setUser', payload: null })
  }

  return (
    <NotificationContext.Provider value={[notification, setNotification]}>
      <Notification />
      {user === null ?
        loginForm() :
        blogForm()
      }
    </NotificationContext.Provider>
  )
}

export default App