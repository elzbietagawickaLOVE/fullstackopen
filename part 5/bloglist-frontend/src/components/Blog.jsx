import Togglable from './Togglable'

const Blog = ({ blog, blogLike, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle} className='blog'>
      <div>
        <span>{blog.title}</span> <button className='likeButton' onClick={() => blogLike(blog)}>like</button>{ user.id === blog.user.id ? <button onClick={() => removeBlog(blog)}>remove blog</button> : ''}
        <Togglable buttonLabel='show more' >
          <br /><p>url:</p> {blog.url}
          <br /><p>likes:</p> {blog.likes}
          <br /><p>author:</p> {blog.user !== null ? blog.user.username : 'null' }
          <br />
        </Togglable>
      </div>

    </div>
  )}

export default Blog