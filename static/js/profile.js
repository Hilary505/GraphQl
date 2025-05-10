import { authenicate } from "./auth.js";

export const profile = (data) => {
    document.head.innerHTML = "";
    document.head.innerHTML = `
        <meta charset="UTF-8">
        <title>Your Profile</title>
        <link rel="stylesheet" href="static/css/profile.css">
    `
    document.body.innerHTML = "";
    document.body.innerHTML = `
        <h1>Your Profile</h1>
        <button id="logout">Logout</button>
        <div id="profile"></div>

        <script type="module" src="auth.js"></script>
    `

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('jwt');
        ;
      });
   console.log("hereeeeeeeeeeeeeee")
   details(data)
}

const details = (data) => {
    console.log(data)
      const user = data.data.user[0];
      const profile = document.getElementById('profile');
      profile.innerHTML = `
        <p><strong>Login:</strong> ${user.login}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Total XP:</strong> ${user.totalUp}</p>
        <h3>Skills</h3>
      `;
      console.log('doneeeeeeeeeeeeee')
}
