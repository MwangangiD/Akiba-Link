import { useState, useEffect } from 'react';

const Dashboard = () => {
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Power Tools');
  const [condition, setCondition] = useState('Good');
  const [images, setImages] = useState(null); // 👈 NEW: State for tool images
  
  // Inventory State
  const [myTools, setMyTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  // 1. Fetch exactly this user's tools when the page loads
  const fetchMyTools = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`https://akiba-link-3.onrender.com/api/tools/user/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setMyTools(data);
      }
    } catch (error) {
      console.error("Failed to fetch personal tools:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTools();
  }, [userId]);

  // 2. Handle adding a new tool
  const handleAddTool = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Please log in first!");

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('condition', condition);
    formData.append('ownerId', userId);
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    try {
      const response = await fetch('https://akiba-link-3.onrender.com/api/tools', {
        method: 'POST',
        // Note: Do NOT set Content-Type for FormData, the browser sets it with the boundary!
        body: formData,
      });

      if (response.ok) {
        // Clear the form
        setName('');
        setDescription('');
        setImages(null);
        // Immediately fetch the updated list so the new tool pops up on screen!
        fetchMyTools(); 
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  // 3. Handle toggling Availability
  const handleToggle = async (toolId) => {
    try {
      const response = await fetch(`https://akiba-link-3.onrender.com/api/tools/${toolId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchMyTools(); // Refresh the list to show the new color
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  // 4. Handle Deleting a tool
  const handleDelete = async (toolId) => {
    if (!window.confirm("Are you sure you want to delete this tool?")) return;
    
    try {
      const response = await fetch(`https://akiba-link-3.onrender.com/api/tools/${toolId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchMyTools(); // Refresh the list so it disappears
      }
    } catch (error) {
      console.error("Error deleting tool:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
      
      {/* LEFT COLUMN: Add Tool Form */}
      <div className="lg:col-span-4 h-fit sticky top-24">
        <div className="glass p-8 rounded-3xl shadow-xl border border-white/50 animate-slide-up">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">✨</span> Share a Tool
          </h2>
        <form onSubmit={handleAddTool} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tool Name</label>
            <input type="text" required className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required rows="2" className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Power Tools</option>
              <option>Hand Tools</option>
              <option>Gardening</option>
              <option>Hardware</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600" value={condition} onChange={(e) => setCondition(e.target.value)}>
              <option>Like New</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tool Images (Up to 5)</label>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
              onChange={(e) => setImages(e.target.files)} 
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all mt-4">
            Upload to Tool Shed
          </button>
        </form>
        </div>
      </div>

      {/* RIGHT COLUMN: My Inventory */}
      <div className="lg:col-span-8">
        <div className="glass p-8 rounded-3xl shadow-xl border border-white/50 min-h-[500px]">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">My Inventory</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading your tools...</p>
        ) : myTools.length === 0 ? (
          <div className="bg-white/40 p-12 rounded-2xl border border-white border-dashed shadow-inner text-center animate-fade-in">
            <div className="text-5xl mb-4">🪹</div>
            <p className="text-xl font-bold text-gray-800">Your shed is empty!</p>
            <p className="text-gray-500 mt-2">Upload your first tool using the form on the left to start building your community.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {myTools.map((tool) => (
              <div key={tool._id} className="group bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-tr from-gray-100 to-gray-200 overflow-hidden">
                  {tool.images && tool.images.length > 0 ? (
                    <img src={tool.images[0]} alt={tool.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🛠️</div>
                  )}
                  <div className="absolute top-3 left-3 flex justify-between w-[calc(100%-24px)] items-start">
                    <span className="text-xs font-bold uppercase tracking-wider text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">{tool.category}</span>
                    <button 
                      onClick={() => handleDelete(tool._id)}
                      className="bg-white/90 text-red-500 hover:text-white hover:bg-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors"
                      title="Delete Tool"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-1 truncate">{tool.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 font-medium flex-1">Condition: <span className="text-gray-800">{tool.condition}</span></p>
                  
                  {/* Status Toggle Button */}
                  <button 
                    onClick={() => handleToggle(tool._id)}
                    className={`w-full py-2.5 mt-auto rounded-xl font-bold transition-all shadow-sm ${tool.isAvailable ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'}`}
                  >
                    {tool.isAvailable ? '✅ Status: Available' : '🔴 Status: In Use'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
