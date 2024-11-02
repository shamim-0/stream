import  { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.png'

const ProtectedRoute = ({ children }) => {
  const [isTokenValid, setIsTokenValid] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const validateToken = async () => {
      if (token) {
        try {
          const response = await axios.post('http://localhost:5000/validateToken', {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.data.valid) {
            setIsTokenValid(true);
          } else {
            localStorage.removeItem('token');
            setIsTokenValid(false);
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          setIsTokenValid(false);
        }
      } else {
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, []);

  if (isTokenValid === null) {
    return <div className="h-[100vh] flex justify-center items-center">
      <img src="https://www.davidkingsbury.co.uk/wp-content/uploads/2021/08/lg.ring-loading-gif.gif" alt="" />
    </div>;
  }

  return isTokenValid ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
