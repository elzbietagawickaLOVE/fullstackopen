import { createSlice } from "@reduxjs/toolkit"
import blogsService from "../services/blogs"

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        appendBlog(state, action) {
            if (state.find(blog => blog.id === action.payload.id)) {
                return state.map(blog => blog.id === action.payload.id ? action.payload : blog)
            }
            return state.concat(action.payload)
        },
        setBlogs(state, action) {
            return action.payload
        },
        removeBlog(state, action) {
            return state.filter(blog => blog.id !== action.payload)
        }
    }
})

export const { appendBlog, setBlogs } = blogSlice.actions

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogsService.getAll()
        console.log(blogs)
        dispatch({type: 'blogs/setBlogs', payload: blogs})
    }
}

export const addBlog = (blog) => {
    return async dispatch => {
        console.log(blog)
        const newBlog = await blogsService.create(blog)
        dispatch({type: 'blogs/appendBlog', payload: newBlog})
    }
}

export const addComment = (id, comment) => {
    return async dispatch => {
        const newComment = await blogsService.addComment(id, comment)
        dispatch({type: 'blogs/appendBlog', payload: newComment})
    }
}

export const deleteBlog = (id) => {
    return async dispatch => {
        await blogsService.remove(id).then(() => {
            dispatch({type: 'blogs/removeBlog', payload: id})
        })
    }
}

export const likeBlog = (id, blog) => {
    return async dispatch => {
        const updatedBlog = await blogsService.update(id, blog)
        dispatch({type: 'blogs/appendBlog', payload: updatedBlog})
    }
}

export default blogSlice.reducer