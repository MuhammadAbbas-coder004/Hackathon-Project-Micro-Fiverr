import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  MapPin, 
  CheckCheck, 
  Clock,
  User,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

const ChatPage = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const [activeChat, setActiveChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const scrollRef = useRef();
  const [socket, setSocket] = useState(null);

  // Initialize Socket.io
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    if (user && user._id) {
      newSocket.emit("join_room", user._id);
    }

    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        text: data.text,
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      }]);
      // If the message is from the active chat, we should mark it read automatically
      // But for simplicity, the useEffect watching activeChat/messages handles it.
    });

    newSocket.on("messages_read", ({ readerId }) => {
      setMessages((prev) => 
        prev.map(msg => msg.sender === 'me' ? { ...msg, isRead: true } : msg)
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Fetch Conversations once
  useEffect(() => {
    const fetchConvos = async () => {
      if(!token) return;
      try {
        const res = await axios.get('/api/chat/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(res.data);
        if(res.data.length > 0) {
          setActiveChat(res.data[0].id);
        }
      } catch (err) {
        console.error("Error fetching conversations", err);
      }
    };
    fetchConvos();
  }, [token]);

  // Fetch messages when activeChat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if(!activeChat || !token) return;
      try {
        const res = await axios.get(`/api/chat/${activeChat}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const formatted = res.data.map(msg => ({
          id: msg._id,
          text: msg.message,
          sender: msg.sender === user?._id ? 'me' : 'them',
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: msg.isRead
        }));
        setMessages(formatted);

        // Mark as read immediately when opened
        const hasUnreadFromThem = res.data.some(msg => msg.sender !== user?._id && !msg.isRead);
        if (hasUnreadFromThem) {
           await axios.put(`/api/chat/${activeChat}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
           if(socket) {
             socket.emit("mark_read", { senderId: activeChat, readerId: user?._id });
           }
        }
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };
    fetchMessages();
  }, [activeChat, token, user]);

  // Handle Intro Message from other pages
  useEffect(() => {
    if (location.state?.introProvider && socket && token) {
      const provider = location.state.introProvider;
      const text = location.state.introMessage;

      if (window._introSent === provider._id) return;
      window._introSent = provider._id;

      const sendIntro = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          await axios.post('/api/chat', { receiverId: provider._id, message: text }, config);
          
          socket.emit("send_message", {
            senderId: user?._id,
            receiverId: provider._id,
            text
          });

          setConversations(prev => {
            if (!prev.find(c => c.id === provider._id)) {
              return [{
                id: provider._id,
                name: provider.name || 'User',
                lastMsg: text,
                time: 'Just now',
                unread: 0,
                online: true
              }, ...prev];
            }
            return prev;
          });
          
          setActiveChat(provider._id);
        } catch (err) {
          console.error("Error sending intro message", err);
        }
      };
      
      sendIntro();
    }
  }, [location.state, socket, token, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('/api/chat', { receiverId: activeChat, message }, config);

      const newMsg = {
        id: Date.now(),
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      
      setMessages([...messages, newMsg]);
      setMessage('');

      if (socket) {
        socket.emit("send_message", {
          senderId: user?._id,
          receiverId: activeChat,
          text: message
        });
      }
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const selectedChat = conversations.find(c => c.id === activeChat);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-12 px-4">
      <div className="max-w-[1400px] mx-auto h-[calc(100vh-180px)] flex bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-indigo-100/50 overflow-hidden font-['Outfit']">
        
        {/* 📁 LEFT PANEL - CONVERSATIONS (350px) */}
        <div className="w-full md:w-[400px] border-r border-slate-50 flex flex-col bg-slate-50/30">
          <div className="p-8 pb-6">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Messages</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search conversations..."
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-8">
            {conversations.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-5 rounded-[2rem] cursor-pointer transition-all flex items-center gap-4 group ${activeChat === chat.id ? 'bg-white shadow-xl shadow-indigo-100/50 border-transparent' : 'hover:bg-white border border-transparent hover:border-slate-100'}`}
              >
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg ${activeChat === chat.id ? 'bg-indigo-600' : 'bg-slate-200 text-slate-500 group-hover:bg-indigo-400 transition-colors'}`}>
                    {chat.name.charAt(0)}
                  </div>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-slate-900 truncate">{chat.name}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate ${chat.unread > 0 ? 'font-black text-indigo-600' : 'font-medium text-slate-500'}`}>
                    {chat.lastMsg}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 💬 RIGHT PANEL - CHAT WINDOW */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          {/* Chat Header */}
          <header className="p-6 md:px-10 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button className="md:hidden p-2 text-slate-400"><ArrowLeft size={20} /></button>
               <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-lg">
                 {selectedChat?.name?.charAt(0) || '?'}
               </div>
               <div>
                 <h3 className="font-black text-slate-900 text-lg leading-tight">{selectedChat?.name || 'Select a Conversation'}</h3>
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    {selectedChat?.online ? 'Online' : 'Active'}
                 </p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all shadow-sm active:scale-90"><MoreVertical size={18} /></button>
            </div>
          </header>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-50/20">
            <div className="text-center">
               <span className="px-5 py-1.5 bg-white border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                 Today, May 15
               </span>
            </div>
            
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
              >
                <div className={`max-w-[70%] md:max-w-[50%] space-y-2`}>
                  <div 
                    className={`py-4 px-6 rounded-3xl text-sm font-medium leading-relaxed ${
                      msg.sender === 'me' 
                        ? 'bg-indigo-600 text-white rounded-tr-sm shadow-xl shadow-indigo-100' 
                        : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100 shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-2 px-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      {msg.time}
                    </span>
                    {msg.sender === 'me' && <CheckCheck size={14} className={msg.isRead ? "text-blue-500" : "text-slate-400"} />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Messaging Input */}
          <footer className="p-6 md:px-10 border-t border-slate-50 bg-white">
            <form onSubmit={handleSend} className="bg-slate-50 p-2 rounded-3xl flex items-center gap-2 border border-transparent focus-within:border-indigo-200 focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-indigo-100 transition-all">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-grow bg-transparent border-none text-slate-800 text-sm font-medium p-4 outline-none placeholder-slate-400"
              />
              <button 
                type="submit"
                disabled={!message.trim()}
                className="p-4 bg-indigo-600 hover:bg-black text-white rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-[0.8] disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </form>
          </footer>

          {/* Decorative corner shape */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-600/5 -z-10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
