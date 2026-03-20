import { useState, useEffect } from 'react';

const ReviewModal = ({ tool, isOpen, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Existing reviews
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    if (isOpen && tool) {
      fetchReviews();
    }
  }, [isOpen, tool]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await fetch(`https://akiba-link-3.onrender.com/api/reviews/tool/${tool._id}`);
      if (res.ok) {
        setReviews(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  if (!isOpen || !tool) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('https://akiba-link-3.onrender.com/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          toolId: tool._id,
          rating,
          comment
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        fetchReviews(); // Refresh the list
        setComment('');
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Failed to submit review.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMsg('Network error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-50 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
          <h2 className="text-2xl font-extrabold mb-1">Reviews & Ratings</h2>
          <p className="text-orange-100 text-sm">Community feedback for <span className="font-bold text-white">{tool.name}</span></p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
          
          {/* Write a Review Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Leave your review</h3>
            {status === 'success' ? (
              <div className="p-4 bg-green-50 text-green-700 rounded-xl font-medium border border-green-200">
                ⭐ Thank you! Your review has been added to the community.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                    {errorMsg}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200 grayscale'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your written review</label>
                  <textarea 
                    required
                    rows="3" 
                    placeholder="Did the tool work well? Was the owner friendly?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className={`w-full text-white font-bold py-3 rounded-xl transition-all shadow-md ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:shadow-lg hover:-translate-y-0.5'}`}
                >
                  {status === 'loading' ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>

          {/* Existing Reviews Section */}
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              Community Reviews <span className="text-sm bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{reviews.length}</span>
            </h3>
            
            {loadingReviews ? (
              <p className="text-gray-500 text-center py-4">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                 <p className="text-gray-500">No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-900">{rev.reviewer.username}</span>
                      <div className="text-yellow-400 tracking-widest text-sm">
                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                    <p className="text-xs text-gray-400 mt-3">{new Date(rev.createdAt).toLocaleDateString()}</p>
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

export default ReviewModal;
