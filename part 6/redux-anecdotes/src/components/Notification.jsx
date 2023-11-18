import { useDispatch, useSelector } from "react-redux"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  const message = /*useSelector(message =>message.notification !== null ? (<div style={style}>{message.notification}</div>) : '')*/'doris'
  return (
    <>
    {message}
    </>
  )
}

export default Notification