import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactTool, setContactTool] = useState(null);

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center relative">
      
      {/* 📞 The Contact Modal Overlay */}
      {contactTool && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all">
            <div className="text-5xl mb-4">📞</div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Borrow {contactTool.name}</h3>
            <p className="text-gray-600 mb-6">
              Reach out to <span className="font-bold text-blue-600">{contactTool.owner?.username || "the owner"}</span> to arrange a pickup!
            </p>
            <div className="bg-blue-50 text-blue-800 text-2xl font-black py-4 px-6 rounded-xl mb-6 border border-blue-100 tracking-wider">
              {contactTool.owner?.phoneNumber || "No number provided"}
            </div>
            <button onClick={() => setContactTool(null)} className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-md">
              Close
            </button>
          </div>
        </div>
      )}

      {/* 🌟 Hero Section */}
      <div className="w-full bg-blue-900 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">Share Tools. Build Community.</h1>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Akiba-Link connects you with your neighbors to borrow, share, and request the tools you need for your next project. Why buy when you can borrow?
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="bg-white text-blue-900 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors">Join the Community</Link>
            <a href="#tools" className="border border-blue-400 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-800 transition-colors">Browse Tools</a>
          </div>
        </div>
      </div>

      {/* 🛠️ The Tool Feed */}
      <div id="tools" className="max-w-6xl w-full mx-auto py-12 px-4 mb-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Community Tools</h2>
          
          {/* 🔍 NEW: The Search Bar and Filter Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search tools..." 
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white w-full sm:w-auto"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Power Tools">Power Tools</option>
              <option value="Hand Tools">Hand Tools</option>
              <option value="Gardening">Gardening</option>
              <option value="Hardware">Hardware</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading community tools...</p>
        ) : filteredTools.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xl text-gray-600 mb-4">No tools found matching your search!</p>
            {tools.length === 0 && <Link to="/dashboard" className="text-blue-600 font-bold hover:underline">Be the first to add a tool &rarr;</Link>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 👈 Notice we are mapping over filteredTools now, not all tools! */}
            {filteredTools.map((tool) => (
              <div key={tool._id} className="p-6 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{tool.category}</span>
                    {tool.isAvailable ? (
                      <span className="flex items-center text-sm text-green-600 font-semibold"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Available</span>
                    ) : (
                      <span className="flex items-center text-sm text-red-500 font-semibold"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>In Use</span>
                    )}
                  </div>
                  {tool.images && tool.images.length > 0 && (
                    <img src={tool.images[0]} alt={tool.name} className="w-full h-48 object-cover rounded-md mb-3 shadow-sm border border-gray-100" />
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{tool.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">Condition: {tool.condition}</p>
                  {tool.owner && tool.owner.neighborhood && (
                    <p className="text-xs text-gray-400 mb-4 flex items-center">📍 {tool.owner.neighborhood}</p>
                  )}
                </div>
                <button 
                  onClick={() => tool.isAvailable ? setContactTool(tool) : null}
                  className={`w-full py-2 rounded-lg font-bold transition-colors ${tool.isAvailable ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  {tool.isAvailable ? 'Request to Borrow' : 'Currently Unavailable'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;
