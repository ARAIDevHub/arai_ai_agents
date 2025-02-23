import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_NODE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-slate-800/50 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 rounded bg-slate-700 text-white"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 rounded bg-slate-700 text-white"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-orange-600 text-white py-2 rounded hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
        
        <div className="mt-4 flex flex-col items-center space-y-2 text-sm text-gray-300">
          <Link 
            to="/forgot-password" 
            className="hover:text-white transition"
          >
            Forgot Password?
          </Link>
          <div className="flex items-center space-x-1">
            <span>Don't have an account?</span>
            <Link 
              to="/signup" 
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 