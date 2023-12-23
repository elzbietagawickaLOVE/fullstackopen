import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        showNotification(state, action) {
             return action.payload
        },
        hideNotification(state, action) {
            return null
        }
    }
})

export const setNotification = (text, ms) => {
    return async dispatch => {
      dispatch({type: 'notification/showNotification', payload: text})
      setTimeout(() => {
        dispatch({type: 'notification/hideNotification'})
      }, ms*1000)
    }
  }

export default notificationSlice.reducer