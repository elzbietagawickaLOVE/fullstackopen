import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const blogFormRef = useRef()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState({
    message: '',
    status: 0
  })

  const blogLike = blogToLike => {
    blogToLike.likes = blogToLike.likes + 1
    blogToLike.user = blogToLike.user.id
    blogService.update(blogToLike.id, blogToLike).then(response => {
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    })

  }

  const removeBlog = blogToRemove => {
    if(confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.user.username}`))
      blogService.remove(blogToRemove.id).then(() => setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id)))

  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({ message: 'wrong username or password', status: 0 })
      setTimeout(() => {
        setNotification({
          message: '',
          status: 0
        })
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const createBlog = someBlog => {
    const blogObject = {
      url: someBlog.url,
      title: someBlog.title,
      like: 0,
      user: user.id
    }
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(response => {
        setBlogs(blogs.concat(response))
        setNotification({ message: `a new blog ${response.title} by ${user.name} added`, status: 1 })
        setTimeout(() => {
          setNotification({
            message: '',
            status: 0
          })
        }, 5000)
      })
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

  const blogForm = () => (
    <>
      <p>{user.name} logged in <button onClick={logout}>logout</button></p>
      {blogs.map(blog =>
        <Blog key={blog.id} user={user} blog={blog} blogLike={blogLike} removeBlog={removeBlog} />
      )}
      <Togglable buttonLabel='add blog' ref={blogFormRef}>

        <BlogForm createBlog={createBlog} />
      </Togglable>
    </>
  )

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
  }
  return (
    <div>
      <Notification message={notification.message} status={notification.status} />
      <h2>blogs</h2>
      {user === null ?
        loginForm() :
        blogForm()
      }
    </div>
  )
}

export default App