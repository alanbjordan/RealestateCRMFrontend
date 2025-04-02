// src/apiConfig.js

const isProduction = window.location.hostname.includes("netlify.app");

const API_BASE_URL = isProduction
  ? "https://amas-684e6c6cf352.herokuapp.com" // Heroku API for production
  : "http://127.0.0.1:5000"; // Local API for development

export const API_URLS = {
  SIGNIN: `${API_BASE_URL}/signin`,
  CLIENTS: `${API_BASE_URL}/clients`,
  CLIENT_SIGNIN: `${API_BASE_URL}/client-signin`,
  PROPERTIES: `${API_BASE_URL}/properties`,
  BUILDINGS: `${API_BASE_URL}/buildings`,
  UPLOAD: `${API_BASE_URL}/upload`, 
};

export default API_URLS;
