import { showAudits } from './audit.js';


export const profile = (data) => {
    document.head.innerHTML = "";
    document.head.innerHTML = `
        <meta charset="UTF-8">
        <title>Your Profile</title>
        <link rel="stylesheet" href="static/css/profile.css">
    `
    document.body.innerHTML = "";
    document.body.innerHTML = `
        <h1>Welcome to your Dashboard</h1>
        <button id="logout">Logout</button>
        <div id="profile"></div>

        <script type="module" src="auth.js"></script>
    `
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('jwt');
        window.location.href = 'index.html';
      });
   details(data)
}
``
const details = (data) => {
  const user = data.data.user[0];
  const profile = document.getElementById('profile');
  profile.innerHTML = `
    <div class="profile-info">
      <img src="" alt="" class="profile-pic">
      <div class="profile-details">
        <p><strong>Login:</strong> ${user.login}</p>
        <p><strong>Email:</strong> ${user.email}</p>
         <p><strong>Campus:</strong> ${user.campus}</p>
      </div>
    </div>
  `;
  showAudits(user.audits);

};