const testingRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Post.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter