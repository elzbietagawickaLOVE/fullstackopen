  const mongoose = require('mongoose')
  const supertest = require('supertest')
  const app = require('../app')
  const helper = require('./test_helper')
  const api = supertest(app)
  const Blog = require('../models/post')
const { update } = require('lodash')

  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(blog => blog.save())

    await Promise.all(promiseArray)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

describe('when there is initially some blogs saved', () => {
    test('all notes are returned', async () => {
        const response = await api.get('/api/posts')
      
        expect(response.body).toHaveLength(helper.initialBlogs.length)
        })

    test('a specific post is within the returned notes', async () => {
        const response = await api.get('/api/posts')
        const titles = response.body.map(r => r.title)
        
        expect(titles).toContain('fdfds');
        })
})

describe('viewwing a specific blog', () => {
    test('succeeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb();
    
        const blogToView = blogsAtStart[0];
    
        const response = await api
            .get(`/api/posts/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
      
        response.toJSON()
        expect(response.title == 'wodacz')
        
        })

    test('fails with statuscode 404 if blog does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()

        await api
            .get(`/api/posts/${validNonexistingId}`)
            .expect(404)
        })

    test('fails with statuscode 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api
        .get(`/api/posts/${invalidId}`)
        .expect(400)
        })
})

describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            "title": "pussy hole",
            "author": "doriq",
            "url": "ńe",
            "likes": 6911
        }
      
        await api
          .post('/api/posts')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        const titles = blogsAtEnd.map(n => n.title)
        expect(titles).toContain(
          'pussy hole'
        )
      })
    
    test('blog without title is not added', async () => {
        const newBlog = {
            "likes": 6911
        }
      
        await api
          .post('/api/posts')
          .send(newBlog)
          .expect(400)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      })
})

describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
      
        await api
          .delete(`/api/posts/${blogToDelete.id}`)
          .expect(204)
      
        const blogsAtEnd = await helper.blogsInDb()
      
        expect(blogsAtEnd).toHaveLength(
          helper.initialBlogs.length - 1
        )
      
        const titles = blogsAtEnd.map(r => r.title)
      
        expect(titles).not.toContain(blogToDelete.title)
      })

    
})

describe('updating a blog', () => {
    test('can be updated with a valid body', async () => {
        const blogToUpdate = {
            'url': 'hej dziewczyny ania jestem ania do ruchania'
        }
        
        const blogs = await helper.blogsInDb()

        await api
            .put(`/api/posts/${blogs[0].id}`)
            .send(blogToUpdate)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlog = blogsAtEnd[0]
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
        expect(updatedBlog.url).toBe('hej dziewczyny ania jestem ania do ruchania')
        })
})

  test('property id is defined', async () => {
    const blogs = await helper.blogsInDb()

    expect(blogs[0]).toHaveProperty('id')
  })