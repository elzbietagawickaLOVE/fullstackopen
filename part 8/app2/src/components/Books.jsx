import { useQuery } from '@apollo/client'
import { set } from 'mongoose'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries/queries'
import { useApolloClient } from '@apollo/client'


const Books = ({ result }) => {
    const client = useApolloClient()
    if (result.loading) {
      return <div>loading...</div>
    }

    const [genre, setGenre] = useState('')

    const onlyUnique = (value, index, self) => {
      return self.indexOf(value) === index
    }

    const [filteredBooks, setFilteredBooks] = useState(result.data.allBooks)

    useEffect(() => {
      setGenre('')
    }
    , [result])

    useEffect(() => {
      async function fetchData() {
        await client.refetchQueries({query: ALL_BOOKS, variables: { genre }})
      }
      fetchData()
    }
    , [genre])

    const genres = result.data.allBooks.map(book => book.genres).flat().filter(onlyUnique)
    const books = result.data.allBooks
  
    return (
      <div>
        <h2>books</h2>
  
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                author
              </th>
              <th>
                published
              </th>
            </tr>
            {books.map(a => a.genres.includes(genre) || genre === '' ? <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr> : ''
            )}
          </tbody>
        </table>
        <button onClick={() => setGenre('')} key='all'>all</button>
        {genres.map(genre => <button onClick={() => setGenre(genre)} key={genre}>{genre}</button>)}
        
      </div>
    )
  }

  export default Books