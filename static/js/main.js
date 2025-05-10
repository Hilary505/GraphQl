import { authenicate } from "./auth.js";

document.addEventListener('DOMContentLoaded', function() {
  login();
});

const page = () => {
  document.body.innerHTML = "";
  document.body.innerHTML = `
    <h1>Login</h1>
    <form id="loginForm">
      <input type="text" id="identifier" placeholder="UserName or Email"><br><br>
      <input type="password" id="password" placeholder="Password">
      <button type="submit">Login</button>
      <p id="error" style="color:red;"></p>
    </form>
  `
}

const login = () => {
  page();
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const identifier = document.getElementById('identifier').value;
      console.log(identifier);
      const password = document.getElementById('password').value;
      
    
      try {
        const res = await fetch('https://learn.zone01kisumu.ke/api/auth/signin', {
          method: 'POST',
          headers: {
            "Authorization": `Basic ${btoa(`${identifier}:${password}`)}`,
            "Content-Type": "application/json",
          }
        });
    
        if (!res.ok) {
          document.getElementById('error').textContent = 'Invalid credentials';
          return;
        }
    
        const token = await res.json();
        localStorage.setItem('jwt', token);
        authenicate();
      } catch (err) {
        document.getElementById('error').textContent = 'An error occurred';
      }
    });
}

  