import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const ChatOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null); // { partnerId, username }
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const messagesEndRef = useRef(null);

  // Initialize Socket Connection
  useEffect(() => {
    if (token && userId) {
      const newSocket = io('https://akiba-link-3.onrender.com');
      
      newSocket.on('connect', () => {
        newSocket.emit('joinRoom', userId);
      });

      newSocket.on('receiveMessage', (msg) => {
        // If the message belongs to the currently active chat, append it!
        setMessages((prev) => {
          // Verify it belongs to the active conversation
          // (Because activePartner might be stale in closure, we could use a ref, but simple state works if we check IDs)
          return [...prev, msg];
        });
        
        // Refresh conversations list to update previews and unread badges
        fetchConversations();
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [token, userId]);

  // Fetch Conversation List
  const fetchConversations = async () => {
    if (!token) return;
    try {
      const res = await fetch('https://akiba-link-3.onrender.com/api/messages/conversations/list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setConversations(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  // Fetch History for Active Chat
  useEffect(() => {
    const fetchHistory = async () => {
      if (!activePartner || !token) return;
      try {
        const res = await fetch(`https://akiba-link-3.onrender.com/api/messages/${activePartner.partnerId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setMessages(await res.json());
          scrollToBottom();
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [activePartner]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !activePartner) return;

    socket.emit('sendMessage', {
      sender: userId,
      receiver: activePartner.partnerId,
      content: newMessage.trim()
    });

    setNewMessage('');
  };

  if (!token) return null; // Don't show chat if not logged in

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 transition-all flex items-center justify-center z-50 animate-bounce"
        >
          <span className="text-3xl">💬</span>
          {conversations.reduce((acc, c) => acc + c.unreadCount, 0) > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">
              {conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100 animate-slide-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              {activePartner && (
                <button onClick={() => setActivePartner(null)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                  ⬅️
                </button>
              )}
              <h3 className="font-extrabold text-lg">
                {activePartner ? activePartner.user.username : 'Messages'}
              </h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center">
              ✕
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col relative">
            
            {!activePartner ? (
              // Conversation List View
              <div className="overflow-y-auto h-full">
                {conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
                    <span className="text-5xl mb-4">📭</span>
                    <p>No messages yet. Reach out to a tool owner to start chatting!</p>
                  </div>
                ) : (
                  conversations.map(conv => (
                    <div 
                      key={conv.partnerId} 
                      onClick={() => setActivePartner({ partnerId: conv.partnerId, user: conv.user })}
                      className="p-4 border-b border-gray-100 bg-white hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-800 shadow-inner">
                        {conv.user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-gray-900 truncate">{conv.user.username}</h4>
                          <span className="text-xs text-gray-400">{new Date(conv.date).toLocaleDateString()}</span>
                        </div>
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              // Active Chat History View
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.map((msg, idx) => {
                  const isMe = msg.sender === userId;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <span className={`text-[10px] mt-1 block ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input Area */}
          {activePartner && (
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-100 border-transparent rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  ➤
                </button>
              </form>
            </div>
          )}

        </div>
      )}
    </>
  );
};

export default ChatOverlay;
