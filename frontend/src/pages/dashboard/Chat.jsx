import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, MoreVertical, ArrowLeft, Phone, Video, Smile, X, Check, CheckCheck, ImageIcon } from 'lucide-react';

const INDIGO = {
  50:  '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
};

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

const emojis = ['😊','😂','❤️','👍','🎉','🔥','✅','😍','🙌','💯','😎','🤔','👋','🚀','💡'];

function Avatar({ name, size = 40, online, ring }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size, height: size,
        background: INDIGO[100],
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 600, fontSize: size * 0.38,
        color: INDIGO[600],
        border: ring ? `2px solid ${INDIGO[400]}` : 'none',
      }}>{name.charAt(0)}</div>
      {online && (
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 11, height: 11,
          background: '#22c55e',
          borderRadius: '50%',
          border: '2px solid white',
        }} />
      )}
    </div>
  );
}

function MessageStatus({ status }) {
  if (status === 'sent') return <Check size={12} style={{ color: INDIGO[300] }} />;
  if (status === 'delivered') return <CheckCheck size={12} style={{ color: INDIGO[300] }} />;
  if (status === 'read') return <CheckCheck size={12} style={{ color: '#22c55e' }} />;
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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

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

  const getLastMsg = (chat) => {
    const last = chat.messages[chat.messages.length - 1];
    return last ? last.text : '';
  };

  const selectChat = (id) => {
    setActiveId(id);
    if (window.innerWidth < 640) setShowSidebar(false);
  };

  return (
    <div className="min-h-screen bg-purple-50 px-4 pt-24 pb-8">
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 160px)',
        minHeight: 520,
        background: 'white',
        borderRadius: 20,
        border: `1px solid ${INDIGO[100]}`,
        overflow: 'hidden',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* SIDEBAR */}
      <div style={{
        width: 300,
        minWidth: 300,
        borderRight: `1px solid ${INDIGO[100]}`,
        display: 'flex',
        flexDirection: 'column',
        background: '#fafafa',
        transition: 'transform 0.25s ease',
        position: window.innerWidth < 640 ? 'absolute' : 'relative',
        zIndex: 10,
        height: '100%',
        transform: (window.innerWidth < 640 && !showSidebar) ? 'translateX(-100%)' : 'translateX(0)',
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '20px 16px 12px', borderBottom: `1px solid ${INDIGO[50]}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontWeight: 600, fontSize: 17, color: '#111' }}>Messages</span>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: INDIGO[500], display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'white', border: `1px solid ${INDIGO[100]}`,
            borderRadius: 10, padding: '7px 12px',
          }}>
            <Search size={14} color={INDIGO[400]} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13, width: '100%', color: '#333',
              }}
            />
          </div>
        </div>

        {/* Chat List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
          {filteredChats.map(chat => {
            const isActive = chat.id === activeId;
            return (
              <button
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 10px', borderRadius: 14, marginBottom: 4,
                  border: isActive ? `1px solid ${INDIGO[100]}` : '1px solid transparent',
                  background: isActive ? 'white' : 'transparent',
                  cursor: 'pointer', textAlign: 'left',
                  boxShadow: isActive ? `0 2px 8px ${INDIGO[100]}` : 'none',
                  transition: 'all 0.15s',
                }}
              >
                <Avatar name={chat.name} size={44} online={chat.online} ring={isActive} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, color: '#111' }}>{chat.name}</span>
                    <span style={{ fontSize: 10.5, color: '#aaa', fontWeight: 500 }}>
                      {chat.messages[chat.messages.length - 1]?.time}
                    </span>
                  </div>
                  <p style={{
                    fontSize: 12, color: '#888', margin: '2px 0 0',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    maxWidth: 150,
                  }}>{getLastMsg(chat)}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: `1px solid ${INDIGO[100]}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setShowSidebar(true)}
              style={{
                display: window.innerWidth < 640 ? 'flex' : 'none',
                alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', cursor: 'pointer',
                color: INDIGO[500], padding: 4,
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <Avatar name={activeChat?.name || ''} size={40} online={activeChat?.online} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14.5, color: '#111' }}>{activeChat?.name}</div>
              <div style={{ fontSize: 11.5, color: activeChat?.online ? '#22c55e' : '#aaa', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                {activeChat?.online ? (
                  <><span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} /> Online</>
                ) : 'Offline'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[Phone, Video, MoreVertical].map((Icon, i) => (
              <button key={i} style={{
                width: 36, height: 36, borderRadius: 10,
                background: i === 2 ? 'transparent' : INDIGO[50],
                border: `1px solid ${i === 2 ? 'transparent' : INDIGO[100]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: INDIGO[500],
              }}>
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '20px 20px 8px',
          background: `linear-gradient(180deg, ${INDIGO[50]}22 0%, white 100%)`,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {activeChat?.messages.map((msg, i) => {
            const isMe = msg.from === 'me';
            return (
              <div key={msg.id} style={{
                display: 'flex', alignItems: 'flex-end', gap: 10,
                flexDirection: isMe ? 'row-reverse' : 'row',
                animation: i === activeChat.messages.length - 1 ? 'slideUp 0.2s ease' : 'none',
              }}>
                {!isMe && <Avatar name={activeChat.name} size={30} />}
                <div style={{ maxWidth: '65%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isMe ? INDIGO[500] : 'white',
                    border: isMe ? 'none' : `1px solid ${INDIGO[100]}`,
                    boxShadow: isMe ? `0 4px 12px ${INDIGO[200]}` : '0 1px 4px rgba(0,0,0,0.06)',
                    color: isMe ? 'white' : '#222',
                    fontSize: 13.5, lineHeight: 1.55, fontWeight: 400,
                  }}>{msg.text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                    <span style={{ fontSize: 10, color: '#bbb', fontWeight: 500 }}>{msg.time}</span>
                    {isMe && <MessageStatus status={msg.status} />}
                  </div>
                </div>
              </div>
            );
          })}

          {typing && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <Avatar name={activeChat?.name || ''} size={30} />
              <div style={{
                padding: '12px 16px', borderRadius: '16px 16px 16px 4px',
                background: 'white', border: `1px solid ${INDIGO[100]}`,
                display: 'flex', gap: 5, alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: INDIGO[300],
                    animation: `bounce 1.2s ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoji Picker */}
        {showEmoji && (
          <div style={{
            padding: '10px 16px',
            borderTop: `1px solid ${INDIGO[50]}`,
            background: 'white',
            display: 'flex', flexWrap: 'wrap', gap: 8,
          }}>
            {emojis.map(e => (
              <button
                key={e}
                onClick={() => setMessage(m => m + e)}
                style={{
                  fontSize: 20, background: 'none', border: 'none',
                  cursor: 'pointer', borderRadius: 8, padding: 4,
                  transition: 'transform 0.1s',
                }}
                onMouseEnter={el => el.currentTarget.style.transform = 'scale(1.3)'}
                onMouseLeave={el => el.currentTarget.style.transform = 'scale(1)'}
              >{e}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{
          padding: '12px 16px 14px',
          borderTop: `1px solid ${INDIGO[100]}`,
          background: 'white',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: INDIGO[50],
            border: `1px solid ${INDIGO[200]}`,
            borderRadius: 16, padding: '8px 10px 8px 14px',
          }}>
            <button
              onClick={() => setShowEmoji(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: showEmoji ? INDIGO[500] : '#aaa', display: 'flex', padding: 2 }}
            >
              {showEmoji ? <X size={18} /> : <Smile size={18} />}
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex', padding: 2 }}>
              <Paperclip size={18} />
            </button>
            <input
              ref={inputRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              style={{
                flex: 1, border: 'none', background: 'transparent',
                outline: 'none', fontSize: 13.5, color: '#222',
                fontFamily: 'inherit', lineHeight: '1.5',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              style={{
                width: 36, height: 36, borderRadius: 11,
                background: message.trim() ? INDIGO[500] : INDIGO[200],
                border: 'none', cursor: message.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', flexShrink: 0,
                boxShadow: message.trim() ? `0 4px 10px ${INDIGO[300]}` : 'none',
              }}
            >
              <Send size={16} color="white" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${INDIGO[200]}; border-radius: 4px; }
      `}</style>
    </div>
  );
}