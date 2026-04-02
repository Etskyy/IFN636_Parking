import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://16.176.7.29:5001/api',
});

export default axiosInstance;