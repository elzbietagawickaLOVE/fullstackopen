import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, ME } from './queries/queries'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import Books from './components/Books'
import Authors from './components/Authors'
import BookForm from './components/BookForm'
import LoginForm from './components/LoginForm'

import UpdateAuthorsBirthYear from './components/UpdateAuthorsBirthYear'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import Recommend from './components/Recommend'


export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      return seen.has(item.name) ? false : seen.add(item.name)
    })
  }

  cache.updateQuery({ query }, (data) => {
    return {
      allBooks: [...data.allBooks, addedBook],

    }
  }
  )
}
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('authorization'))
  const client = useApolloClient()
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log('subscriptionData', data)
      const addedBook = data.data.bookAdded
      updateCache(client.cache, {query: ALL_BOOKS}, addedBook)
    }
  })

  const resultUser = useQuery(ME,
    { pollInterval: 2000 })

  const resultAuthors = useQuery(ALL_AUTHORS,
    { pollInterval: 2000 })

  const resultBooks = useQuery(ALL_BOOKS,
    { pollInterval: 2000 })
  
  if (resultAuthors.loading || resultBooks.loading || resultUser.loading) {
    return <div>loading...</div>
  }
  
  return(
    <Router>
      <div>
        <Link to='/'>authors</Link>{' '}
        <Link to='/books'>books</Link>{' '}
        {token ? <Link to='/addbook'>add book</Link> : ''}{' '}
        {token ? <Link to='/updateauthor'>update author</Link> : ''}{' '}
        {token ? <Link to='/recommend'>recommend</Link> : ''}{' '}
        {token ? <button onClick={logout}>logout</button> : <Link to='/login'>login</Link>}{'  '}
      </div>
      <Routes>
        <Route path='/' element={<Authors result={resultAuthors} />} />
        <Route path='/books' element={<Books result={resultBooks} />} />
        <Route path='/addbook' element={<BookForm  />} />
        <Route path='/login' element={<LoginForm setToken={setToken} />} />
        <Route path='/updateauthor' element={<UpdateAuthorsBirthYear authors={resultAuthors} />} />
        <Route path='/recommend' element={<Recommend booksResult={resultBooks} userResult={resultUser} />} />
      </Routes>
    </Router>
  )
}

export default App
