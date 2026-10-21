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
                <div className="text-left leading-none flex flex-col justify-center pr-1 sm:pr-2">
                  <span className="text-[11px] sm:text-xs font-semibold text-[#0066FF] tracking-tight block pb-1">
                    Need help?
                  </span>
                  <span className="text-xs sm:text-sm font-black text-[#0047FF] tracking-tight block group-hover:text-blue-700 transition-colors">
                    Ask Deva
                  </span>
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CHATBOT WINDOW (Right-Side Drawer / Dialog) — UNIFIED CLEAN THEME */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed bottom-4 sm:bottom-6 right-4 sm:right-7 z-50 w-[360px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden select-none"
          >
            {/* Header: Clean Single Blue Top Strip + Title & Controls */}
            <div className="relative bg-white border-b border-slate-200 shrink-0">
              {/* Single Cohesive Blue Accent Line */}
              <div className="h-1 w-full bg-blue-600" />

              <div className="p-3 sm:p-4 flex items-center justify-between">
                {/* Left: 3D Deva Avatar + Identity */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
                      <img
                        src="/deva_avatar.jpg"
                        alt="Deva"
                        onError={(e) => {
                          e.currentTarget.src = '/alby_avatar.jpg';
                        }}
                        className="w-full h-full object-cover object-top scale-105"
                      />
                    </div>
                    {/* Glowing Online Dot */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">Deva</h3>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono font-medium rounded-full border border-slate-200">
                        AI Guide
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 pt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Online · Ready to help
                    </p>
                  </div>
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClearChat}
                    title="Clear Conversation"
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-xs"
                  >
                    🗑️
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsOpen(false);
                    }}
                    title="Minimize Chat"
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer font-bold text-base leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`relative max-w-[88%] px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-2xl rounded-br-xs shadow-xs font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/90 shadow-xs rounded-2xl rounded-tl-xs'
                    }`}
                  >
                    {formatMessageText(msg.text)}

                    {/* Interactive Action Pills — Unified Single-Color Style */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-2">
                        {msg.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleActionClick(act)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border border-blue-200/80 font-semibold text-[11px] rounded-xl transition-all duration-150 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>{act.label}</span>
                            <span className="text-[10px] text-blue-500 font-bold">→</span>
                          </button>
                        ))}
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
                <div className="flex items-center gap-2 p-2.5 px-3.5 bg-white border border-slate-200 rounded-2xl rounded-tl-xs shadow-xs w-fit">
                  <span className="text-xs font-medium text-slate-600">Deva is typing</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starters Row (shown if only 1 message exists) */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 bg-white border-t border-slate-200 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
                {[
                  { text: '👩‍💻 About Deva', send: 'Tell me about Devaroopa and her background' },
                  { text: '🏢 3D Projects', send: 'What are Devaroopa\'s top featured 3D WebGL projects?' },
                  { text: '📜 Certificates', send: 'Show me her certificates and hackathon awards' },
                  { text: '📬 Get in Touch', send: 'How can I contact Devaroopa to collaborate?' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.send)}
                    className="whitespace-nowrap px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-full border border-slate-200 transition-colors cursor-pointer"
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
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Deva about projects, skills, or navigation..."
                className="flex-1 bg-slate-50 focus:bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden transition-all placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all cursor-pointer shadow-xs text-xs flex items-center justify-center shrink-0 gap-1.5"
              >
                <span>Send</span>
                <span className="text-xs">➤</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
