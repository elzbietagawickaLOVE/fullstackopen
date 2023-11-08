import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/posts'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data.sort((a, b) => { return b.likes - a.likes}))
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  const response = await request
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const request = axios.delete(`${ baseUrl }/${id}`, config)
  const response = await request
  return response
}

export default { getAll, create, update, setToken, remove }