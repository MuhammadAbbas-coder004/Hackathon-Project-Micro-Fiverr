import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, MoreVertical, ArrowLeft, Phone, Video, Smile, X, Check, CheckCheck, ImageIcon, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialChats = [
  {
    id: 1,
    name: 'Alex Johnson',
    online: true,
    messages: [
      { id: 1, from: 'them', text: 'Hello! I am interested in your service. Can we talk about the delivery timeline?', time: '10:45 AM', status: 'read' },
      { id: 2, from: 'me', text: 'Of course! I can deliver the first draft by tomorrow. Does that work for you?', time: '10:47 AM', status: 'read' },
      { id: 3, from: 'them', text: 'I really liked the proposal. Let me review it tonight and get back to you.', time: '10:50 AM', status: 'read' },
    ],
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    online: false,
    messages: [
      { id: 1, from: 'them', text: 'Hi! Can we discuss the pricing for the project?', time: '9:20 AM', status: 'read' },
      { id: 2, from: 'me', text: 'Sure! I have sent over the detailed breakdown.', time: '9:35 AM', status: 'delivered' },
    ],
  },
  {
    id: 3,
    name: 'Michael Chen',
    online: true,
    messages: [
      { id: 1, from: 'them', text: 'Sent you the project files. Please check your email.', time: '8:00 AM', status: 'read' },
      { id: 2, from: 'me', text: 'Got them, thanks! Will review and respond shortly.', time: '8:15 AM', status: 'read' },
    ],
  },
];

const autoReplies = [
  "Got it, thanks for letting me know!",
  "Sounds great! I'll get back to you soon.",
  "Perfect, let me check on that.",
  "Absolutely! That works for me.",
  "Thanks for the update. I'll follow up shortly.",
];

const quickReactions = [
  { icon: 'ThumbsUp', label: '+1' },
  { icon: 'Heart', label: 'Love' },
  { icon: 'Zap', label: 'Fire' },
  { icon: 'Check', label: 'Done' },
  { icon: 'Star', label: 'Star' },
  { icon: 'Rocket', label: 'Go' },
];

