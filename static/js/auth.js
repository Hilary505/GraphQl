import { getProfileQuery } from './queries.js';
import { initializeDashboard } from './dashboard.js';

export const authenticate = () => {
  const token = localStorage.getItem('jwt');
  console.log(token)
  if (!token) {
    console.log("No token found");
    return;
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
      initializeDashboard(data); 
    })
    .catch(err => {
      console.error("Fetch error:", err);
    });
    console.log("auth.js loaded")
};