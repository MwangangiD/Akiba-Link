import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookingModal from '../components/BookingModal';

const Home = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingTool, setBookingTool] = useState(null);

  // 👈 NEW: State for our Search Bar and Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('https://akiba-link-3.onrender.com/api/tools');
        const data = await response.json();
        if (response.ok) {
          setTools(data);
        }
      } catch (error) {
        console.error("Failed to fetch tools:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  // 👈 NEW: The Filter Engine! 
  // This instantly shrinks the list based on what the user types or selects
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      
      {/* 📅 The Booking Modal Overlay */}
      <BookingModal 
        tool={bookingTool} 
        isOpen={!!bookingTool} 
        onClose={() => setBookingTool(null)} 
      />

      {/* 🌟 Hero Section */}
      <div className="w-full relative py-28 px-4 text-center mt-8">
        <div className="max-w-4xl mx-auto relative z-10 animate-slide-up">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full glass border border-blue-200/50 text-blue-700 font-semibold text-sm shadow-sm">
            ✨ Your Local Neighborhood Toolbox
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 leading-tight">
            Share Tools. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Build Community.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
            Akiba-Link connects you with neighbors to borrow, share, and request exactly what you need. Why buy when you can borrow?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 px-8 rounded-full shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all">Start Sharing Today</Link>
            <a href="#tools" className="glass text-gray-800 font-bold py-3.5 px-8 rounded-full hover:bg-white/80 transition-all shadow-sm">Explore Tools</a>
          </div>
        </div>
      </div>

      {/* 🛠️ The Tool Feed */}
      <div id="tools" className="max-w-6xl w-full mx-auto py-12 px-4 mb-20 relative z-10">
        
        {/* Floating Search Bar */}
        <div className="glass p-4 rounded-2xl shadow-xl border border-white/50 flex flex-col md:flex-row justify-between items-center gap-4 mb-16 -mt-8 relative animate-fade-in">
          <div className="flex-1 w-full relative">
            <span className="absolute left-4 top-3 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="What do you need today? (e.g. Drill, Rake)..." 
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto">
            <select 
              className="w-full px-5 py-3 rounded-xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Power Tools">Power Tools ⚡</option>
              <option value="Hand Tools">Hand Tools 🔨</option>
              <option value="Gardening">Gardening 🌿</option>
              <option value="Hardware">Hardware 🔩</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Community Tools</h2>
            <p className="text-gray-500 mt-1">Found {filteredTools.length} tools available nearby</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-3xl border border-gray-100 shadow-sm animate-fade-in">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">No tools found matching your search!</p>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
            {tools.length === 0 && <Link to="/dashboard" className="bg-blue-50 text-blue-700 font-bold px-6 py-3 rounded-full hover:bg-blue-100 transition-colors">Be the first to add a tool &rarr;</Link>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
              <div key={tool._id} className="group flex flex-col justify-between bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                
                {/* Image Section */}
                <div className="relative h-56 bg-gradient-to-tr from-gray-100 to-gray-200 overflow-hidden">
                  {tool.images && tool.images.length > 0 ? (
                    <img src={tool.images[0]} alt={tool.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🛠️</div>
                  )}
                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">{tool.category}</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    {tool.isAvailable ? (
                      <span className="flex items-center text-xs text-green-700 font-bold bg-green-100 px-3 py-1.5 rounded-full shadow-sm shadow-green-500/20"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>Available</span>
                    ) : (
                      <span className="flex items-center text-xs text-red-700 font-bold bg-red-100 px-3 py-1.5 rounded-full"><span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>In Use</span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2 truncate">{tool.name}</h3>
                  <p className="text-gray-500 line-clamp-2 mb-4 text-sm leading-relaxed flex-1">{tool.description || "No description provided."}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Condition</span>
                      <span className="text-sm font-semibold text-gray-800">{tool.condition}</span>
                    </div>
                    {tool.owner && tool.owner.neighborhood && (
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Located</span>
                        <span className="text-sm font-semibold text-blue-600 flex items-center">📍 {tool.owner.neighborhood}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-4 pt-0">
                  <button 
                    onClick={() => tool.isAvailable ? setBookingTool(tool) : null}
                    className={`w-full py-3.5 rounded-2xl font-bold transition-all ${tool.isAvailable ? 'bg-gray-900 text-white hover:bg-indigo-600 shadow-md hover:shadow-indigo-500/30' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    {tool.isAvailable ? 'Request to Borrow' : 'Currently Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;
