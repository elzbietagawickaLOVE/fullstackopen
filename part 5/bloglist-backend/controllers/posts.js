const postsRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

postsRouter.get('/', async (request, response) => {
    const blogs = await Post.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})

postsRouter.get('/:id', async (request, response, next) => {
  const blog = await Post.findById(request.params.id)
  if(blog)
    response.json(blog)
  else
    response.status(404).end("not found")
})

postsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user

  if(body.title === undefined)
    return response.status(400).end("null")

  if(body.url === undefined)
    return response.status(400).end("null")

  if(body.likes === undefined)
    body.likes = 0

  const blog = new Post({
    title: body.title,
    user: user.id,
    url: body.url,
    likes: body.likes
  })

  let savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  savedBlog.user = user;
  response.status(201).json(savedBlog)
})

postsRouter.delete('/:id', async (request, response, next) => {
  const blog = await Post.findById(request.params.id)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
    
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user

  const blogsAuthor = await User.findById(blog.user)

  if (user.id === blogsAuthor.id) {
    await Post.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  
  response.status(400).end()
})

postsRouter.put('/:id', async (request, response, next) => {
  const blog = request.body

  const updatedBlog = await Post.findByIdAndUpdate(request.params.id, blog, { new: true })


  updatedBlog ? response.status(200).json(updatedBlog.toJSON()) : response.status(404).end()
})

module.exports = postsRouter