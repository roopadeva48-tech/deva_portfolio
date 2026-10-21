import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, ChatAction } from '../../types';
import { sendChatMessage } from '../../services/api';
import { sound } from '../../utils/audio';

interface AIChatbotProps {
  onNavigate: (path: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome_1',
    sender: 'assistant',
    text: "🌍 **Welcome to my 3D World!**\n\nI'm **Deva**, your spatial globe guide.\n\nI can navigate you to any landmark, showcase my **3D WebGL physics engines**, explore verified **hackathon certificates**, or take you through my career story. Where would you like to travel?",
    timestamp: 'Just now',
    actions: [
      { label: '🏢 Explore Projects', path: '/projects' },
      { label: '📜 3D Certificate Hallway', path: '/certificates' },
      { label: '👩‍💻 Who is Devaroopa?', path: '/profile' },
      { label: '🎈 Send Transmission', path: '/contact' },
    ],
  },
];

export const AIChatbot: React.FC<AIChatbotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    sound.playClick();

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyForApi = messages.slice(-5).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await sendChatMessage(text, historyForApi);

      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: 'assistant',
        text: res.reply || "I'm here to help you navigate Devaroopa's portfolio!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: res.actions,
      };

      setMessages((prev) => [...prev, botMsg]);
      sound.playChime();
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: "I ran into a quick hiccup, but feel free to browse Devaroopa's projects or certificates directly!",
        timestamp: 'Just now',
        actions: [
          { label: '🚀 View Projects', path: '/projects' },
          { label: '📜 3D Certificate Hallway', path: '/certificates' },
        ],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: ChatAction) => {
    sound.playClick();
    onNavigate(action.path);
    // On small screens, close the chat to view the page
    if (window.innerWidth < 640) {
      setIsOpen(false);
    }
  };

  const handleClearChat = () => {
    sound.playClick();
    setMessages(INITIAL_MESSAGES);
  };

  // Helper to render bold markdown and line breaks
  const formatMessageText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, lIdx) => {
      // Process bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={lIdx} className="block min-h-[1.15em]">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-extrabold text-slate-950">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </span>
      );
    });
  };

  return (
    <>
      {/* 1. FLOATING PILL BUTTON ON THE RIGHT SIDE (Matching the Reference Image & Portfolio Theme) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="fixed bottom-6 right-5 sm:right-7 z-40 select-none"
          >
            {/* Outer gradient border wrapper */}
            <button
              onClick={() => {
                sound.playClick();
                setIsOpen(true);
              }}
              title="Chat with Deva, AI Portfolio Guide"
              className="group relative p-[2.5px] rounded-full bg-gradient-to-r from-[#0052FF] via-[#00A3FF] to-[#FF6B00] shadow-[0_10px_28px_rgba(0,102,255,0.32),0_4px_16px_rgba(255,107,0,0.25)] hover:shadow-[0_14px_36px_rgba(0,102,255,0.42),0_6px_22px_rgba(255,107,0,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer block"
            >
              {/* Inner white pill container */}
              <div className="bg-white rounded-full py-1.5 pl-1.5 pr-4 sm:pr-5 flex items-center gap-2.5 sm:gap-3 transition-colors">
                {/* 3D Character Avatar with Online Dot */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-slate-100 bg-sky-50 shadow-inner">
                    <img
                      src="/deva_avatar.jpg"
                      alt="Deva - AI Guide"
                      onError={(e) => {
                        e.currentTarget.src = '/alby_avatar.jpg';
                      }}
                      className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  {/* Glowing Green Online Indicator */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs animate-pulse" />
                </div>

                {/* Text: Need help? Ask Deva */}
                <div className="text-left leading-none flex flex-col justify-center">
                  <span className="text-[11px] sm:text-xs font-semibold text-[#0066FF] tracking-tight block pb-1">
                    Need help?
                  </span>
                  <span className="text-xs sm:text-sm font-black text-[#0047FF] tracking-tight block group-hover:text-blue-700 transition-colors">
                    Ask Deva
                  </span>
                </div>

                {/* Gradient 4-Point Star Sparkle Matching Image */}
                <div className="ml-1 shrink-0 animate-pulse">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-xs"
                  >
                    <defs>
                      <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fde047" />
                        <stop offset="45%" stopColor="#fb923c" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
                      fill="url(#sparkleGrad)"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CHATBOT WINDOW (Right-Side Drawer / Dialog) — GLOBE THEME */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed bottom-4 sm:bottom-6 right-4 sm:right-7 z-50 w-[360px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[590px] max-h-[85vh] bg-white/92 backdrop-blur-2xl rounded-[32px] border border-white/80 ring-1 ring-sky-300/50 shadow-[0_24px_70px_rgba(2,132,199,0.32),0_6px_28px_rgba(56,189,248,0.22)] flex flex-col overflow-hidden select-none"
          >
            {/* Ambient Celestial Glow in Background */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-200/40 via-transparent to-amber-100/30 -z-10" />

            {/* Header: Orbital Gradient Strip + Spatial Title & Controls */}
            <div className="relative bg-white/80 backdrop-blur-md border-b border-sky-100/80 shrink-0">
              {/* Top Orbital Gradient Strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#0052FF] via-[#00D2FF] to-[#FF8A00]" />

              <div className="p-3 sm:p-4 flex items-center justify-between">
                {/* Left: 3D Deva Avatar + Orbital Identity */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-sky-300 shadow-[0_2px_12px_rgba(56,189,248,0.4)] bg-sky-50">
                      <img
                        src="/deva_avatar.jpg"
                        alt="Deva"
                        onError={(e) => {
                          e.currentTarget.src = '/alby_avatar.jpg';
                        }}
                        className="w-full h-full object-cover object-top scale-105"
                      />
                    </div>
                    {/* Glowing Emerald Beacon */}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">Deva</h3>
                      <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200/80 text-[10px] font-mono font-bold rounded-full flex items-center gap-1 shadow-2xs">
                        <span>🌍</span>
                        <span>Globe Guide</span>
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5 pt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Orbiting Earth · Ready to navigate
                    </p>
                  </div>
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleClearChat}
                    title="Clear Conversation"
                    className="p-2 text-slate-400 hover:text-sky-700 hover:bg-sky-50/80 rounded-xl transition-colors cursor-pointer text-xs"
                  >
                    🗑️
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsOpen(false);
                    }}
                    title="Minimize Chat"
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-sky-50/80 rounded-xl transition-colors cursor-pointer font-bold text-base leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-sky-50/40 via-white/40 to-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`relative max-w-[88%] px-4 py-3.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-2xl rounded-br-xs shadow-[0_4px_16px_rgba(2,132,199,0.3)] font-medium'
                        : 'bg-white/95 text-slate-800 border border-sky-100/90 shadow-[0_6px_20px_rgba(56,189,248,0.12)] rounded-2xl rounded-tl-xs'
                    }`}
                  >
                    {/* Header Tag for Assistant */}
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-sky-600 uppercase tracking-wider pb-1.5 mb-1.5 border-b border-sky-100/60">
                        <span>🛰️</span>
                        <span>Orbital Transmission</span>
                      </div>
                    )}

                    {formatMessageText(msg.text)}

                    {/* Interactive Spatial Waypoint Action Pills */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3.5 pt-2.5 border-t border-sky-100 flex flex-wrap gap-2">
                        {msg.actions.map((act, aIdx) => {
                          // Dynamic Globe-themed gradients for each destination
                          let gradClass = 'from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-[0_3px_12px_rgba(14,165,233,0.35)]';
                          if (act.path.includes('certificate')) {
                            gradClass = 'from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-[0_3px_12px_rgba(245,158,11,0.35)]';
                          } else if (act.path.includes('profile')) {
                            gradClass = 'from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 shadow-[0_3px_12px_rgba(20,184,166,0.35)]';
                          } else if (act.path.includes('contact')) {
                            gradClass = 'from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 shadow-[0_3px_12px_rgba(99,102,241,0.35)]';
                          }

                          return (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(act)}
                              className={`px-3 py-1.5 bg-gradient-to-r ${gradClass} text-white font-bold text-[11px] rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5`}
                            >
                              <span>{act.label}</span>
                              <span className="text-[10px] opacity-90">→</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Typing Animated Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-white/95 border border-sky-200/80 rounded-2xl rounded-tl-xs shadow-[0_4px_14px_rgba(56,189,248,0.15)] w-fit">
                  <span className="text-xs font-bold text-sky-700">Deva is navigating</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starters Row (shown if only 1 message exists) */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 bg-white/80 border-t border-sky-100/80 overflow-x-auto flex gap-2 shrink-0 scrollbar-none">
                {[
                  { text: '👩‍💻 About Deva', send: 'Tell me about Devaroopa and her background' },
                  { text: '🏢 3D Projects', send: 'What are Devaroopa\'s top featured 3D WebGL projects?' },
                  { text: '📜 3D Certificates', send: 'Show me her certificates and hackathon awards' },
                  { text: '🎈 Contact Orbit', send: 'How can I contact Devaroopa to collaborate?' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.send)}
                    className="whitespace-nowrap px-3 py-1.5 bg-sky-50/90 hover:bg-sky-100 text-sky-950 text-[11px] font-semibold rounded-full border border-sky-200/70 shadow-2xs transition-all hover:scale-105 cursor-pointer"
                  >
                    {chip.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white/90 backdrop-blur-md border-t border-sky-100/90 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Deva about 3D landmarks, projects, or skills..."
                className="flex-1 bg-sky-50/60 focus:bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-2xl border border-sky-200/80 focus:border-sky-500 focus:ring-2 focus:ring-sky-400/20 focus:outline-hidden transition-all placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2.5 bg-gradient-to-r from-[#0052FF] via-[#00A3FF] to-[#0284C7] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all cursor-pointer shadow-[0_4px_14px_rgba(0,102,255,0.35)] text-xs flex items-center justify-center shrink-0 gap-1.5"
              >
                <span>Send</span>
                <span className="text-amber-300">🚀</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
