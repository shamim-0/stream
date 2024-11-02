// src/components/Login.jsx
import  { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../../assets/logo.png';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      localStorage.setItem('token', response.data.token);
      toast.success('Login Success')
      navigate('/dashboard');
    } catch (err) {
        toast.error('Invalid creadintial')
    }
  };

  return (
    <section className="flex justify-center items-center h-[100vh]">
      <div className="w-96 mx-auto shadow border-[1px] rounded  p-5">
        <div className="flex justify-center">
          <img className="mb-5" src={logo} alt="stream" />
        </div>
        <div>
          <label htmlFor="email">Enter Your Email</label>
          <input
            type="email"
            className="p-2 mt-3 w-full border focus:outline-none rounded-sm border-slate-300"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-5">
          <label htmlFor="password">Enter Your Password</label>
          <input
            type="password"
            className="p-2 mt-3 w-full border focus:outline-none rounded-sm border-slate-300"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="w-full mt-4 bg-blue-600 py-2 rounded-sm" onClick={handleSubmit}>
          Login
        </button>
      </div>
    </section>
  );
};

export default Login;
