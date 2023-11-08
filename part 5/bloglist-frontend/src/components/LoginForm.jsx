import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin, setUsername, setPassword }) => (
  <form onSubmit={handleLogin}>
    <div>
        username
      <input
        type="text"
        id='username'
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
        password
      <input
        type="password"
        id='password'
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <input 
      id='login'
      type="submit"
      value='login' />
      
  </form>
)

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
}
export default LoginForm