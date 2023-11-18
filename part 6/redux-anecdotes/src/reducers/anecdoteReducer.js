import { createSlice } from "@reduxjs/toolkit"
import anecdotesService from "../services/anecdotes"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      return state.concat(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})


export const { appendAnecdote} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch({type: 'anecdotes/setAnecdotes', payload: anecdotes})
  }
}

export const voteForAnecdote = (anecdote) => {
  console.log("DORIS")
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    const newAnecdote = {
      id: anecdote.id,
      content: anecdote.content,
      votes: anecdote.votes + 1
    } 
    console.log(newAnecdote)
    const updatedAnecdote = await anecdotesService.update(newAnecdote)
    const newAnecdotes = anecdotes.map(item => item.id !== updatedAnecdote.id ? item : updatedAnecdote)
    dispatch({type: 'anecdotes/setAnecdotes', payload: newAnecdotes})
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export default anecdoteSlice.reducer