function Avatar({ name, size = 40, online, active }) {
  return (
    <div className="relative shrink-0">
      <div 
        className={`rounded-2xl flex items-center justify-center font-black text-white transition-all duration-300 ${active ? 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-white/5 border border-white/10'}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {name.charAt(0)}
      </div>
      {online && (
        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0b0e14]" />
      )}
    </div>
  );
}

function MessageStatus({ status }) {
  if (status === 'sent') return <Check size={12} className="text-slate-500" />;
  if (status === 'delivered') return <CheckCheck size={12} className="text-slate-500" />;
  if (status === 'read') return <CheckCheck size={12} className="text-emerald-400" />;
  return null;
}

export default function Chat() {
  const [chats, setChats] = useState(initialChats);
  const [activeId, setActiveId] = useState(1);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeId);
  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, typing]);

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    const newMsg = { id: Date.now(), from: 'me', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'sent' };
    setChats(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...c.messages, newMsg] } : c));
    setMessage('');
    setShowEmoji(false);
    inputRef.current?.focus();

    setTimeout(() => {
      setChats(prev => prev.map(c => c.id === activeId
        ? { ...c, messages: c.messages.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m) }
        : c
      ));
      setTyping(true);
    }, 600);

    setTimeout(() => {
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replyMsg = { id: Date.now() + 1, from: 'them', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'read' };
      setTyping(false);
      setChats(prev => prev.map(c => c.id === activeId
        ? { ...c, messages: [...c.messages.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m), replyMsg] }
        : c
      ));
    }, 2000);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const selectChat = (id) => {
    setActiveId(id);
    if (window.innerWidth < 1024) setShowSidebar(false);
  };

  return (
    <div className="space-y-8 h-[calc(100vh-180px)] min-h-[600px]">
      
      {/* ── Header Area ── */}
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-8 py-4 bg-[#0c0f16]/90 backdrop-blur-3xl border border-white/10 rounded-full ring-1 ring-white/5 shadow-2xl flex items-center gap-5"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
             <MessageSquare size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-0.5">
               <Sparkles size={10} className="animate-pulse" />
               <span className="text-[8px] font-black uppercase tracking-[0.4em]">Comms Sync</span>
            </div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Messages</h1>
          </div>
        </motion.div>
      </div>

      {/* ── Chat Architecture (Liquid Glass) ── */}
      <div className="bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[40px] sm:rounded-[56px] shadow-2xl overflow-hidden ring-1 ring-white/5 h-full flex relative">
        
        {/* Sidebar */}
        <AnimatePresence>
          {(showSidebar || window.innerWidth >= 1024) && (
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute lg:relative z-40 w-[320px] h-full bg-[#0c0f16]/80 lg:bg-transparent border-r border-white/5 flex flex-col backdrop-blur-3xl lg:backdrop-blur-none"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-lg font-black text-white uppercase tracking-tighter">Identity Log</h2>
                   <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors border border-white/10">
                      <Search size={14} />
                   </button>
                </div>
                
                <div className="relative group">
                   <input 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Filter nodes..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-[11px] font-bold text-white uppercase tracking-widest placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-all"
                   />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 no-scrollbar">
                {filteredChats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => selectChat(chat.id)}
                    className={`w-full flex items-center gap-4 p-5 rounded-[28px] transition-all duration-300 group ${chat.id === activeId ? 'bg-indigo-600 shadow-2xl ring-1 ring-white/20' : 'hover:bg-white/5'}`}
                  >
                    <Avatar name={chat.name} size={48} online={chat.online} active={chat.id === activeId} />
                    <div className="flex-1 min-w-0 text-left">
                       <div className="flex justify-between items-center mb-1">
                          <span className={`font-black text-[13px] uppercase tracking-tight ${chat.id === activeId ? 'text-white' : 'text-white group-hover:text-indigo-400'}`}>{chat.name}</span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase">{chat.messages[chat.messages.length - 1]?.time}</span>
                       </div>
                       <p className={`text-[11px] font-medium truncate ${chat.id === activeId ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {chat.messages[chat.messages.length - 1]?.text}
                       </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          
          {/* Top Bar */}
          <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-5">
              <button onClick={() => setShowSidebar(true)} className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                 <ArrowLeft size={20} />
              </button>
              <Avatar name={activeChat?.name || ''} size={44} online={activeChat?.online} />
              <div>
                 <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{activeChat?.name}</h3>
                 <div className="flex items-center gap-2 mt-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${activeChat?.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                      {activeChat?.online ? 'Synchronized' : 'Offline'}
                    </span>
                 </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               {[Phone, Video, MoreVertical].map((Icon, i) => (
                  <button key={i} className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all border border-white/5">
                     <Icon size={18} />
                  </button>
               ))}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar bg-gradient-to-b from-[#0c0f16]/20 to-transparent">
            {activeChat?.messages.map((msg, i) => {
              const isMe = msg.from === 'me';
              return (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex items-end gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`max-w-[70%] sm:max-w-[60%] space-y-2`}>
                    <div 
                      className={`px-8 py-5 rounded-[32px] text-sm font-medium leading-relaxed shadow-2xl ${
                        isMe 
                        ? 'bg-indigo-600 text-white rounded-br-none ring-1 ring-white/20' 
                        : 'bg-white/5 text-slate-200 rounded-bl-none border border-white/10 ring-1 ring-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-3 px-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{msg.time}</span>
                      {isMe && <MessageStatus status={msg.status} />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {typing && (
              <div className="flex items-center gap-4">
                 <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-[28px] rounded-bl-none flex gap-2">
                    {[0,1,2].map(i => (
                       <div key={i} className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Unit */}
          <div className="p-10 bg-white/[0.02] border-t border-white/5">
             <div className="flex items-center gap-5 bg-white/5 border border-white/10 rounded-[32px] p-2 pr-2 pl-6 focus-within:border-indigo-500/50 transition-all ring-1 ring-white/5">
                <button 
                  onClick={() => setShowEmoji(!showEmoji)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${showEmoji ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
                >
                   <Smile size={20} />
                </button>
                <button className="text-slate-500 hover:text-white transition-all">
                   <Paperclip size={20} />
                </button>
                
                <input 
                  ref={inputRef}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Initialize data transfer..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-sm font-medium placeholder:text-slate-600 py-4"
                />

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    message.trim() 
                    ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                    : 'bg-white/5 text-slate-700'
                  }`}
                >
                   <Send size={20} />
                </motion.button>
             </div>
             
             {showEmoji && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-3 mt-6 p-6 bg-white/5 border border-white/10 rounded-[32px] ring-1 ring-white/5"
                >
                   {quickReactions.map(r => (
                     <button key={r.label} onClick={() => { setMessage(m => m + ` [${r.label}] `); setShowEmoji(false); }} className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all ring-1 ring-white/5">{r.label}</button>
                   ))}
                </motion.div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
