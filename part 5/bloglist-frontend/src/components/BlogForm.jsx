import { useState, useEffect, useRef } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    user: '',
    url: '',
    title: '',
    like: 0
  })

  const handleBlogTitleChange = event => {
    let blog = newBlog
    blog.title = event.target.value
    setNewBlog(blog)
  }

  const handleBlogUrlChange = event => {
    let blog = newBlog
    blog.url = event.target.value
    setNewBlog(blog)
  }
  
  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)

    setNewBlog({
      user: '',
      url: '',
      title: '',
      like: 0
    })
  }

  return(
  <>
    <form onSubmit={addBlog}>
      <label>title:</label>
      <input
        className="titleInput"
        onChange={handleBlogTitleChange}
      />
      <br />
      <label>url:</label>
      <input 
        id='url'
        className="urlInput"
        onChange={handleBlogUrlChange}
      />
      <br />
      <input type="submit" id='save' value='save' />
    </form>
  </>
)}


export default BlogForm