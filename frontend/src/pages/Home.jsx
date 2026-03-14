import { Link } from 'react-router-dom';

const Home = () => {
  // We will replace this array with real data from MongoDB later!
  const dummyTools = [
    { id: 1, name: "DeWalt Power Drill", category: "Power Tools", condition: "Like New", available: true },
    { id: 2, name: "20ft Extension Ladder", category: "Hardware", condition: "Good", available: true },
    { id: 3, name: "Electric Lawnmower", category: "Gardening", condition: "Fair", available: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      
      {/* 🌟 Hero Section */}
      <div className="w-full bg-blue-900 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Share Tools. Build Community.
          </h1>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Akiba-Link connects you with your neighbors to borrow, share, and request the tools you need for your next project. Why buy when you can borrow?
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="bg-white text-blue-900 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
              Join the Community
            </Link>
            <a href="#tools" className="border border-blue-400 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-800 transition-colors">
              Browse Tools
            </a>
          </div>
        </div>
      </div>

      {/* ⚙️ How It Works Section */}
      <div className="max-w-6xl w-full mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How Akiba-Link Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold mb-2">1. Create an Account</h3>
            <p className="text-gray-600">Sign up in seconds to join your local neighborhood network.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">2. Find What You Need</h3>
            <p className="text-gray-600">Search the community feed for drills, saws, ladders, and more.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">3. Connect & Borrow</h3>
            <p className="text-gray-600">Message the owner, pick up the tool, and get your project done.</p>
          </div>
        </div>
      </div>

      {/* 🛠️ Available Tools Preview */}
      <div id="tools" className="max-w-6xl w-full mx-auto py-12 px-4 mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recently Added Tools</h2>
          <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-800">View All &rarr;</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dummyTools.map((tool) => (
            <div key={tool.id} className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {tool.category}
                  </span>
                  {tool.available ? (
                    <span className="flex items-center text-sm text-green-600 font-semibold"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Available</span>
                  ) : (
                    <span className="flex items-center text-sm text-red-500 font-semibold"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>In Use</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{tool.name}</h3>
                <p className="text-gray-500 text-sm mb-4">Condition: {tool.condition}</p>
              </div>
              <button className={`w-full py-2 rounded-lg font-bold transition-colors ${tool.available ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {tool.available ? 'Request to Borrow' : 'Currently Unavailable'}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;