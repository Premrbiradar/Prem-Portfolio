import axios from 'axios';

// In dev, the Vite proxy forwards /api to the Express server. In production,
// set VITE_API_URL to the deployed backend's URL.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true, // sends the http-only admin auth cookie
});

export default api;
