
import axios from 'axios';
import { toast } from 'react-hot-toast'; 


const axiosInstance = axios.create({
  baseURL: 'https://study-hub-backend-beta.vercel.app/api/v1/', 
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config) => {
    
    const { Store } = require('../redux/Store');
    const state = Store.getState();
    const token = state.auth?.user?.token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const { Store } = require('../redux/Store');
      Store.dispatch({ type: 'auth/logout' }); 
      toast.error('Session expired, please log in again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
