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
    <nav className="bg-white shadow-sm border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      
      {/* The Logo always goes Home */}
      <Link to="/" className="text-2xl font-extrabold text-blue-900 tracking-tight flex items-center gap-2">
        <span className="text-3xl">🛠️</span> Akiba-Link
      </Link>
      
      <div className="flex gap-6 items-center">
        {/* 3. The Smart Split: If token exists, show logged-in tools. If not, show login buttons. */}
        {token ? (
          <>
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors">Community Feed</Link>
            {/* We will build this Dashboard page later! */}
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors">My Tools</Link>
            
            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-600 border border-red-100 font-bold py-2 px-5 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors">Sign In</Link>
            <Link to="/register" className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Join Community
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;