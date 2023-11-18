import { useSelector, useDispatch } from 'react-redux'
import { voteForAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = ({anecdotesArray}) => {
  console.log(anecdotesArray)
  const anecdotes = anecdotesArray
  /*useSelector(({ filter, anecdotes }) => {

    if ( filter.replace(/\s/g, '') === '' ) {
      return [...anecdotes].sort((a, b) => b.votes - a.votes )
    }
    return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase())).sort((a, b) => b.votes - a.votes )
  })*/

  /*const dispatch = useDispatch()*/

  const vote = (anecdote) =>  {
    /*dispatch(voteForAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))*/
  }
  

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList