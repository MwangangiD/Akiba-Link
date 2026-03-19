import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // 1. Look in the browser's memory to see if a token exists
  const token = localStorage.getItem('token');

  // 2. The Logout Function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Tear up the digital VIP pass
    navigate('/login'); // Kick them back to the login screen
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 border-b border-white/20">
      
      {/* The Logo always goes Home */}
      <Link to="/" className="text-2xl font-extrabold text-blue-900 tracking-tight flex items-center gap-2 hover:scale-105 transition-transform">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-md">
          <span className="text-2xl text-white block leading-none">🛠️</span>
        </div>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800">Akiba-Link</span>
      </Link>
      
      <div className="flex gap-4 md:gap-6 items-center">
        {/* 3. The Smart Split: If token exists, show logged-in tools. If not, show login buttons. */}
        {token ? (
          <>
            <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">Feed</Link>
            <Link to="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">My Tools</Link>
            
            <button 
              onClick={handleLogout}
              className="text-sm bg-red-50 text-red-600 border border-red-100 font-bold py-2 px-5 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">Sign In</Link>
            <Link to="/register" className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 px-6 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5">
              Join Community
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
