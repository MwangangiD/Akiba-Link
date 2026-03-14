import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          {/* Brand / Logo Area */}
          <Link to="/" className="text-2xl font-extrabold tracking-wider cursor-pointer flex items-center gap-2">
            <span>🛠️</span>
            Akiba-Link
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 font-semibold text-sm">
            <Link to="/" className="hover:text-blue-300 transition-colors duration-300">
              Home
            </Link>
            
            <Link to="/" className="hover:text-blue-300 transition-colors duration-300">
              Community Feed
            </Link>
            
            {/* Call to Action Button pointing exactly to /login */}
            <Link to="/login" className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg shadow-md transition-all duration-300">
              Login / Register
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;