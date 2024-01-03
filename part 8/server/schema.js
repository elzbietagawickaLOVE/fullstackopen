const typeDefs = `
  type Query {
    authorCount: Int
    bookCount: Int
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Author {
    name: String!
    born: Int
    books: [Book!]!
    bookCount: Int
  }

  type Book {
    title: String!
    author: Author! 
    published: Int!
    genres: [String!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
      ): Book
    editAuthor(
        name: String!
        setBornTo: Int!
        ): Author
        createUser(
          username: String!
          favoriteGenre: String!
        ): User
        login(
          username: String!
          password: String!
        ): Token
    }

    type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }
    
    type Token {
      value: String!
    }

    type Subscription {
      bookAdded: Book!
    }

`

module.exports = typeDefs