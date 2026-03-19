import { useState, useEffect } from 'react';

const Dashboard = () => {
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Power Tools');
  const [condition, setCondition] = useState('Good');
  const [images, setImages] = useState(null); // 👈 NEW: State for tool images
  
  // Inventory & Request State
  const [myTools, setMyTools] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'incoming', 'outgoing'
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  // 1. Fetch exactly this user's tools and booking requests when the page loads
  const fetchData = async () => {
    if (!userId) return;
    const token = localStorage.getItem('token');
    try {
      // Fetch user's tools
      const toolsRes = await fetch(`https://akiba-link-3.onrender.com/api/tools/user/${userId}`);
      if (toolsRes.ok) setMyTools(await toolsRes.json());

      // Fetch incoming requests
      const incomingRes = await fetch(`https://akiba-link-3.onrender.com/api/bookings/incoming-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (incomingRes.ok) setIncomingRequests(await incomingRes.json());

      // Fetch outgoing requests
      const outgoingRes = await fetch(`https://akiba-link-3.onrender.com/api/bookings/my-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (outgoingRes.ok) setOutgoingRequests(await outgoingRes.json());

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        fetchData(); 
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
        fetchData(); // Refresh the list to show the new color
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
        fetchData(); // Refresh the list so it disappears
      }
    } catch (error) {
      console.error("Error deleting tool:", error);
    }
  };

  // 5. Handle Booking Status Updates (Approve/Reject)
  const handleBookingStatus = async (bookingId, status) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://akiba-link-3.onrender.com/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchData(); // Refresh the lists!
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
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

      {/* RIGHT COLUMN: Dashboard Tabs */}
      <div className="lg:col-span-8">
        <div className="glass p-8 rounded-3xl shadow-xl border border-white/50 min-h-[500px]">
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`font-bold py-2 px-6 rounded-full transition-all whitespace-nowrap ${activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-white/50'}`}
            >
              🛠️ My Inventory ({myTools.length})
            </button>
            <button 
              onClick={() => setActiveTab('incoming')}
              className={`font-bold py-2 px-6 rounded-full transition-all whitespace-nowrap ${activeTab === 'incoming' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-white/50'}`}
            >
              📥 Incoming Requests ({incomingRequests.filter(r => r.status === 'pending').length})
            </button>
            <button 
              onClick={() => setActiveTab('outgoing')}
              className={`font-bold py-2 px-6 rounded-full transition-all whitespace-nowrap ${activeTab === 'outgoing' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-white/50'}`}
            >
              📤 My Rentals
            </button>
          </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
        ) : activeTab === 'inventory' ? (
          /* INVENTORY TAB TAB */
          myTools.length === 0 ? (
            <div className="bg-white/40 p-12 rounded-2xl border border-white border-dashed shadow-inner text-center animate-fade-in">
              <div className="text-5xl mb-4">🪹</div>
              <p className="text-xl font-bold text-gray-800">Your shed is empty!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {myTools.map((tool) => (
                <div key={tool._id} className="group bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                  <div className="relative h-48 bg-gray-100">
                    {tool.images?.length > 0 ? (
                      <img src={tool.images[0]} alt={tool.name} className="w-full h-full object-cover" />
                    ) : ( <div className="w-full h-full flex items-center justify-center text-4xl">🛠️</div> )}
                    <button onClick={() => handleDelete(tool._id)} className="absolute top-3 right-3 bg-white/90 text-red-500 hover:bg-red-500 hover:text-white w-8 h-8 rounded-full shadow-lg transition-colors">✕</button>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 truncate">{tool.name}</h3>
                    <button onClick={() => handleToggle(tool._id)} className={`w-full py-2mt-auto rounded-xl font-bold shadow-sm ${tool.isAvailable ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}>
                      {tool.isAvailable ? '✅ Available' : '🔴 In Use'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === 'incoming' ? (
          /* INCOMING REQUESTS TAB */
          incomingRequests.length === 0 ? (
            <div className="text-center py-10 animate-fade-in"><p className="text-gray-500">No incoming requests yet.</p></div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map(req => (
                <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{req.renter.username} wants to borrow your <span className="text-blue-600">{req.tool.name}</span></h3>
                    <p className="text-gray-500 text-sm mt-1">From: <strong>{new Date(req.startDate).toLocaleDateString()}</strong> to <strong>{new Date(req.endDate).toLocaleDateString()}</strong></p>
                    {req.message && <p className="text-gray-600 mt-2 italic bg-gray-50 p-3 rounded-lg text-sm">"{req.message}"</p>}
                    <p className="text-xs font-semibold text-gray-400 mt-2 uppercase tracking-wide">Status: <span className={req.status === 'pending' ? 'text-orange-500' : req.status === 'approved' ? 'text-green-500' : 'text-gray-500'}>{req.status}</span></p>
                  </div>
                  
                  {req.status === 'pending' && (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button onClick={() => handleBookingStatus(req._id, 'approved')} className="flex-1 sm:flex-none bg-green-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-green-600 shadow-sm">Approve</button>
                      <button onClick={() => handleBookingStatus(req._id, 'rejected')} className="flex-1 sm:flex-none bg-red-50 text-red-600 font-bold py-2 px-4 rounded-xl hover:bg-red-100">Deny</button>
                    </div>
                  )}
                  {req.status === 'approved' && (
                     <button onClick={() => handleBookingStatus(req._id, 'completed')} className="w-full sm:w-auto bg-gray-900 text-white font-bold py-2 px-4 rounded-xl hover:bg-gray-800 shadow-sm">Mark Returned</button>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          /* OUTGOING REQUESTS TAB */
          outgoingRequests.length === 0 ? (
            <div className="text-center py-10 animate-fade-in"><p className="text-gray-500">You haven't requested any tools yet.</p></div>
          ) : (
            <div className="space-y-4">
              {outgoingRequests.map(req => (
                <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Requested <span className="text-indigo-600">{req.tool.name}</span></h3>
                    <p className="text-gray-500 text-sm mt-1">Dates: <strong>{new Date(req.startDate).toLocaleDateString()}</strong> - <strong>{new Date(req.endDate).toLocaleDateString()}</strong></p>
                    <p className="text-gray-600 mt-2 text-sm">Owner: <span className="font-semibold">{req.owner.username}</span> ({req.owner.neighborhood})</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-bold text-sm shadow-sm ${req.status === 'pending' ? 'bg-orange-100 text-orange-700' : req.status === 'approved' ? 'bg-green-100 text-green-700' : req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
