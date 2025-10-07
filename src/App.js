import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div class="container">
      <form id="login-form">
        <h2>Login</h2>
        <div class="form-group">
          <label>Email</label>
          <input type="email" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" required>
        </div>
        <button type="submit" class="btn">Login</button>
        <div class="toggle-link">
          Don't have an account? <a onclick="toggleForms()">Register</a>
        </div>
      </form>
    </div>
  );
}

export default App;
