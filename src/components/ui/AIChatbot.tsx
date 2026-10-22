import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Trash2,
  X,
  Sparkles,
  ThumbsUp,
  Heart,
  Copy,
  Check,
  Compass,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChatMessage, ChatAction } from '../../types';
import { sendChatMessage } from '../../services/api';
import { sound } from '../../utils/audio';

interface AIChatbotProps {
  onNavigate: (path: string) => void;
}

// Initial welcoming guided tour
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome_1',
    sender: 'assistant',
    text: "🌍 **Welcome to my 3D World!**\n\nI'm **Deva**, your spatial globe guide & creative technologist.\n\nI can navigate you to any landmark, showcase my **3D WebGL physics engines**, explore verified **hackathon certificates**, or take you through my career story. Where would you like to travel?",
    timestamp: 'Just now',
    actions: [
      { label: '🏢 Explore 3D Projects', path: '/projects' },
      { label: '📜 3D Certificate Hallway', path: '/certificates' },
      { label: '👩‍💻 Who is Devaroopa?', path: '/profile' },
      { label: '🎈 Send Orbital Transmission', path: '/contact' },
    ],
  },
];

// Interactive rotating prompt invitations for the floating callout
const CALLOUT_TIPS = [
  { icon: '🌍', text: 'Need a guided tour of the 3D globe?', prompt: 'Can you give me a tour of this 3D globe?' },
  { icon: '🚀', text: 'Ask about 3D WebGL physics projects!', prompt: 'What are your top 3D WebGL projects?' },
  { icon: '📜', text: 'Explore verified Hackathon awards!', prompt: 'Show me your hackathon certificates and awards' },
  { icon: '👩‍💻', text: 'Discover Devaroopa\'s story & skills', prompt: 'Tell me about Devaroopa and her background' },
  { icon: '✨', text: 'How to control this interactive globe?', prompt: 'How do I navigate and interact with this 3D globe?' },
];

// Quick category exploration buttons
const EXPLORATION_CHIPS = [
  { icon: '🏢', label: '3D Projects', query: 'Show me your top 3D WebGL and interactive projects' },
  { icon: '📜', label: 'Certificates', query: 'Tell me about your hackathon awards and certificates' },
  { icon: '👩‍💻', label: 'Story & Skills', query: 'Who is Devaroopa? What is your tech stack and experience?' },
  { icon: '🕹️', label: 'Globe Controls', query: 'How do I rotate, zoom, and navigate landmarks on the globe?' },
  { icon: '📬', label: 'Get in Touch', query: 'How can I contact or collaborate with Devaroopa?' },
  { icon: '🎲', label: 'Surprise Me', query: 'Tell me an interesting fun fact or secret about this portfolio!' },
];

