import { useState, useEffect } from 'react';

const Dashboard = () => {
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Power Tools');
  const [condition, setCondition] = useState('Good');
  
  // Inventory State
  const [myTools, setMyTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  // 1. Fetch exactly this user's tools when the page loads
  const fetchMyTools = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:3000/api/tools/user/${userId}`);
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

    try {
      const response = await fetch('http://localhost:3000/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, category, condition, ownerId: userId }),
      });

      if (response.ok) {
        // Clear the form
        setName('');
        setDescription('');
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
      const response = await fetch(`http://localhost:3000/api/tools/${toolId}`, {
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
      const response = await fetch(`http://localhost:3000/api/tools/${toolId}`, {
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
    <div className="max-w-6xl mx-auto mt-12 p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* LEFT COLUMN: Add Tool Form */}
      <div className="md:col-span-1 bg-white shadow-lg rounded-2xl border border-gray-100 p-6 h-fit">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 border-b pb-2">Share a Tool</h2>
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
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md mt-2">Upload Tool</button>
        </form>
      </div>

      {/* RIGHT COLUMN: My Inventory */}
      <div className="md:col-span-2">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">My Inventory</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading your tools...</p>
        ) : myTools.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-gray-600">You haven't uploaded any tools yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myTools.map((tool) => (
              <div key={tool._id} className="p-5 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-1 rounded">{tool.category}</span>
                    <button 
                      onClick={() => handleDelete(tool._id)}
                      className="text-red-400 hover:text-red-600 text-sm font-bold"
                      title="Delete Tool"
                    >
                      ✕
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{tool.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">Condition: {tool.condition}</p>
                </div>
                
                {/* Status Toggle Button */}
                <button 
                  onClick={() => handleToggle(tool._id)}
                  className={`w-full py-2 rounded-lg font-bold transition-colors ${tool.isAvailable ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                >
                  {tool.isAvailable ? 'Status: Available' : 'Status: In Use'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;