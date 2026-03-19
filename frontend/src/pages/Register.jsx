import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  // 1. State updated to match your exact MongoDB Schema
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // 2. New state for displaying beautiful messages instead of popups
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // 1. Send the data to your new backend route
      const response = await fetch('https://akiba-link-3.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Package up the 4 pieces of state to send to MongoDB
        body: JSON.stringify({ username, email, phoneNumber, password }),
      });

      // 2. Read the response from the server
      const data = await response.json();

      // 3. If it worked, celebrate!
      if (response.ok) {
        setSuccessMessage("Account created successfully! You can now sign in.");
        
        // Clear the form out
        setUsername('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        
      } else {
        // If the server rejected it (like an email that already exists)
        setErrorMessage(data.message);
      }

    } catch (error) {
      console.error("Network Error:", error);
      setErrorMessage("Failed to connect to the server.");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Join Akiba-Link</h2>
        <p className="text-gray-500 mt-2">Create an account to start sharing tools</p>
      </div>

      {/* 🔴 Display Error Messages */}
      {errorMessage && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center font-medium">
          {errorMessage}
        </div>
      )}

      {/* 🟢 Display Success Messages */}
      {successMessage && (
        <div className="mb-6 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm text-center font-medium">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Username Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input 
            type="text" 
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            placeholder="e.g. BuilderMike"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="tel" 
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            placeholder="07XX XXX XXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 mt-2 rounded-lg transition-colors duration-300 shadow-md"
        >
          Create Account
        </button>

      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">Sign in</Link>
      </p>

    </div>
  );
};

export default Register;
