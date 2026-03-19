import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingModal = ({ tool, isOpen, onClose }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !tool) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('https://akiba-link-3.onrender.com/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          toolId: tool._id,
          startDate,
          endDate,
          message
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Failed to request tool.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMsg('Network error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
          <h2 className="text-2xl font-extrabold mb-1">Request to Borrow</h2>
          <p className="text-blue-100 truncate text-sm">You are requesting: <span className="font-bold text-white">{tool.name}</span></p>
        </div>

        {/* Content */}
        <div className="p-8">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
              <p className="text-gray-600 mb-6">The owner has been notified. They will review your request shortly.</p>
              <button onClick={onClose} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Return to Feed</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {status === 'error' && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
                  <DatePicker 
                    selected={startDate} 
                    onChange={(date) => setStartDate(date)} 
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                  <DatePicker 
                    selected={endDate} 
                    onChange={(date) => setEndDate(date)} 
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message to Owner (Optional)</label>
                <textarea 
                  rows="3" 
                  placeholder="e.g., Hi! I just need this for a quick weekend project..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className={`w-full text-white font-bold py-3.5 rounded-xl transition-all shadow-md ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5'}`}
                >
                  {status === 'loading' ? 'Sending Request...' : 'Send Booking Request'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
