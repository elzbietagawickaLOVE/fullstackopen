describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }

    const user2 = {
      name: 'Sylwia',
      username: 'mluukkai2',
      password: 'salainen2'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user2)
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('blogs')
    cy.contains('login')
  })

  it('login form can be opened', function() {
    cy.contains('login').click()
  })

  it('login fails with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login').click()

    cy.get('.error')
    .should('contain', 'wrong username or password') 
    .and('have.css', 'color', 'rgb(216, 52, 47)')
    .and('have.css', 'border-style', 'solid')

    cy.contains('Matti Luukkainen logged in').should('not.exist')
  })

  it('user can login', function () {
    cy.contains('login').click()
     cy.get('#username').type('mluukkai')
     cy.get('#password').type('salainen')
     cy.get('#login').click()

     cy.contains('Matti Luukkainen logged in')
  })  

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.createBlog({ title: 'doris', url: 'ńe'})
      cy.createBlog({ title: 'tom', url: 'ńe3'})
      cy.createBlog({ title: 'łuki', url: 'ńe2'})
    })

    it('A blog can be created', function () {
        cy.contains('add blog').click()
        cy.get('input:first').type('another note cypress')
        cy.get('#url').type('doris')
        cy.contains('save').click()
    })

    it('A blog can be liked', function () {
      cy.contains('like').click()

      cy.contains('show more').click()

      cy.contains('likes: 1')
    })

    it('A blog can be deleted', function () {
      cy.contains('remove blog').click()
      cy.contains('doris').should('not.exist')
    })

    it('no one else can delete blog', function () {
      cy.contains('logout').click()
      cy.contains('show login').click()
      cy.get('#username').type('mluukkai2')
      cy.get('#password').type('salainen2')
      cy.get('#login').click()

     cy.contains('remove blog').should('not.exist')
    })

    it('most liked blog is first', async function () {

      cy.get('.likeButton').eq(1).click()
      cy.wait(1000)
      cy.get('.likeButton').eq(2).click()
      cy.wait(1000)
      cy.get('.likeButton').eq(1).click()
      cy.wait(1000)
      cy.get('.likeButton').eq(2).click()
      cy.wait(1000)
      cy.get('.likeButton').eq(0).click()
      cy.wait(1000)
      cy.get('.likeButton').eq(2).click()
      cy.wait(1000)
      cy.get('.blog').eq(0).should('contain', 'łuki')
    })
  })
})