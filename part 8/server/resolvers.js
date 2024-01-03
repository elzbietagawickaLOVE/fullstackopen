const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')
const  dotenv  = require('dotenv')
const mongoose = require('mongoose')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { AuthenticationError, UserInputError } = require('apollo-server')
dotenv.config()


const resolvers = {
    Query: {
      authorCount: () => Author.collection.countDocuments(),
      bookCount: () => Book.collection.countDocuments(),
      allBooks: async (root, args) => {
          if (!args.author && !args.genre) {
              return await Book.find({})
          }
          if (args.author && !args.genre) {
              const author = await Author.findOne({ name: args.author })
              return Book.find({ author: author._id })
          }
          if (!args.author && args.genre) {
              return Book.find({ genres: { $in: [args.genre] } })
          }
          if (args.author && args.genre) {
            const author = await Author.findOne({ name: args.author })
              return Book.find({ genres: { $in: [args.genre] }, author: author._id  })
          }
      },
      allAuthors: async () => { return Author.find({}) },
      me: (root, args, context) => {
        return context.currentUser
      }
    },
    Author : {
      bookCount: async (root) => {
        return root.books.length
      }
    },
    Book: {
      author: async (root) => {
        let author = await Author.findById(root.author)
        return author
      }
    },
      Mutation: {
         addBook: async (root, args, context) => {
          if (!context) {
            throw new AuthenticationError('Not authenticated')
          }
          try {
            const bookId = new mongoose.Types.ObjectId()
            const authorId = new mongoose.Types.ObjectId()
            let author = await Author.findOne({ name: args.author })

            if (!author) {
            author = new Author({ name: args.author, _id: authorId })
            }

            author.books.push(bookId)
            await author.save()
            const book = new Book({ ...args, author: author._id, _id: bookId })
            await book.save()

          
            pubsub.publish('BOOK_ADDED', { bookAdded: book })
          
            return book
          } catch (error) {
            console.error('Error adding book:', error)
            throw new UserInputError('Saving book and author failed', {
              invalidArgs: args,
              error: error.message,
            });
          }
        },
          editAuthor: async (root, args, context) => {
            if (!context) {
              throw new GraphQLError('not authenticated')
            }
              try {
                await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo} )
              }
              catch(error) {
                throw new GraphQLError('Saving author failed', {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.name,
                    error
                  }
                })
              }
  
              return Author.findOne({ name: args.name })
          },
          createUser: async (root, args) => {
            const user = new User({ username: args.username })
        
            return user.save()
              .catch(error => {
                throw new GraphQLError('Creating the user failed', {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args.username,
                    error
                  }
                })
              })
          },
          login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
        
            if ( !user || args.password !== 'secret' ) {
              throw new GraphQLError('wrong credentials', {
                extensions: {
                  code: 'BAD_USER_INPUT'
                }
              })        
            }
        
            const userForToken = {
              username: user.username,
              id: user._id,
            }
        
            return { value: jwt.sign(userForToken, process.env.SECRET) }
          }
      },
      Subscription: {
        bookAdded: {
          subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        },
      },
      }
  

module.exports = resolvers