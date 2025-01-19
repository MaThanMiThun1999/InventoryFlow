//src/services/axiosInstance.js
import axios from 'axios';
import { apiUrl } from '../config/envConfig';
console.log('apiUrl: ', apiUrl);

// Create an instance of axios with default configurations
const axiosInstance = axios.create({
  baseURL: apiUrl || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

export default axiosInstance;
