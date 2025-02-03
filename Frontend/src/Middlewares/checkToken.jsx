
import { logout } from "../redux/Slices/Authslice";


export const checkTokenExpirationMiddleware = (store) => (next) => (action) => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  
    if (token) {
      // Decode and check if token is expired
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
  
        console.log("Checking token expiration...");
        if (decodedToken.exp < currentTime) {
        console.log("Token expired. Dispatching logout.");
        store.dispatch(logout());
        alert('Your session has expired. Please log in again.');
        }
    }
  
    return next(action);
  };