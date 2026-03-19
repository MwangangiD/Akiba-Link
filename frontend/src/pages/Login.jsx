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
      const response = await fetch('https://akiba-link-3.onrender.com/api/auth/login', {
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
    <div className="min-h-[calc(100vh-80px)] bg-[#f8fafc] flex items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Background Decor */}
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass p-10 shadow-2xl rounded-3xl border border-white/60 relative z-10 animate-slide-up">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 shadow-inner">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
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
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">Sign up</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
