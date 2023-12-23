const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const uniqueValidator = require('mongoose-unique-validator')


usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs', { title: 1, url: 1 })
    response.json(users)
  })

module.exports = usersRouter