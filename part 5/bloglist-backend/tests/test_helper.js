const Blog = require('../models/post')
const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const initialBlogs = [
    {
        "title": "wodacz",
        "author": "maksiu",
        "url": "do dupt",
        "likes": 69
    },
    {
        "title": "fdfds",
        "author": "fdsfds",
        "url": "dsffst",
        "likes": 6449
    }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}