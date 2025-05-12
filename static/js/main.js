import { authenticate } from "./auth.js";

document.addEventListener('DOMContentLoaded', function() {
  login()
});

const renderLoginPage = () => {
  document.body.innerHTML = `
    <div class="login-container">
      <form id="loginForm">
        <h2>Hi, Welcome Back</h2>
        <div class="form-group">
          <label for="identifier">Username or Email</label>
          <input type="text" id="identifier" placeholder="Enter your username or email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" required>
        </div>
        <button type="submit" class="login-button">Login</button>
        <p id="error" class="error-message"></p>
      </form>
    </div>
  `
}

  const login = () => {
    renderLoginPage()
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const identifier = document.getElementById('identifier').value;
      const password = document.getElementById('password').value;
      
      try {
        const res = await fetch("https://learn.zone01kisumu.ke/api/auth/signin", {
          method: 'POST',
          headers: {
            "Authorization": `Basic ${btoa(`${identifier}:${password}`)}`,
            "Content-Type": "application/json",
          }
        });
  
        if (!res.ok) {
          const errorData = await res.json();
          errorElement.textContent = errorData.message || 'Invalid credentials';
          return;
        }
  
        const token = await res.json();
        localStorage.setItem('jwt', token);
        authenticate();
      } catch (err) {
        document.getElementById('error').textContent = 'An error occurred';
      }
    });
  }