import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/users'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
    return response.data.sort((a, b) => { return b.blogs.length - a.blogs.length })
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