import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import { addComment } from '../reducers/blogReducer'
import { useState } from 'react'

const Blog = ({ blogLike, removeBlog }) => {
  const dispatch = useDispatch()
  const id = useParams().id
  const blog = useSelector(state => state.blogs).find(blog => blog.id === id)
  const user = useSelector(state => state.user)
  const [comment, setComment] = useState('')
  let i = 0
  const handleCommentChange = event => {
    setComment(event.target.value)
  }

  const handleSubmit = event => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: 'user/setUser', payload: user })
      blogService.setToken(user.token)
    }

    event.preventDefault()
    dispatch(addComment(id, comment))
    setComment('')
  }

  if(!blog) return null

  return (
    <div className='blog'>
      <div>
        <h2>{blog.title}</h2>
        <p>{blog.author}</p>
        <p>{blog.url}</p>
        <p>{blog.likes} likes <button onClick={() => blogLike(blog)}>like</button></p>
        <p>added by {blog.user.name}</p>
        {user.username === blog.user.username ? <button onClick={() => removeBlog(blog)}>remove</button> : null}
        <p>comments</p>
        <form onSubmit={handleSubmit}>
          <input value={comment} onChange={handleCommentChange} />
          <button type='submit'>add comment</button>
        </form>
        <ul>
          {blog.comments.map(comment => <li key={++i}>{comment}</li>)}
        </ul>

      </div>
    </div>
  )
}

export default Blog