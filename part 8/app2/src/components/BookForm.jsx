import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { ALL_BOOKS, CREATE_BOOK } from '../queries/queries.js'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries/queries.js'
import { updateCache } from '../App.jsx'


const BookForm = () => {
    const [ createBook ] = useMutation(CREATE_BOOK , {
        refetchQueries: [  { query: ALL_BOOKS } ],
        onError: (error) => {
            const messages = error.graphQLErrors.map((error) => error.message).join('\n')
            console.log(messages)
        },
        update: (cache, response) => {
            updateCache(cache, {query: ALL_BOOKS}, response.data.addBook)
        }

    })

    const [title, setTitle] = useState('')
    const [author, setAuhtor] = useState('')
    const [published, setPublished] = useState('')
    const [genre, setGenre] = useState('')
    const [genres, setGenres] = useState([])

    const submit = async (event) => {
        event.preventDefault()

        createBook({  variables: { title, author, published, genres } })

        setTitle('')
        setPublished('')
        setAuhtor('')
        setGenres([])
        setGenre('')
    }

    const addGenre = () => {
        setGenres(genres.concat(genre))
        setGenre('')
    }

    return (
        <div>
        <form onSubmit={submit}>
            <div>
            title
            <input
                value={title}
                onChange={({ target }) => setTitle(target.value)}
            />
            </div>
            <div>
            author
            <input
                value={author}
                onChange={({ target }) => setAuhtor(target.value)}
            />
            </div>
            <div>
            published
            <input
                type='number'
                value={published}
                onChange={({ target }) => setPublished(parseInt(target.value))}
            />
            </div>
            <div>
            <input
                value={genre}
                onChange={({ target }) => setGenre(target.value)}
            />
            <button onClick={addGenre} type="button">add genre</button>
            </div>
            <div>
            genres: {genres.join(' ')}
            </div>
            <button type='submit'>create book</button>
        </form>
        </div>
    )
}

export default BookForm