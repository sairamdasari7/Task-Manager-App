// src/api.js (or any other file where you configure Axios)

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // Set the base URL to your backend server
});

export default instance;
