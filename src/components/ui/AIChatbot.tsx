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
    text: "👋 Hi! I'm **Alby**, Devaroopa's AI guide.\n\nI can answer questions about her **3D WebGL projects**, **hackathon awards**, **technical skills**, or guide you through the interactive globe. How can I help you today?",
    timestamp: 'Just now',
    actions: [
      { label: '🚀 Explore Projects', path: '/projects' },
      { label: '📜 3D Certificate Hallway', path: '/certificates' },
      { label: '👩‍💻 Who is Devaroopa?', path: '/profile' },
      { label: '📬 Get in Touch', path: '/contact' },
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
      {/* 1. FLOATING PILL BUTTON ON THE RIGHT SIDE (Matching the User's Image) */}
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
              title="Chat with Alby, Devaroopa's AI Assistant"
              className="group relative p-[2.5px] rounded-full bg-gradient-to-r from-blue-600 via-sky-400 to-orange-500 shadow-[0_8px_24px_rgba(37,99,235,0.28)] hover:shadow-[0_12px_32px_rgba(249,115,22,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer block"
            >
              {/* Inner white pill container */}
              <div className="bg-white rounded-full py-1.5 pl-1.5 pr-4 sm:pr-5 flex items-center gap-2.5 sm:gap-3 transition-colors">
                {/* 3D Character Avatar with Online Dot */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-slate-200 bg-sky-50 shadow-inner">
                    <img
                      src="/alby_avatar.jpg"
                      alt="Alby - AI Assistant"
                      className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  {/* Glowing Green Online Indicator */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs animate-pulse" />
                </div>

                {/* Text: Need help? Ask Alby */}
                <div className="text-left leading-none flex flex-col justify-center">
                  <span className="text-[11px] sm:text-xs font-bold text-blue-600 tracking-tight block pb-1">
                    Need help?
                  </span>
                  <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight block group-hover:text-blue-700 transition-colors">
                    Ask Alby
                  </span>
                </div>

                {/* Subtle Pulse Star Indicator */}
                <div className="ml-0.5 text-amber-500 text-xs hidden sm:block animate-pulse">
                  ✨
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CHATBOT WINDOW (Right-Side Drawer / Dialog) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed bottom-4 sm:bottom-6 right-4 sm:right-7 z-50 w-[360px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-2 border-slate-900 flex flex-col overflow-hidden select-none"
          >
            {/* Header: Gradient Banner + Title & Controls */}
            <div className="relative bg-white border-b-2 border-slate-900 shrink-0">
              {/* Top Rainbow Accent Strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-orange-500" />

              <div className="p-3 sm:p-4 flex items-center justify-between">
                {/* Left: Avatar + Identity */}
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-sky-50">
                      <img
                        src="/alby_avatar.jpg"
                        alt="Alby"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black text-slate-950 tracking-tight">Alby</h3>
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-mono font-bold rounded-md">
                        AI Guide
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Online · Ready to help
                    </p>
                  </div>
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClearChat}
                    title="Clear Chat Conversation"
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    🗑️
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsOpen(false);
                    }}
                    title="Minimize Chat"
                    className="p-1.5 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer font-bold text-base leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/70">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`relative max-w-[85%] px-4 py-3 rounded-2xl text-xs shadow-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-slate-950 text-white rounded-br-xs'
                        : 'bg-white text-slate-900 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-tl-xs'
                    }`}
                  >
                    {formatMessageText(msg.text)}

                    {/* Interactive Navigation Action Pills */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap gap-1.5">
                        {msg.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleActionClick(act)}
                            className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] rounded-lg border border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
                          >
                            <span>{act.label}</span>
                            <span className="text-[10px]">→</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Typing Animated Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-white border-2 border-slate-900 rounded-2xl rounded-tl-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-fit">
                  <span className="text-xs font-bold text-slate-600">Alby is typing</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starters Row (shown if only 1 message exists) */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 bg-white border-t border-slate-200 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
                {[
                  { text: '👩‍💻 Tell me about Deva', send: 'Tell me about Devaroopa and her background' },
                  { text: '🚀 Best 3D Projects', send: 'What are Devaroopa\'s top featured projects?' },
                  { text: '📜 Certificates', send: 'Show me her certificates and hackathon awards' },
                  { text: '📬 How to contact?', send: 'How can I contact Devaroopa?' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.send)}
                    className="whitespace-nowrap px-2.5 py-1 bg-stone-100 hover:bg-amber-100 text-slate-800 text-[11px] font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
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
              className="p-3 bg-white border-t-2 border-slate-900 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Alby about projects, skills, or navigation..."
                className="flex-1 bg-stone-100 focus:bg-white text-slate-900 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-slate-900 focus:outline-hidden transition-all placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-3.5 py-2.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all cursor-pointer shadow-xs text-xs flex items-center justify-center shrink-0"
              >
                <span>Send</span>
                <span className="text-amber-400 ml-1">➤</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
