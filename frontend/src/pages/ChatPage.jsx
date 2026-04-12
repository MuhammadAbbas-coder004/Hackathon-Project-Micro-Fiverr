import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
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
  Check
} from 'lucide-react';
import { cn } from '../utils/cn';

const ChatPage = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const [activeChat, setActiveChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    if (user && user.id) {
      newSocket.emit("join_room", user.id);
    }

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
      const res = await axios.get('/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
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
        const res = await axios.get(`/api/chat/users/search?q=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
        const res = await axios.get(`/api/chat/${activeChat}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const formatted = res.data.map(msg => ({
          id: msg._id,
          text: msg.message,
          sender: msg.sender.toString() === user?.id?.toString() ? 'me' : 'them',
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: msg.isRead
        }));
        setMessages(formatted);

        if (res.data.some(msg => msg.sender.toString() !== user?.id?.toString() && !msg.isRead)) {
          await axios.put(`/api/chat/${activeChat}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
          if (socket) socket.emit("mark_read", { senderId: activeChat, readerId: user?.id });
        }
      } catch (err) {
        console.error("Error fetching messages", err);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [activeChat, token, user]);

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

  const selectedChatData =
    conversations.find(c => c.id.toString() === activeChat?.toString()) ||
    searchResults.find(u => u._id.toString() === activeChat?.toString());

  /* ── Avatar colour cycling ── */
  const avatarColors = [
    'bg-orange-100 text-orange-700',
    'bg-emerald-100 text-emerald-700',
    'bg-orange-100 text-orange-700',
    'bg-sky-100 text-sky-700',
    'bg-pink-100 text-pink-700',
  ];
  const getAvatarColor = (name = '') =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

  return (
    <div className="w-full h-[calc(100vh-160px)] min-h-[600px] flex">
      <div className="w-full h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex shadow-sm">

        {/* ── SIDEBAR ── */}
        <div className={cn(
          "w-full md:w-[320px] border-r border-zinc-100 dark:border-zinc-800 flex flex-col bg-zinc-50 dark:bg-zinc-950 shrink-0",
          activeChat ? "hidden md:flex" : "flex"
        )}>

          {/* Header */}
          <div className="px-5 pt-5 pb-4 space-y-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-500 text-zinc-900 dark:text-white tracking-tight">Messages</h2>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or start new chat"
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:border-orange-500 transition-colors"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-zinc-200 border-t-orange-500 rounded-full animate-spin" />
              )}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
            {searchQuery.trim().length > 0 ? (
              <>
                <p className="px-3 py-1 text-[10px] font-500 text-zinc-400 uppercase tracking-widest">Results</p>
                {searchResults.length === 0 && !isSearching ? (
                  <div className="py-16 text-center text-xs text-zinc-400">No users found</div>
                ) : searchResults.map(u => (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => handleSelectChat(u._id)}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                  >
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-500", getAvatarColor(u.name))}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-500 text-zinc-900 dark:text-white truncate">{u.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{u.email}</p>
                    </div>
                  </motion.div>
                ))}
              </>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40 py-24">
                <MessageSquare size={36} className="text-zinc-400" />
                <p className="text-xs text-zinc-400">No conversations yet</p>
              </div>
            ) : conversations.map((chat) => {
              const isActive = activeChat?.toString() === chat.id?.toString();
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors relative",
                    isActive
                      ? "bg-orange-500/10 dark:bg-orange-500/20"
                      : "hover:bg-white dark:hover:bg-zinc-800"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-500", isActive ? "bg-orange-500 text-white" : getAvatarColor(chat.name))}>
                      {chat.name.charAt(0).toUpperCase()}
                    </div>
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-50 dark:border-zinc-950" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={cn("text-sm font-500 truncate", isActive ? "text-orange-600 dark:text-orange-400" : "text-zinc-900 dark:text-white")}>{chat.name}</p>
                      <span className="text-[10px] text-zinc-400 shrink-0 ml-2">
                        {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate">{chat.lastMsg}</p>
                  </div>

                  {chat.unread > 0 && !isActive && (
                    <span className="w-5 h-5 bg-orange-500 text-white text-[10px] font-500 rounded-full flex items-center justify-center shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MAIN CHAT ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-900">

          {activeChat ? (
            <>
              {/* Chat Header */}
              <header className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveChat(null)} className="md:hidden p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 transition-colors mr-1">
                    <ArrowLeft size={18} />
                  </button>
                  <div className="relative">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-500", getAvatarColor(selectedChatData?.name))}>
                      {selectedChatData?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" />
                  </div>
                  <div>
                    <p className="text-sm font-500 text-zinc-900 dark:text-white leading-tight">{selectedChatData?.name}</p>
                    <p className="text-xs text-green-500 leading-tight">Online</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <Video size={15} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <MoreVertical size={15} />
                  </button>
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>

                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30">
                    <MessageSquare size={40} className="text-zinc-400" />
                    <p className="text-xs text-zinc-400">Send a message to start chatting</p>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={msg.id || idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className={cn("flex w-full", msg.sender === 'me' ? "justify-end" : "justify-start")}
                    >
                      <div className={cn("flex flex-col max-w-[68%]", msg.sender === 'me' ? "items-end" : "items-start")}>
                        <div className={cn(
                          "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                          msg.sender === 'me'
                            ? "bg-orange-500 text-white rounded-br-md"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md"
                        )}>
                          {msg.text}
                        </div>
                        <div className={cn("flex items-center gap-1.5 mt-1 px-1", msg.sender === 'me' ? "flex-row-reverse" : "flex-row")}>
                          <span className="text-[10px] text-zinc-400">{msg.time}</span>
                          {msg.sender === 'me' && (
                            <CheckCheck size={12} className={msg.isRead ? "text-orange-400" : "text-zinc-400"} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={scrollRef} />
              </div>

              {/* Input */}
              <footer className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-2 focus-within:border-orange-300 dark:focus-within:border-orange-700 transition-colors"
                >
                  <button type="button" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                    <Smile size={18} />
                  </button>
                  <button type="button" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                    <Paperclip size={18} />
                  </button>

                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none text-sm text-zinc-800 dark:text-zinc-200 outline-none placeholder:text-zinc-400 px-2"
                  />

                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.92 }}
                    disabled={!message.trim()}
                    className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-30 flex items-center justify-center transition-colors shrink-0"
                  >
                    <Send size={14} strokeWidth={2.5} className="text-white" />
                  </motion.button>
                </form>
              </footer>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
              <div className="w-16 h-16 bg-orange-500/10 dark:bg-orange-500/20 rounded-2xl flex items-center justify-center">
                <MessageSquare size={28} className="text-orange-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-500 text-zinc-900 dark:text-white">Your messages</h3>
                <p className="text-sm text-zinc-400 max-w-xs">
                  Select a conversation from the sidebar or search for a user to start chatting.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ChatPage;