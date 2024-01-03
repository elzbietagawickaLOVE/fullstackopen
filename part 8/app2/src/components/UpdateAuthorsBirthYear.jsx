import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries/queries.js'


const UpdateAuthorsBirthYear = ({ authors }) => {
    const [name, setName] = useState('')
    const [born, setBorn] = useState('')
    
    const [updateAuthor] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }]
    })
    const submit = async (event) => {
        event.preventDefault()
        updateAuthor({ variables: { name, born } })
    
        setName('')
        setBorn('')
    }
    
    return (
        <div>
        <h2>Set birthyear</h2>
    
        <form onSubmit={submit}>
            <div>
            name
            <select value={name} onChange={({ target }) => setName(target.value)}>
                <option value=''>Select author</option>
                {authors.data.allAuthors.map(a =>
                <option key={a.name} value={a.name}>{a.name}</option>
                )}
            </select>
            </div>
    
            <div>
            born
            <input
                type='number'
                value={born}
                onChange={({ target }) => setBorn(parseInt(target.value))}
            />
            </div>
    
            <button type='submit'>update author</button>
        </form>
        </div>
    )
}
    
export default UpdateAuthorsBirthYear
