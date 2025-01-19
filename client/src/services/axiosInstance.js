import axios from 'axios';
import { apiUrl } from '../config/envConfig';
console.log('apiUrl: ', apiUrl);

const axiosInstance = axios.create({
  baseURL: apiUrl || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

export default axiosInstance;