export const AIChatbot: React.FC<AIChatbotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, 'up' | 'heart' | null>>({});
  const [activeTipIdx, setActiveTipIdx] = useState(0);
  const [dismissCallout, setDismissCallout] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotate callout tip every 7 seconds when chat is closed
  useEffect(() => {
    if (isOpen || dismissCallout) return;
    const interval = setInterval(() => {
      setActiveTipIdx((prev) => (prev + 1) % CALLOUT_TIPS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isOpen, dismissCallout]);

  // Auto-scroll when messages update
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('auto');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, scrollToBottom]);

  // Audio helper respecting local toggle
  const playSfx = (type: 'click' | 'chime' | 'zoom') => {
    if (!isAudioEnabled) return;
    if (type === 'click') sound.playClick();
    if (type === 'chime') sound.playChime();
    if (type === 'zoom') sound.playZoom();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    playSfx('click');

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
        text: res.reply || "I'm right here to guide you around Deva's 3D universe!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: res.actions,
      };

      setMessages((prev) => [...prev, botMsg]);
      playSfx('chime');
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: "I encountered a minor atmospheric disturbance, but you can jump directly to any of Deva's landmarks!",
        timestamp: 'Just now',
        actions: [
          { label: '🏢 Explore 3D Projects', path: '/projects' },
          { label: '📜 3D Certificate Hallway', path: '/certificates' },
          { label: '👩‍💻 Read Personal Story', path: '/profile' },
        ],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: ChatAction) => {
    playSfx('click');
    onNavigate(action.path);
    // On mobile devices, minimize chat to let the user see the page
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    playSfx('click');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReaction = (id: string, type: 'up' | 'heart', event?: React.MouseEvent) => {
    playSfx('click');
    setLikedMap((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));

    if (type === 'heart') {
      const rect = event?.currentTarget.getBoundingClientRect();
      const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.85;
      const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.85;
      confetti({
        particleCount: 22,
        spread: 45,
        startVelocity: 18,
        origin: { x, y },
        colors: ['#F26A1F', '#47c7ac', '#f59e0b', '#ec4899'],
        disableForReducedMotion: true,
      });
    }
  };

  const handleClearChat = () => {
    playSfx('click');
    setMessages(INITIAL_MESSAGES);
  };

  // Helper to render bold markdown and clean line breaks
  const formatMessageText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={lIdx} className="block min-h-[1.25em]">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-extrabold text-[#141414]">
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
      {/* ========================================================
          1. FLOATING COMPANION TRIGGER (Closed State)
          - Neo-brutalist ink outline + tactile hard shadow
          - Matching Global Theme: Mint Teal + Tangerine + Ink Slate
          - Interactive rotating speech balloon above
          - Character avatar with glowing online pulse
         ======================================================== */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed bottom-6 right-5 sm:right-7 z-40 select-none flex flex-col items-end"
          >
            {/* Interactive Rotating Speech Bubble Callout */}
            {!dismissCallout && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                key={activeTipIdx}
                className="relative mb-2.5 max-w-[270px] sm:max-w-[310px] group/tip"
              >
                <div
                  onClick={() => {
                    setIsOpen(true);
                    handleSendMessage(CALLOUT_TIPS[activeTipIdx].prompt);
                  }}
                  className="cursor-pointer bg-[#fffdf9] border-2 border-[#141414] px-3.5 py-2 rounded-2xl shadow-[3px_3px_0px_#141414] hover:shadow-[4px_4px_0px_#F26A1F] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-2.5"
                >
                  <span className="text-lg shrink-0 animate-bounce [animation-duration:2s]">
                    {CALLOUT_TIPS[activeTipIdx].icon}
                  </span>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[11px] sm:text-xs font-bold text-[#141414] leading-tight line-clamp-2">
                      {CALLOUT_TIPS[activeTipIdx].text}
                    </p>
                    <span className="text-[10px] font-mono font-bold text-[#F26A1F] flex items-center gap-1 mt-0.5">
                      <span>Tap to ask</span>
                      <span>→</span>
                    </span>
                  </div>

                  {/* Dismiss Callout Cross */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDismissCallout(true);
                    }}
                    title="Dismiss tip"
                    className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Speech Bubble Downward Tail */}
                <div className="absolute right-7 -bottom-2 w-3.5 h-3.5 bg-[#fffdf9] border-r-2 border-b-2 border-[#141414] rotate-45" />
              </motion.div>
            )}

            {/* Main Interactive Companion Trigger Button */}
            <button
              onClick={() => {
                playSfx('click');
                setIsOpen(true);
              }}
              title="Chat with Deva, 3D Spatial Guide"
              className="group relative flex items-center gap-3 bg-[#fffdf9] border-2 border-[#141414] rounded-full p-2 pr-4 sm:pr-5 shadow-[4px_4px_0px_#141414] hover:shadow-[5px_5px_0px_#F26A1F] active:shadow-[1px_1px_0px_#141414] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 cursor-pointer overflow-visible"
            >
              {/* Character Avatar with Online Indicator */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#141414] bg-[#47c7ac]/20 shadow-xs">
                  <img
                    src="/deva_avatar.jpg"
                    alt="Deva AI Guide"
                    onError={(e) => {
                      e.currentTarget.src = '/alby_avatar.jpg';
                    }}
                    className="w-full h-full object-cover object-top scale-105 group-hover:scale-115 transition-transform duration-300"
                  />
                </div>
                {/* Glowing Emerald Pulse Beacon */}
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#fffdf9] shadow-xs animate-pulse" />
              </div>

              {/* Text: DEVA / Spatial Guide */}
              <div className="text-left flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="font-doodle-heading text-base sm:text-lg font-black text-[#141414] tracking-wide leading-none group-hover:text-[#F26A1F] transition-colors">
                    Ask Deva
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#47c7ac]/25 text-teal-950 rounded-md border border-[#141414]/20 leading-none">
                    AI 3D
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-tight flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3 text-[#F26A1F] animate-spin-slow" />
                  <span>Spatial Guide · Online</span>
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          2. EXPANDED CHATBOT WINDOW (Interactive Spatial Studio)
          - Neo-brutalist ink border (#141414) + signature hard shadow
          - Global Theme: Mint Teal + Tangerine + Ink Slate
          - Resizable: Standard vs Studio Expanded mode
          - Interactive quick chips, feedback reactions, sound effects
         ======================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 35 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-7 z-50 bg-[#fffdfa] rounded-3xl border-[2.5px] border-[#141414] shadow-[6px_6px_0px_#141414] sm:shadow-[8px_8px_0px_#141414] flex flex-col overflow-hidden select-none transition-all duration-300 ${
              isExpanded
                ? 'w-[520px] max-w-[calc(100vw-2rem)] h-[720px] max-h-[92vh]'
                : 'w-[380px] sm:w-[430px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[86vh]'
            }`}
          >
            {/* Top Multi-Color Signature Ribbon (Mint Teal + Orange + Deep Charcoal) */}
            <div className="h-2 w-full grid grid-cols-3 shrink-0">
              <div className="bg-[#47c7ac]" />
              <div className="bg-[#F26A1F]" />
              <div className="bg-[#141414]" />
            </div>

            {/* ================= HEADER ================= */}
            <div className="p-3.5 sm:p-4 bg-[#fffdfa] border-b-2 border-[#141414] flex items-center justify-between shrink-0">
              {/* Left: Deva Identity & Live Status */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#141414] bg-[#47c7ac]/20 shadow-xs">
                    <img
                      src="/deva_avatar.jpg"
                      alt="Deva"
                      onError={(e) => {
                        e.currentTarget.src = '/alby_avatar.jpg';
                      }}
                      className="w-full h-full object-cover object-top scale-105"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#fffdfa] shadow-xs" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-doodle-heading text-lg sm:text-xl font-black text-[#141414] tracking-wide leading-none">
                      Deva
                    </h3>
                    <span className="px-2 py-0.5 bg-[#F26A1F]/15 text-[#F26A1F] text-[10px] font-mono font-black uppercase rounded-md border border-[#F26A1F]/30 leading-none">
                      Guide
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>3D Diorama Companion · Ready</span>
                  </p>
                </div>
              </div>

              {/* Right: Interactive Toolbar Controls */}
              <div className="flex items-center gap-1">
                {/* Audio Effects Toggle */}
                <button
                  onClick={() => {
                    setIsAudioEnabled(!isAudioEnabled);
                    if (!isAudioEnabled) sound.playClick();
                  }}
                  title={isAudioEnabled ? 'Mute Chat Sound Effects' : 'Enable Chat Sound Effects'}
                  className={`p-2 rounded-xl border border-transparent hover:border-[#141414] hover:bg-slate-100 transition-all cursor-pointer ${
                    isAudioEnabled ? 'text-[#141414]' : 'text-slate-400 line-through'
                  }`}
                >
                  {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Clear History */}
                <button
                  onClick={handleClearChat}
                  title="Clear Conversation History"
                  className="p-2 text-slate-500 hover:text-[#141414] rounded-xl border border-transparent hover:border-[#141414] hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Studio Expand / Compact Toggle (Desktop Only) */}
                <button
                  onClick={() => {
                    playSfx('click');
                    setIsExpanded(!isExpanded);
                  }}
                  title={isExpanded ? 'Compact View' : 'Studio Expanded View'}
                  className="hidden sm:inline-flex p-2 text-slate-500 hover:text-[#141414] rounded-xl border border-transparent hover:border-[#141414] hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    playSfx('click');
                    setIsOpen(false);
                  }}
                  title="Close Chat"
                  className="p-2 text-[#141414] hover:bg-rose-50 hover:text-rose-600 rounded-xl border border-transparent hover:border-[#141414] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Interactive Context Banner Strip */}
            <div className="px-3.5 py-1.5 bg-[#47c7ac]/15 border-b border-[#141414]/15 flex items-center justify-between text-[11px] font-bold text-teal-950 shrink-0">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#0284c7] animate-spin-slow" />
                <span>Navigating: 3D Spatial Globe</span>
              </span>
              <span className="font-mono text-[10px] text-teal-800">
                WebGL 60 FPS
              </span>
            </div>

            {/* ================= QUICK EXPLORATION CATEGORY PILLS ================= */}
            <div className="px-3 py-2 bg-[#fffdf9] border-b-2 border-[#141414]/20 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
              {EXPLORATION_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.query)}
                  className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-amber-50 active:bg-amber-100 text-[#141414] text-[11px] font-bold rounded-lg border-2 border-[#141414] shadow-[2px_2px_0px_#141414] hover:shadow-[2px_2px_0px_#F26A1F] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            {/* ================= MESSAGES SCROLL AREA ================= */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] bg-[#fffdfa]/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Sender Tag */}
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      {msg.sender === 'user' ? 'You' : 'Deva · AI'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Bubble Card */}
                  <div
                    className={`relative max-w-[88%] sm:max-w-[84%] px-4 py-3.5 text-xs sm:text-[13px] leading-relaxed transition-all ${
                      msg.sender === 'user'
                        ? 'bg-[#F26A1F] text-white border-2 border-[#141414] shadow-[3px_3px_0px_#141414] rounded-2xl rounded-br-xs font-semibold'
                        : 'bg-white text-slate-900 border-2 border-[#141414] shadow-[3px_3px_0px_#141414] rounded-2xl rounded-tl-xs font-medium'
                    }`}
                  >
                    {formatMessageText(msg.text)}

                    {/* Interactive Action Navigation Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t-2 border-[#141414]/10 flex flex-wrap gap-2">
                        {msg.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleActionClick(act)}
                            className="px-3 py-1.5 bg-[#47c7ac]/20 hover:bg-[#47c7ac]/35 text-[#141414] border-2 border-[#141414] font-bold text-[11px] sm:text-xs rounded-xl shadow-[2px_2px_0px_#141414] hover:shadow-[3px_3px_0px_#F26A1F] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#F26A1F] stroke-[2.5]" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Micro-Reactions Bar (For Assistant Messages) */}
                  {msg.sender === 'assistant' && (
                    <div className="flex items-center gap-1 mt-1.5 px-1">
                      {/* Thumbs Up */}
                      <button
                        onClick={(e) => handleReaction(msg.id, 'up', e)}
                        title="Helpful response"
                        className={`p-1 rounded-md border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          likedMap[msg.id] === 'up'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-400 shadow-2xs'
                            : 'text-slate-400 hover:text-[#141414] border-transparent hover:border-slate-200'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        {likedMap[msg.id] === 'up' && <span>Helpful</span>}
                      </button>

                      {/* Heart */}
                      <button
                        onClick={(e) => handleReaction(msg.id, 'heart', e)}
                        title="Love this answer"
                        className={`p-1 rounded-md border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          likedMap[msg.id] === 'heart'
                            ? 'bg-rose-50 text-rose-600 border-rose-400 shadow-2xs'
                            : 'text-slate-400 hover:text-rose-500 border-transparent hover:border-slate-200'
                        }`}
                      >
                        <Heart className="w-3 h-3 fill-current" />
                      </button>

                      {/* Copy Text */}
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        title="Copy message text"
                        className="p-1 rounded-md border text-[10px] text-slate-400 hover:text-[#141414] border-transparent hover:border-slate-200 transition-all cursor-pointer flex items-center gap-1"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Dynamic Animated Sketching Typing Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2.5 p-3 px-4 bg-white border-2 border-[#141414] shadow-[3px_3px_0px_#141414] rounded-2xl rounded-tl-xs w-fit">
                  <div className="w-6 h-6 rounded-full bg-[#47c7ac]/20 border border-[#141414] flex items-center justify-center text-xs">
                    ✍️
                  </div>
                  <span className="text-xs font-bold text-[#141414]">Deva is sketching response</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F26A1F] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F26A1F] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F26A1F] animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ================= COMPOSER & INPUT BAR ================= */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#fffdfa] border-t-2 border-[#141414] flex items-center gap-2 shrink-0"
            >
              {/* Quick Action Emoji / Idea Button */}
              <button
                type="button"
                onClick={() => handleSendMessage('Give me a quick tour recommendation of your 3D world!')}
                title="Quick recommendation"
                className="p-2 bg-amber-100 hover:bg-amber-200 text-[#141414] border-2 border-[#141414] rounded-xl shadow-[2px_2px_0px_#141414] hover:shadow-[3px_3px_0px_#F26A1F] transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4 text-[#F26A1F]" />
              </button>

              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Deva about projects, certificates, or 3D navigation..."
                className="flex-1 bg-white text-[#141414] text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border-2 border-[#141414] focus:border-[#F26A1F] focus:outline-hidden transition-all placeholder:text-slate-400 font-medium shadow-[2px_2px_0px_#141414]"
              />

              {/* Bold Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2.5 bg-[#F26A1F] hover:bg-[#ea580c] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-xl border-2 border-[#141414] shadow-[3px_3px_0px_#141414] hover:shadow-[4px_4px_0px_#141414] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center shrink-0 gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
