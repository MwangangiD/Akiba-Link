import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 👈 New state to hold error messages
  
  const navigate = useNavigate(); // 👈 React Router's steering wheel

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any old errors when they try again
    
    try {
      const response = await fetch('https://akiba-link-1.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Save the token to the browser's local memory!
        localStorage.setItem('token', data.token);
        
        localStorage.setItem('userId', data.user.id);

        // 2. Redirect straight to the Home page!
        navigate('/');
      } else {
        // If login fails, show the exact error from the backend on the screen
        setError(data.message);
      }

    } catch (error) {
      console.error("Network Error:", error);
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
        <p className="text-gray-500 mt-2">Sign in to Akiba-Link</p>
      </div>

      {/* 🔴 Display the error message beautifully on the screen if it exists */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input 
            type="email" 
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-md"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">Sign up</Link>
      </p>

    </div>
  );
};

export default Login;