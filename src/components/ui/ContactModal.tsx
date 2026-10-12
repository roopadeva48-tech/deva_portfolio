import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sendContactMessage } from '../../services/api';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

type AnimationStage =
  | 'running'
  | 'tripping'
  | 'flying'
  | 'fullscreen_envelope'
  | 'opening'
  | 'revealed';

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  // Animation state
  const [stage, setStage] = useState<AnimationStage>('running');
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Clear all sequence timers
  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Skip animation to final interactive page
  const handleSkip = () => {
    sound.playClick();
    clearTimers();
    setStage('revealed');
    setHasPlayedOnce(true);
  };

  // Replay animation sequence from the beginning
  const handleReplay = () => {
    sound.playClick();
    clearTimers();
    startAnimationSequence();
  };

  const startAnimationSequence = () => {
    // Respect prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setStage('revealed');
      return;
    }

    setStage('running');

    // Stage 1 -> Stage 2 (Postman trips & releases letter)
    const t1 = setTimeout(() => {
      setStage('tripping');
      sound.playClick();
    }, 1800);

    // Stage 2 -> Stage 3 (Letter flies toward camera)
    const t2 = setTimeout(() => {
      setStage('flying');
      sound.playZoom();
    }, 2800);

    // Stage 3 -> Stage 4 (Letter covers full screen)
    const t3 = setTimeout(() => {
      setStage('fullscreen_envelope');
    }, 3900);

    // Stage 4 -> Stage 5 (Envelope flap opens with golden glow)
    const t4 = setTimeout(() => {
      setStage('opening');
      sound.playChime();
    }, 4700);

    // Stage 5 -> Stage 6 (Contact postcard reveals inside)
    const t5 = setTimeout(() => {
      setStage('revealed');
      setHasPlayedOnce(true);
    }, 5800);

    timersRef.current = [t1, t2, t3, t4, t5];
  };

  useEffect(() => {
    if (isOpen) {
      if (!hasPlayedOnce) {
        startAnimationSequence();
      } else {
        setStage('revealed');
      }
    } else {
      clearTimers();
    }
    return () => clearTimers();
  }, [isOpen, hasPlayedOnce]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText('roopadeva48@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleNav = (targetPath: string) => {
    sound.playClick();
    if (onNavigate) {
      onNavigate(targetPath);
    } else {
      window.location.href = targetPath;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await sendContactMessage({ name, email, subject, message });
      sound.playChime();
      setSuccess(true);
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#38bdf8', '#ef4444', '#facc15', '#22c55e'],
      });
      setTimeout(() => {
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setSuccess(false);
      }, 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 bg-[#fdfbf7] text-[#1e293b] overflow-hidden flex flex-col select-none font-sans"
      >
        {/* ========================================================
            1. TOP STICKY NAVIGATION BAR
           ======================================================== */}
        <header className="relative z-50 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-amber-200/50 shadow-xs w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
            {/* Left End: Back to 3D Globe */}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-amber-50 text-slate-900 rounded-xl text-xs font-bold transition-all hover:-translate-x-0.5 cursor-pointer border border-amber-200 shadow-xs"
            >
              <span>←</span>
              <span>Back to 3D Globe</span>
              <span className="text-sm">🌍</span>
            </button>

            {/* Right Controls: Replay and Skip Actions */}
            <div className="flex items-center gap-2">
              {stage !== 'revealed' && (
                <button
                  onClick={handleSkip}
                  className="px-3.5 py-1.5 bg-white/90 hover:bg-white text-slate-700 text-xs font-bold rounded-xl border border-amber-300 shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Skip Animation</span>
                  <span>⏭</span>
                </button>
              )}

              {stage === 'revealed' && (
                <button
                  onClick={handleReplay}
                  className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                  title="Replay the postman animated cartoon story"
                >
                  <span>Replay Story</span>
                  <span>🎬</span>
                </button>
              )}

              <button
                onClick={() => {
                  sound.playClick();
                  const formEl = document.getElementById('contact-postcard-form');
                  formEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </header>

        {/* ========================================================
            2. SCENE 1 TO 5: THE ANIMATED POSTMAN CARTOON STORY
           ======================================================== */}
        {stage !== 'revealed' && (
          <div className="relative flex-1 w-full h-[calc(100vh-64px)] overflow-hidden bg-[#e0f2fe]">
            {/* Background Countryside Scenery (Frame 1, 2, 8) */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={{
                backgroundImage: 'url(/assets/postman/postman_garden_bg.jpg)',
                filter: stage === 'flying' ? 'blur(2px) brightness(0.95)' : 'none',
              }}
            >
              {/* Soft atmospheric sun overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-amber-200/10 pointer-events-none" />
            </div>

            {/* SCENE 1: Postman Runs into the Screen Carrying Letter */}
            {stage === 'running' && (
              <motion.div
                initial={{ x: '-280px', y: '40%' }}
                animate={{ x: '35vw', y: '42%' }}
                transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
                className="absolute bottom-12 z-20 w-64 sm:w-80 md:w-96 select-none"
              >
                {/* Vertical running bounce */}
                <motion.div
                  animate={{ y: [0, -18, 0, -16, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <img
                    src="/assets/postman/postman_running.jpg"
                    alt="Postman running with letter"
                    className="w-full h-auto mix-blend-multiply drop-shadow-xl"
                  />
                  {/* Dust particles on cobblestone */}
                  <motion.div
                    animate={{ opacity: [0.6, 0], scale: [0.8, 1.4], x: [-10, -40] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                    className="absolute bottom-2 left-6 w-8 h-4 rounded-full bg-amber-200/60 blur-[2px]"
                  />
                </motion.div>
              </motion.div>
            )}

            {/* SCENE 2: Postman Trips and Falls, Releasing the Letter */}
            {stage === 'tripping' && (
              <motion.div
                initial={{ x: '35vw', y: '42%' }}
                animate={{ x: '42vw', y: '45%' }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
                className="absolute bottom-12 z-20 w-64 sm:w-80 md:w-96 select-none"
              >
                {/* Comedic tumble wobble */}
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, -12, 8, 0], y: [0, -10, 8, 0] }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <img
                    src="/assets/postman/postman_falling.jpg"
                    alt="Postman tripping and falling"
                    className="w-full h-auto mix-blend-multiply drop-shadow-xl"
                  />
                  {/* Motion impact lines */}
                  <div className="absolute top-1/2 -right-8 flex flex-col gap-1 text-slate-700/60 font-black text-xl font-mono">
                    <span>💨</span>
                    <span>✦</span>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* SCENE 3: The Released Letter Flies Directly Toward Camera */}
            {stage === 'tripping' || stage === 'flying' ? (
              <motion.div
                initial={{
                  x: '46vw',
                  y: '48vh',
                  scale: 0.35,
                  rotate: -15,
                  opacity: 1,
                }}
                animate={
                  stage === 'flying'
                    ? {
                        x: '50vw',
                        y: '50vh',
                        translateX: '-50%',
                        translateY: '-50%',
                        scale: 14,
                        rotate: 0,
                        opacity: 1,
                      }
                    : {
                        x: '47vw',
                        y: '42vh',
                        scale: 0.65,
                        rotate: 8,
                      }
                }
                transition={
                  stage === 'flying'
                    ? { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
                    : { duration: 0.8, ease: 'easeOut' }
                }
                style={{ perspective: 1200 }}
                className="absolute z-30 pointer-events-none select-none"
              >
                {/* 3D Envelope Vector with Wax Heart Seal */}
                <div className="relative w-48 sm:w-56 aspect-[7/5] bg-[#fffbf2] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] border-2 border-amber-200/90 overflow-hidden flex items-center justify-center">
                  {/* Diagonal Airmail Perimeter Striping */}
                  <div className="absolute inset-0 border-8 border-transparent [border-image:repeating-linear-gradient(45deg,#dc2626_0,#dc2626_10px,#ffffff_10px,#ffffff_20px,#2563eb_20px,#2563eb_30px,#ffffff_30px,#ffffff_40px)_8]" />

                  {/* Envelope triangular flap line */}
                  <svg
                    viewBox="0 0 200 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    <path
                      d="M0 0 L100 80 L200 0"
                      stroke="#d97706"
                      strokeWidth="1.5"
                      fill="#fef3c7"
                      fillOpacity="0.4"
                    />
                    <path
                      d="M0 140 L100 70 L200 140"
                      stroke="#e2e8f0"
                      strokeWidth="1.5"
                      fill="#fff"
                      fillOpacity="0.6"
                    />
                  </svg>

                  {/* Red Heart Wax Seal in Center */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 via-red-600 to-rose-800 shadow-md flex items-center justify-center border-2 border-red-700/60 ring-2 ring-red-400/30">
                    <span className="text-white text-base drop-shadow-xs">❤️</span>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {/* SCENE 4 & 5: Envelope Covers Full Screen & Opens with Golden Glow */}
            {(stage === 'fullscreen_envelope' || stage === 'opening') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-40 bg-[#fefaf0] flex items-center justify-center p-4 sm:p-8"
              >
                {/* Full-screen Airmail Border */}
                <div className="absolute inset-0 border-[16px] sm:border-[24px] border-transparent [border-image:repeating-linear-gradient(45deg,#dc2626_0,#dc2626_16px,#ffffff_16px,#ffffff_32px,#2563eb_32px,#2563eb_48px,#ffffff_48px,#ffffff_64px)_16] pointer-events-none" />

                {/* Envelope Body Frame */}
                <div
                  style={{ perspective: 1400 }}
                  className="relative w-full max-w-4xl h-[75vh] bg-[#fffbf2] rounded-3xl border-2 border-amber-200/80 shadow-2xl overflow-hidden flex flex-col items-center justify-center"
                >
                  {/* Flap Opening 3D Animation */}
                  <motion.div
                    initial={{ rotateX: 0 }}
                    animate={
                      stage === 'opening'
                        ? { rotateX: -180, y: -20, opacity: 0.4 }
                        : { rotateX: 0 }
                    }
                    transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                    style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
                    className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-amber-100 to-[#fff8eb] border-b-2 border-amber-300 shadow-lg flex items-center justify-center z-20"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 via-red-600 to-rose-800 shadow-xl flex items-center justify-center border-2 border-red-700/60 ring-4 ring-red-400/30">
                      <span className="text-white text-2xl drop-shadow-xs">❤️</span>
                    </div>
                  </motion.div>

                  {/* Golden Rays Shining from Inside Opening Envelope */}
                  {stage === 'opening' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1.2 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    >
                      <div className="w-96 h-96 rounded-full bg-gradient-to-r from-amber-300/60 via-yellow-200/80 to-amber-400/60 blur-3xl animate-pulse" />
                    </motion.div>
                  )}

                  <div className="text-center space-y-2 z-10">
                    <span className="font-handwriting text-3xl text-amber-700 font-bold">
                      Opening Letter...
                    </span>
                    <p className="text-xs font-mono text-slate-500">
                      A special transmission from devaroopa is inside!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ========================================================
            3. SCENE 6, 7 & 8: FINAL INTERACTIVE CONTACT POSTCARD
               - Airmail envelope border
               - "Let's Connect!" headline & social channels
               - Working contact form (Name, Email, Subject, Message)
               - Cute Postman sitting relaxed in bottom-right corner
           ======================================================== */}
        {stage === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex-1 w-full overflow-y-auto bg-cover bg-center"
            style={{ backgroundImage: 'url(/assets/postman/postman_garden_bg.jpg)' }}
          >
            {/* Soft Ambient Scenery Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-[#fdfbf7]/92 to-white/95 pointer-events-none" />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 flex flex-col items-center">
              {/* Outer Airmail Postcard Container */}
              <div
                id="contact-postcard-form"
                className="relative w-full max-w-5xl bg-[#fffefc] rounded-3xl sm:rounded-4xl p-5 sm:p-8 md:p-12 shadow-[0_25px_60px_-15px_rgba(217,119,6,0.15),0_10px_25px_-5px_rgba(0,0,0,0.06)] border border-amber-200/90 overflow-hidden"
              >
                {/* Authentic Airmail Striped Diagonal Border (Frame 6, 7, 8) */}
                <div className="absolute inset-0 border-8 sm:border-12 border-transparent [border-image:repeating-linear-gradient(45deg,#dc2626_0,#dc2626_14px,#ffffff_14px,#ffffff_28px,#2563eb_28px,#2563eb_42px,#ffffff_42px,#ffffff_56px)_12] pointer-events-none rounded-3xl sm:rounded-4xl" />

                {/* Subtle Postage Stamp in Top-Right Corner */}
                <div className="absolute top-6 right-6 sm:top-8 sm:right-8 hidden sm:flex flex-col items-center justify-center w-16 h-20 bg-amber-50 rounded-md border-2 border-dashed border-amber-400/80 p-1 select-none shadow-xs">
                  <span className="text-xl">🪐</span>
                  <span className="text-[9px] font-mono font-bold text-amber-800 tracking-wider mt-1">
                    DEVA 3D
                  </span>
                  <span className="text-[8px] font-mono text-slate-400">AIRMAIL</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 pt-2 sm:pt-4">
                  {/* LEFT COLUMN: Headings, Story & Direct Social Channels */}
                  <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Playful Floating Paper Airplane Doodle */}
                      <div className="flex items-center gap-2">
                        <span className="text-2xl rotate-12">✈️</span>
                        <div className="h-0.5 w-16 border-b border-dashed border-slate-300" />
                      </div>

                      <h1 className="font-handwriting text-5xl sm:text-6xl text-slate-900 font-black tracking-tight leading-none">
                        Let's Connect!
                      </h1>

                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                        I'd love to hear from you! Feel free to reach out through any of my channels.
                      </p>

                      {/* Direct Channels List (Matching Frame 7) */}
                      <div className="space-y-3 pt-2">
                        {/* Email */}
                        <div
                          onClick={handleCopyEmail}
                          className="p-3.5 bg-slate-50 hover:bg-amber-50/80 rounded-2xl border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl text-amber-600">✉️</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900">Email</div>
                              <div className="text-[11px] font-mono text-slate-500">
                                {copiedEmail ? 'Copied to Clipboard!' : 'roopadeva48@gmail.com'}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                            {copiedEmail ? '✓' : 'Copy →'}
                          </span>
                        </div>

                        {/* LinkedIn */}
                        <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3.5 bg-slate-50 hover:bg-blue-50/80 rounded-2xl border border-slate-200/80 transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl text-blue-600">💼</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900">LinkedIn</div>
                              <div className="text-[11px] font-mono text-slate-500">
                                view my profile
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                            Visit ↗
                          </span>
                        </a>

                        {/* GitHub */}
                        <a
                          href="https://github.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/80 transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl text-slate-900">🐙</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900">GitHub</div>
                              <div className="text-[11px] font-mono text-slate-500">
                                check my projects
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-800 group-hover:translate-x-1 transition-transform">
                            Code ↗
                          </span>
                        </a>
                      </div>

                      {/* Other Platforms Pill Row */}
                      <div className="pt-2 space-y-1.5">
                        <span className="text-xs font-mono font-semibold text-slate-400">
                          Other Platforms (let's connect):
                        </span>
                        <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-700">
                          <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
                          >
                            Twitter / X
                          </a>
                          <a
                            href="mailto:roopadeva48@gmail.com"
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
                          >
                            Direct Email
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Interactive Contact Form & Sitting Postman */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                    {success ? (
                      <div className="py-12 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 p-6 my-auto">
                        <div className="text-5xl animate-bounce">🎉</div>
                        <h3 className="text-2xl font-bold text-emerald-800 font-handwriting">
                          Letter Delivered Safely!
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                          Thank you for reaching out. Devaroopa will review your letter and get back to you soon.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {errorMsg && (
                          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                            {errorMsg}
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Name</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Email</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Email Address"
                            className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Subject</label>
                          <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Subject / Project Inquiry"
                            className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Message</label>
                          <textarea
                            required
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your message here..."
                            className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-all resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full sm:w-auto px-8 py-3 bg-[#1e293b] hover:bg-[#0f172a] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Delivering...</span>
                            </>
                          ) : (
                            <span>Send Message ✈</span>
                          )}
                        </button>
                      </form>
                    )}

                    {/* Sitting Postman Character in Bottom-Right Corner (Frame 7 & 8) */}
                    <div className="relative pt-4 flex items-end justify-end">
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative w-44 sm:w-52 md:w-60 select-none -mr-3 -mb-3"
                      >
                        <img
                          src="/assets/postman/postman_sitting.jpg"
                          alt="Cute postman resting happily"
                          className="w-full h-auto mix-blend-multiply drop-shadow-md"
                        />
                        {/* Floating love heart bubble */}
                        <motion.div
                          animate={{ scale: [1, 1.15, 1], y: [0, -4, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute -top-1 right-6 text-xl"
                        >
                          💖
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Note */}
              <div className="mt-8 text-center text-xs text-slate-500 font-mono flex items-center justify-center gap-3">
                <span>Hand-delivered with care</span>
                <span>·</span>
                <span>devaroopa portfolio</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
