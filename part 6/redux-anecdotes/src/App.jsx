import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './services/requests'
import NotificationContext from './contexts/NotificationContext'
import { useContext } from 'react'

const Notification = () => {
  const [notification, setNotification] = useContext(NotificationContext)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  const message = notification !== '' ? (<div style={style}>{notification}</div>) : ''
  return (
    <>
    {message}
    </>
  )
}

const App = () => {
  const queryClient = useQueryClient()

  const [notification, setNotification] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) 
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
   },
   onError: (error) => {
      setNotification({type: 'notification/setNotification', payload: error.message})
    }
  })

  const updateAnecdoteMutation = useMutation({ 
    mutationFn: updateAnecdote, 
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes') 
      
    }
  })

  const notificationLifeCycle = (text) => {
    setNotification({type: 'notification/setNotification', payload: text})
    setTimeout(() => {
      setNotification({type: 'notification/clearNotification', payload: ''})
    }, 5000)
  }
  const voteForAnecdote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    notificationLifeCycle(`you voted '${anecdote.content}'`)
  }

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.content.value
    event.target.content.value = ''
    newAnecdoteMutation.mutate(content)
    notificationLifeCycle(`you added '${content}'`)
  }
  
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })
  
  if (result.isLoading) return <div>loading data...</div>

  if (result.isError) return <div>Error</div>

  const anecdotes = result.data

  return (
    <NotificationContext.Provider value={[notification, setNotification]}>
      <Notification />
      <form onSubmit={addAnecdote}>
        <input name="content"/>
        <button type="submit">add</button>
      </form>
      {anecdotes.map(anecdote => <div key={anecdote.id}>{anecdote.content} - {anecdote.votes}<button onClick={() => voteForAnecdote(anecdote)}>vote</button></div>)}
    </NotificationContext.Provider>)
  }

export default App