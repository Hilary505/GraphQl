import { getProfileQuery } from './queries.js';
import { profile } from './profile.js';

export const authenicate = () => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    console.log("TOKEN ERRROR")
    return
  }
  
  fetch('https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: getProfileQuery })
  })
    .then(res => res.json())
    .then(data => {
      profile(data);
    })
    .catch(err => {
      console.error(err);
    });
    console.log("auth.js loaded")
}

