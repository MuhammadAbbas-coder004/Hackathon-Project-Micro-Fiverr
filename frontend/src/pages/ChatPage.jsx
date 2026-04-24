import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { api } from '../utils/api';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowLeft,
  ShieldCheck,
  Zap,
  Activity,
  Navigation,
  Plus,
  Smile,
  Paperclip,
  Check,
  Image as ImageIcon,
  Mic,
  ArrowLeftCircle,
  Hash,
  Star,
  Settings,
  Circle,
  Sparkles
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const ChatPage = () => {
  const { user, token } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef();
  const [socket, setSocket] = useState(null);

  // Derive selected chat data
  const selectedChatData = conversations.find(c => c.id?.toString() === activeChat?.toString()) || 
                           (searchResults.find(u => u._id?.toString() === activeChat?.toString()) && {
                                id: activeChat,
                                name: searchResults.find(u => u._id?.toString() === activeChat?.toString())?.name,
                                avatar: null,
                                online: true
                           });

  const avatarColors = [
    'from-indigo-500 to-indigo-700',
    'from-indigo-400 to-indigo-600',
    'from-indigo-600 to-indigo-800',
  ];

  const getAvatarColor = (name) => {
    if (!name) return avatarColors[0];
    const charCode = name.charCodeAt(0);
    return avatarColors[charCode % avatarColors.length];
  };

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    if (user?.id) newSocket.emit("join_room", user.id);

    newSocket.on("receive_message", (data) => {
      fetchConvos();
      if (activeChat && data.senderId.toString() === activeChat.toString()) {
        setMessages((prev) => [...prev, {
          id: Date.now(),
          text: data.text,
          sender: 'them',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        }]);
      }
    });

    return () => { newSocket.disconnect(); };
  }, [user, activeChat]);

  const fetchConvos = async () => {
    if (!token) return;
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data);
    } catch (err) {
      console.error("Error fetching conversations", err);
    }
  };

  useEffect(() => {
    fetchConvos();
    const interval = setInterval(fetchConvos, 30000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const res = await api.get(`/chat/users/search?q=${searchQuery}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsSearching(false);
      }
    };
    const timer = setTimeout(searchUsers, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, token]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat || !token) return;
      try {
        const res = await api.get(`/chat/${activeChat}`);
        const formatted = res.data.map(msg => ({
          id: msg._id,
          text: msg.message,
          sender: msg.sender.toString() === user?.id?.toString() ? 'me' : 'them',
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: msg.isRead
        }));
        setMessages(formatted);
        if (res.data.some(msg => msg.sender.toString() !== user?.id?.toString() && !msg.isRead)) {
          await api.put(`/chat/${activeChat}/read`, {});
          if (socket) socket.emit("mark_read", { senderId: activeChat, readerId: user?.id });
        }
      } catch (err) {
        console.error("Error fetching messages", err);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [activeChat, token, user]);

  // Handle query parameter for auto-chat
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('u');
    if (userId) {
      setActiveChat(userId);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    try {
      await api.post('/chat', { receiverId: activeChat, message });

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
          senderId: user?.id?.toString(),
          receiverId: activeChat.toString(),
          text: message
        });
      }
      fetchConvos();
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="w-full h-[calc(100vh-100px)] flex gap-6 select-none p-4 sm:p-8 pt-24 sm:pt-32">
      
      {/* ── SIDEBAR: LIQUID DARK ── */}
      <div className={cn(
        "w-[80px] sm:w-[380px] flex flex-col bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[32px] sm:rounded-[48px] border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5 transition-all duration-500 flex-shrink-0"
      )}>
        {/* Sidebar Header */}
        <div className="p-4 sm:p-8 pb-4 space-y-6 overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="hidden sm:block text-2xl font-black text-white tracking-tighter uppercase leading-none">Nodes</h2>
            <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 border border-white/10 hover:bg-indigo-600 hover:text-white transition-all duration-300 ring-1 ring-white/5">
              <Plus size={20} />
            </button>
          </div>

          {/* Search Box */}
          <div className="hidden sm:block relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter identity..."
              className="w-full pl-12 pr-4 h-12 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white placeholder:text-slate-700 focus:border-indigo-500/50 outline-none transition-all ring-1 ring-white/5"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 no-scrollbar">
          {searchQuery ? (
            searchResults.map(u => (
              <div key={u._id} onClick={() => handleSelectChat(u._id)} className="flex items-center gap-4 p-4 rounded-[24px] cursor-pointer hover:bg-white/5 transition-all group">
                <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black shadow-lg", getAvatarColor(u.name))}>
                  {u.name.charAt(0)}
                </div>
                <div className="hidden sm:block min-w-0 flex-1">
                  <p className="text-sm font-black text-white uppercase tracking-tight truncate">{u.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 truncate">{u.email}</p>
                </div>
              </div>
            ))
          ) : conversations.map(chat => {
            const isActive = activeChat === chat.id;
            return (
              <div 
                key={chat.id} 
                onClick={() => handleSelectChat(chat.id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-[28px] cursor-pointer transition-all duration-300 group",
                  isActive ? "bg-indigo-600 shadow-2xl shadow-indigo-600/20 ring-1 ring-white/20" : "hover:bg-white/5"
                )}
              >
                <div className="relative shrink-0">
                  <div className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black shadow-md transition-all duration-500",
                    isActive ? "from-white/20 to-white/10" : getAvatarColor(chat.name)
                  )}>
                    {chat.name.charAt(0)}
                  </div>
                  {chat.online && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0c0f16]" />
                  )}
                </div>
                <div className="hidden sm:block flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={cn("text-[13px] font-black truncate uppercase tracking-tight", isActive ? "text-white" : "text-white group-hover:text-indigo-400")}>{chat.name}</p>
                    <span className={cn("text-[9px] font-bold uppercase", isActive ? "text-white/60" : "text-slate-600")}>{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={cn("text-[11px] font-medium truncate", isActive ? "text-indigo-100" : "text-slate-500")}>{chat.lastMsg}</p>
                    {chat.unread > 0 && !isActive && (
                      <span className="w-5 h-5 bg-indigo-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CHAT CONTENT: DARK GLASS ── */}
      <div className={cn(
        "flex-1 flex flex-col bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[32px] sm:rounded-[48px] border border-white/10 shadow-2xl overflow-hidden relative ring-1 ring-white/5"
      )}>
        {activeChat ? (
          <>
            {/* Background Glows */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
               <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/5 blur-[120px]" />
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/5 blur-[120px]" />
            </div>

            {/* Header */}
            <header className="px-8 py-6 flex items-center justify-between bg-white/[0.02] border-b border-white/5 sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black shadow-lg", getAvatarColor(selectedChatData?.name))}>
                    {selectedChatData?.name?.charAt(0)}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0c0f16]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none">{selectedChatData?.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active Link</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {[Phone, Video, MoreVertical].map((Icon, i) => (
                  <button key={i} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10 transition-all ring-1 ring-white/5">
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-10 py-10 space-y-8 no-scrollbar bg-gradient-to-b from-[#0c0f16]/20 to-transparent">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id || i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn("flex", msg.sender === 'me' ? "justify-end" : "justify-start")}
                >
                  <div className={cn(
                    "max-w-[70%] p-6 rounded-[32px] shadow-2xl relative group",
                    msg.sender === 'me' 
                      ? "bg-indigo-600 text-white rounded-tr-none ring-1 ring-white/20" 
                      : "bg-white/5 text-slate-200 rounded-tl-none border border-white/10 ring-1 ring-white/5"
                  )}>
                    <p className="text-[15px] font-medium leading-relaxed">{msg.text}</p>
                    <div className={cn(
                      "flex items-center gap-2 mt-3 opacity-40",
                      msg.sender === 'me' ? "justify-end" : "justify-start"
                    )}>
                      <span className="text-[9px] font-black uppercase tracking-widest">{msg.time}</span>
                      {msg.sender === 'me' && <CheckCheck size={14} className={cn(msg.isRead ? "text-indigo-200" : "text-white")} />}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-8 bg-white/[0.02] border-t border-white/5">
              <form 
                onSubmit={handleSend}
                className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 pl-6 rounded-[32px] ring-1 ring-white/5 focus-within:border-indigo-500/50 transition-all shadow-2xl"
              >
                <button type="button" className="text-slate-500 hover:text-white transition-colors">
                  <Smile size={22} />
                </button>
                <button type="button" className="text-slate-500 hover:text-white transition-colors">
                  <Paperclip size={20} className="rotate-45" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Sync transmission..."
                  className="flex-1 bg-transparent border-none h-12 text-sm font-medium text-white outline-none placeholder:text-slate-700"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!message.trim()}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    message.trim() ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-white/5 text-slate-700"
                  )}
                >
                  <Send size={18} className="ml-0.5" />
                </motion.button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 h-full">
            <div className="w-32 h-32 bg-indigo-600/10 border border-indigo-500/20 rounded-[40px] flex items-center justify-center mb-8 relative shadow-2xl">
              <MessageSquare size={48} className="text-indigo-400" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-3 -right-3 w-12 h-12 bg-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center border border-indigo-400/50"
              >
                <Zap size={24} className="text-white fill-white/20" />
              </motion.div>
            </div>
            <h3 className="text-3xl font-black text-white mb-3 tracking-tight uppercase">Select Node</h3>
            <p className="text-[11px] font-black text-slate-500 leading-relaxed uppercase tracking-[0.4em] max-w-xs">
              Initialize high-fidelity link with your professional network.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
