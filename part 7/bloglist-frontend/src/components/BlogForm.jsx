import { useState, useEffect, useRef } from 'react'

const BlogForm = ({ createBlog }) => {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')

  const handleTitleChange = event => {
    setTitle(event.target.value)
  }

  const handleUrlChange = event => {
    setUrl(event.target.value)
  }
  
  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      url: url,
      title: title,
      likes: 0,
      user: ''
    })

    setUrl('')
    setTitle('')
  }

  return(
  <>
    <form onSubmit={addBlog}>
      <div className='mb-4 flex flex-row justify-evenly'>
      <label className='mr-4'>TITLE:</label>
      <input
        className="titleInput bg-[#666666] p-2 font-medium rounded-md shadow" 
        value={title}
        onChange={handleTitleChange}
      />
      </div>
      <div className='mb-4 flex flex-row justify-evenly'>
      <label className='mr-4'>URL:</label>
      <input 
        id='url'
        className="urlInput bg-[#666666] p-2 font-medium rounded-md float-right	shadow"
        value={url}
        onChange={handleUrlChange}
      />
      </div>
      <input className='bg-[#520063] p-2 font-medium' type="submit" id='save' value='SAVE' />
    </form>
  </>
)}


export default BlogForm