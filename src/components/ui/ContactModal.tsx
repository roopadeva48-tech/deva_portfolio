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
  // Alternating 2-leg run cycle: Step 1 (right leg lead) <-> Step 2 (left leg lead)
  const [runStep, setRunStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (stage === 'running') {
      const interval = setInterval(() => {
        setRunStep((prev) => (prev === 1 ? 2 : 1));
      }, 160);
      return () => clearInterval(interval);
    }
  }, [stage]);

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
    clearTimers();
    setStage('running');

    // Stage 1 -> Stage 2 (Postman trips & releases letter)
    const t1 = setTimeout(() => {
      setStage('tripping');
      sound.playClick();
    }, 2000);

    // Stage 2 -> Stage 3 (Letter flies toward camera)
    const t2 = setTimeout(() => {
      setStage('flying');
      sound.playZoom();
    }, 3100);

    // Stage 3 -> Stage 4 (Letter covers full screen)
    const t3 = setTimeout(() => {
      setStage('fullscreen_envelope');
    }, 4100);

    // Stage 4 -> Stage 5 (Envelope flap opens with golden glow)
    const t4 = setTimeout(() => {
      setStage('opening');
      sound.playChime();
    }, 4800);

    // Stage 5 -> Stage 6 (Contact postcard reveals inside)
    const t5 = setTimeout(() => {
      setStage('revealed');
      setHasPlayedOnce(true);
    }, 5700);

    timersRef.current = [t1, t2, t3, t4, t5];
  };

  useEffect(() => {
    if (isOpen) {
      startAnimationSequence();
    } else {
      clearTimers();
      setStage('running');
    }
    return () => clearTimers();
  }, [isOpen]);

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
            1. TOP STICKY NAVIGATION BAR (Full-Bleed Far-Left)
           ======================================================== */}
        <header className="relative z-50 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-amber-200/50 shadow-xs w-full px-4 sm:px-6 md:px-8">
          <div className="w-full h-16 flex items-center justify-between">
            {/* Literally on the Far-Left: Back to 3D Globe */}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-50 text-slate-900 rounded-xl text-xs font-bold transition-all hover:-translate-x-0.5 cursor-pointer border border-amber-300 shadow-xs"
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

            {/* SCENE 1: Postman Runs Along the Cobblestone Pathway with Alternating 2-Leg Run Cycle */}
            {stage === 'running' && (
              <motion.div
                initial={{ left: '6%', bottom: '15%', scale: 0.65 }}
                animate={{ left: '38%', bottom: '10%', scale: 1.05 }}
                transition={{ duration: 2.0, ease: [0.25, 1, 0.45, 1] }}
                className="absolute z-20 w-64 sm:w-80 md:w-92 select-none pointer-events-none"
              >
                {/* Dynamic foot shadow on stones */}
                <motion.div
                  animate={{
                    scale: [0.85, 1.15, 0.85, 1.15, 0.85],
                    opacity: [0.35, 0.65, 0.35, 0.65, 0.35],
                  }}
                  transition={{ duration: 0.32, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-4 left-10 w-40 h-5 bg-slate-950/40 rounded-full blur-[4px]"
                />

                {/* Stride bounce & tilt synced with 2-leg alternating steps */}
                <motion.div
                  animate={{
                    y: [0, -18, 0, -18, 0],
                    rotate: [-1.5, 2, -1.5, 2, -1.5],
                  }}
                  transition={{ duration: 0.32, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <img
                    src={
                      runStep === 1
                        ? '/assets/postman/postman_running.png'
                        : '/assets/postman/postman_running_step2.png'
                    }
                    alt="Postman running with alternating 2 legs"
                    className="w-full h-auto drop-shadow-sm select-none"
                  />

                  {/* Foot impact dust alternating behind feet */}
                  <motion.div
                    key={runStep}
                    initial={{ opacity: 0.7, scale: 0.6, x: 0 }}
                    animate={{ opacity: 0, scale: 1.3, x: -30, y: -6 }}
                    transition={{ duration: 0.28 }}
                    className="absolute bottom-5 left-8 w-6 h-4 rounded-full bg-amber-100/75 blur-[2px]"
                  />
                </motion.div>
              </motion.div>
            )}

            {/* SCENE 2: Postman Trips and Falls on the Cobblestone Stones */}
            {stage === 'tripping' && (
              <motion.div
                initial={{ left: '38%', bottom: '10%', scale: 1.05 }}
                animate={{ left: '46%', bottom: '7%', scale: 1.08 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="absolute z-20 w-64 sm:w-80 md:w-92 select-none pointer-events-none"
              >
                {/* Fall contact shadow on ground */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1.35, opacity: 0.7 }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-2 left-8 w-44 h-6 bg-slate-950/40 rounded-full blur-[4px]"
                />

                {/* Comedic trip and tumble motion */}
                <motion.div
                  initial={{ rotate: 0, y: 0 }}
                  animate={{
                    rotate: [0, -14, 18, 10],
                    y: [0, -18, 14, 8],
                  }}
                  transition={{ duration: 0.85, ease: 'easeOut' }}
                  className="relative"
                >
                  <img
                    src="/assets/postman/postman_falling.png"
                    alt="Postman tripping and falling on pathway"
                    className="w-full h-auto drop-shadow-sm"
                  />

                  {/* Impact dust and cartoon action lines */}
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: [0.4, 1.25, 0.95], opacity: [0, 0.85, 0] }}
                    transition={{ duration: 0.6 }}
                    className="absolute bottom-4 right-10 flex items-center gap-1 text-slate-800/80 font-mono text-xl"
                  >
                    <span>💨</span>
                    <span>✦</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* SCENE 3: The Released Letter Flies Directly Toward Camera */}
            {(stage === 'tripping' || stage === 'flying') && (
              <motion.div
                initial={{
                  left: '46%',
                  bottom: '26%',
                  scale: 0.35,
                  rotate: -15,
                  opacity: 1,
                }}
                animate={
                  stage === 'flying'
                    ? {
                        left: '50%',
                        top: '50%',
                        x: '-50%',
                        y: '-50%',
                        scale: 14,
                        rotate: 0,
                        opacity: 1,
                      }
                    : {
                        left: '48%',
                        bottom: '34%',
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
            )}

            {/* SCENE 4 & 5: Authentic Envelope Vector Structure Matching Reference */}
            {(stage === 'fullscreen_envelope' || stage === 'opening') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 z-40 bg-[#fefaf0]/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 sm:p-8"
              >
                {/* Airmail Border on Screen Perimeter */}
                <div className="absolute inset-0 border-[14px] sm:border-[20px] border-transparent [border-image:repeating-linear-gradient(45deg,#dc2626_0,#dc2626_14px,#ffffff_14px,#ffffff_28px,#1d4ed8_28px,#1d4ed8_42px,#ffffff_42px,#ffffff_56px)_14] pointer-events-none" />

                {/* THE ENVELOPE CONTAINER (Perspective 1200 for 3D Flap Opening) */}
                <div
                  style={{ perspective: 1200 }}
                  className="relative w-full max-w-lg aspect-[7/5] flex items-center justify-center my-auto"
                >
                  {/* 1. Envelope Back Wall */}
                  <div className="absolute inset-0 bg-[#fde68a] rounded-2xl shadow-2xl border-2 border-amber-400 overflow-visible" />

                  {/* 2. Open Flap Behind (When Opened, Points UP ▲) */}
                  {stage === 'opening' && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{ transformOrigin: 'bottom center' }}
                      className="absolute -top-24 sm:-top-32 inset-x-0 h-24 sm:h-32 flex justify-center z-10 pointer-events-none"
                    >
                      <svg viewBox="0 0 200 90" className="w-full h-full drop-shadow-lg">
                        <polygon
                          points="0,90 200,90 100,0"
                          fill="#fef08a"
                          stroke="#d97706"
                          strokeWidth="2"
                        />
                      </svg>
                      {/* Wax Seal at the Open Flap Peak */}
                      <div className="absolute top-1 w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 via-red-600 to-rose-800 shadow-md flex items-center justify-center border border-red-700">
                        <span className="text-white text-base">❤️</span>
                      </div>
                    </motion.div>
                  )}

                  {/* 3. The Letter / Postcard Inside - Slides UP Out of the Pocket */}
                  <motion.div
                    initial={{ y: 0, scale: 0.96 }}
                    animate={
                      stage === 'opening'
                        ? { y: -130, scale: 1 }
                        : { y: 0, scale: 0.96 }
                    }
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-6 top-4 h-[92%] bg-[#fcfaf2] rounded-2xl shadow-lg border-2 border-amber-300 p-4 sm:p-6 z-20 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Airmail Trim on Emerging Letter */}
                    <div className="absolute inset-0 border-6 border-transparent [border-image:repeating-linear-gradient(45deg,#dc2626_0,#dc2626_8px,#ffffff_8px,#ffffff_16px,#1d4ed8_16px,#1d4ed8_24px,#ffffff_24px,#ffffff_32px)_6] pointer-events-none rounded-2xl" />

                    {/* Letter Header Line */}
                    <div className="relative z-10 flex items-center justify-between border-b border-stone-300 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">✈</span>
                        <span className="font-serif font-bold text-xs sm:text-sm tracking-widest text-stone-800 uppercase">
                          POST CARD
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-800">
                        DEVA 3D
                      </span>
                    </div>

                    {/* Ruled lines inside emerging card (matching reference illustration!) */}
                    <div className="relative z-10 space-y-2.5 py-2">
                      <div className="h-2 w-3/4 bg-stone-300/60 rounded-full" />
                      <div className="h-2 w-full bg-stone-200/80 rounded-full" />
                      <div className="h-2 w-5/6 bg-stone-200/80 rounded-full" />
                      <div className="h-2 w-2/3 bg-stone-200/80 rounded-full" />
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-stone-500 pt-1">
                      <span>PAR AVION</span>
                      <span>OCT 2026</span>
                    </div>
                  </motion.div>

                  {/* 4. Golden Shine Radiating from Pocket */}
                  {stage === 'opening' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1.25 }}
                      transition={{ duration: 0.7 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-25"
                    >
                      <div className="w-80 h-80 rounded-full bg-gradient-to-r from-amber-300/60 via-yellow-200/80 to-amber-400/60 blur-2xl" />
                    </motion.div>
                  )}

                  {/* 5. The Front Pocket (Left, Right & Bottom Flaps In Front of Letter Base) */}
                  <div className="absolute inset-0 z-30 pointer-events-none">
                    <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-md">
                      {/* Left Flap */}
                      <polygon points="0,0 95,70 0,140" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
                      {/* Right Flap */}
                      <polygon points="200,0 105,70 200,140" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
                      {/* Bottom Flap */}
                      <polygon points="0,140 200,140 100,60" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
                    </svg>
                  </div>

                  {/* 6. Closed Top Flap (Folds DOWN over front when closed) */}
                  {stage === 'fullscreen_envelope' && (
                    <motion.div
                      initial={{ rotateX: 0 }}
                      animate={{ rotateX: 0 }}
                      style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
                      className="absolute top-0 inset-x-0 h-1/2 z-40 pointer-events-none"
                    >
                      <svg viewBox="0 0 200 75" className="w-full h-full drop-shadow-md">
                        <polygon points="0,0 200,0 100,75" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
                      </svg>
                      {/* Wax Seal at the Closed Flap Tip */}
                      <div className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-gradient-to-br from-rose-500 via-red-600 to-rose-800 shadow-xl flex items-center justify-center border-2 border-red-700">
                        <span className="text-white text-lg">❤️</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Status Notice Below */}
                <div className="text-center mt-6 z-40 space-y-1">
                  <span className="font-handwriting text-3xl text-amber-900 font-bold">
                    {stage === 'opening' ? 'Opening Postcard Letter...' : 'Special Delivery Received!'}
                  </span>
                  <p className="text-xs font-mono text-stone-600">
                    Transmission from devaroopa is inside
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ========================================================
            3. SCENE 6, 7 & 8: REAL AUTHENTIC POSTCARD DESIGN
               - Open envelope crown behind top
               - Vintage Post Card header & Union Postale Universelle
               - Iconic Divided Back layout (Message on left, Address on right)
               - Perforated scalloped postage stamp with orbital artwork
               - Circular rubber postmark with wavy ink cancellation lines
               - "PAR AVION ✈ AIR MAIL" vintage ink stamp
               - Ruled postcard handwriting & address lines
               - Sitting Postman with floating love heart
           ======================================================== */}
        {stage === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex-1 w-full overflow-y-auto bg-cover bg-center"
            style={{ backgroundImage: 'url(/assets/postman/postman_garden_bg.jpg)' }}
          >
            {/* Ambient Sunlight & Warm Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/15 via-[#fdfbf7]/85 to-stone-900/20 pointer-events-none" />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-6 md:px-8 pt-10 sm:pt-14 pb-8 sm:pb-12 flex flex-col items-center">
              {/* REAL AUTHENTIC POSTCARD CONTAINER (With Open Envelope Flap Crown) */}
              <div
                id="contact-postcard-form"
                className="relative w-full max-w-5xl bg-[#fcfaf2] rounded-3xl p-4 sm:p-7 md:p-9 shadow-[0_25px_60px_-10px_rgba(45,30,15,0.28),0_8px_20px_-5px_rgba(0,0,0,0.12)] border-2 border-stone-300/80 overflow-visible"
              >
                {/* Authentic Open Envelope Flap Peak (Matching Reference Illustration Structure) */}
                <div className="absolute -top-7 sm:-top-11 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-8 sm:h-12 pointer-events-none z-0">
                  <svg viewBox="0 0 200 50" className="w-full h-full drop-shadow-md">
                    <polygon points="0,50 200,50 100,0" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                  </svg>
                  {/* Wax Seal Centered on Open Flap Peak */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-rose-500 via-red-600 to-rose-800 shadow-md flex items-center justify-center border border-red-700/80">
                    <span className="text-white text-[10px] sm:text-xs">❤️</span>
                  </div>
                </div>

                {/* 1. Classic Airmail Diagonal Chevrons (Red & Blue Perimeter) */}
                <div className="absolute inset-0 border-8 sm:border-10 border-transparent [border-image:repeating-linear-gradient(45deg,#dc2626_0,#dc2626_12px,#ffffff_12px,#ffffff_24px,#1d4ed8_24px,#1d4ed8_36px,#ffffff_36px,#ffffff_48px)_10] pointer-events-none rounded-3xl z-10" />

                {/* Inner Fine Margin Frame Line */}
                <div className="absolute inset-3 sm:inset-4 border border-stone-300/70 pointer-events-none rounded-2xl z-10" />

                {/* 2. AUTHENTIC POSTCARD HEADER */}
                <div className="relative z-10 pt-2 pb-4 text-center border-b-2 border-stone-300/80 mx-2 sm:mx-4">
                  <div className="flex items-center justify-between mb-1">
                    {/* Par Avion / Air Mail Rubber Ink Stamp */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50/80 border-2 border-blue-700/80 rounded-md rotate-[-2deg] select-none shadow-xs">
                      <span className="text-blue-800 text-xs">✈</span>
                      <span className="text-[10px] sm:text-xs font-mono font-black tracking-widest text-blue-900 uppercase">
                        PAR AVION · AIR MAIL
                      </span>
                    </div>

                    {/* Centered Engraved Post Card Title */}
                    <div className="flex-1 text-center px-2">
                      <div className="text-[9px] font-mono tracking-[0.25em] text-stone-500 uppercase">
                        ★ ★ ★
                      </div>
                      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.3em] text-stone-800 uppercase leading-tight">
                        POST CARD
                      </h1>
                      <div className="text-[8px] sm:text-[9px] font-mono tracking-widest text-stone-500 uppercase">
                        CARTE POSTALE · UNION POSTALE UNIVERSELLE · ORBITAL TRANSMISSION
                      </div>
                    </div>

                    {/* Right Postal Notice */}
                    <div className="hidden sm:inline-block px-2.5 py-1 border border-stone-400/60 rounded text-[9px] font-mono text-stone-500 tracking-wider rotate-[1deg]">
                      REF: DEV-2026-ORBIT
                    </div>
                  </div>
                </div>

                {/* 3. POSTCARD DIVIDED BODY (Left: Message & Channels | Right: Address & Ruled Form) */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-4 sm:pt-6 px-1 sm:px-3">
                  {/* LEFT HALF: THE HANDWRITTEN CORRESPONDENCE / MESSAGE */}
                  <div className="lg:col-span-5 space-y-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-dashed border-stone-300 pb-6 lg:pb-0 lg:pr-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">
                          Communication / Message
                        </span>
                        <span className="text-stone-400 text-xs">✍</span>
                      </div>

                      {/* Handwritten Warm Greeting & Note */}
                      <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200/50 space-y-2.5">
                        <div className="font-handwriting text-2xl text-stone-800 font-bold">
                          Dear Explorer & Friend,
                        </div>
                        <p className="font-handwriting text-lg text-stone-700 leading-snug">
                          Welcome to my 3D orbital space! I build interactive spatial web apps, creative technology systems, and fluid digital experiences.
                        </p>
                        <p className="font-handwriting text-lg text-stone-700 leading-snug">
                          Feel free to dispatch a note across the airwaves, discuss a project collaboration, or simply say hello!
                        </p>
                        <div className="pt-1 text-right font-script text-2xl text-amber-800 font-bold">
                          Warmly, Deva ✦
                        </div>
                      </div>

                      {/* Direct Transmission Channels Styled as Vintage Postal Memos */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">
                          Official Dispatch Channels:
                        </span>

                        {/* Email */}
                        <div
                          onClick={handleCopyEmail}
                          className="p-2.5 bg-white/90 hover:bg-amber-50/90 rounded-xl border border-stone-200 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">✉️</span>
                            <div>
                              <div className="text-[11px] font-bold text-stone-800">Email</div>
                              <div className="text-[10px] font-mono text-stone-500">
                                {copiedEmail ? 'Copied to Clipboard!' : 'roopadeva48@gmail.com'}
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform font-mono">
                            {copiedEmail ? '✓ COPIED' : 'COPY →'}
                          </span>
                        </div>

                        {/* LinkedIn */}
                        <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white/90 hover:bg-blue-50/90 rounded-xl border border-stone-200 transition-all flex items-center justify-between group shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg text-blue-600">💼</span>
                            <div>
                              <div className="text-[11px] font-bold text-stone-800">LinkedIn</div>
                              <div className="text-[10px] font-mono text-stone-500">Professional Profile</div>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform font-mono">
                            VISIT ↗
                          </span>
                        </a>

                        {/* GitHub */}
                        <a
                          href="https://github.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white/90 hover:bg-stone-100 rounded-xl border border-stone-200 transition-all flex items-center justify-between group shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg text-stone-900">🐙</span>
                            <div>
                              <div className="text-[11px] font-bold text-stone-800">GitHub</div>
                              <div className="text-[10px] font-mono text-stone-500">Open Source Code</div>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-stone-800 group-hover:translate-x-0.5 transition-transform font-mono">
                            CODE ↗
                          </span>
                        </a>
                      </div>

                      {/* Extra Platforms */}
                      <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono font-bold text-stone-600">
                        <a
                          href="https://twitter.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-white hover:bg-stone-100 rounded-lg border border-stone-200"
                        >
                          Twitter / X ↗
                        </a>
                        <a
                          href="mailto:roopadeva48@gmail.com"
                          className="px-2.5 py-1 bg-white hover:bg-stone-100 rounded-lg border border-stone-200"
                        >
                          Direct Mail ↗
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT HALF: POSTAGE STAMP, CANCELLATION MARK & RULED ADDRESS FORM */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                    {/* Top Right Corner: Perforated Postage Stamp & Postal Rubber Postmark */}
                    <div className="flex items-start justify-between pb-1">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">
                          Address & Dispatch
                        </span>
                        <div className="text-[9px] font-mono text-stone-400">
                          AFFIX TRANSMISSION DETAILS BELOW
                        </div>
                      </div>

                      {/* The Authentic Postage Stamp & Wavy Cancellation Ink Stamp */}
                      <div className="relative select-none pr-1">
                        {/* Wavy Cancellation Ink Lines (Overlapping the stamp) */}
                        <div className="absolute -left-16 top-3 w-24 flex flex-col gap-1 pointer-events-none opacity-80 z-20 rotate-[-5deg]">
                          <div className="w-full h-0.5 bg-stone-700/70 rounded-full" />
                          <div className="w-full h-0.5 bg-stone-700/70 rounded-full" />
                          <div className="w-full h-0.5 bg-stone-700/70 rounded-full" />
                        </div>

                        {/* Circular Rubber Cancellation Postmark */}
                        <div className="absolute -left-8 -top-3 w-16 h-16 rounded-full border-2 border-dashed border-stone-700/80 flex flex-col items-center justify-center p-1 pointer-events-none z-20 rotate-[-12deg] bg-amber-50/10 backdrop-blur-[0.5px]">
                          <span className="text-[6px] font-mono font-bold text-stone-800 tracking-tighter">
                            ★ ORBITAL POST ★
                          </span>
                          <span className="text-[7px] font-mono font-black text-rose-800">
                            OCT 12 2026
                          </span>
                          <span className="text-[6px] font-mono text-stone-700">
                            DEVA DISPATCH
                          </span>
                        </div>

                        {/* Perforated Postage Stamp with Scalloped Edge */}
                        <div className="relative w-18 h-22 sm:w-20 sm:h-24 bg-gradient-to-br from-amber-100 via-rose-50 to-amber-200 rounded-xs border-2 border-dashed border-amber-500/90 shadow-md p-1.5 flex flex-col items-center justify-between text-center z-10 rotate-[2deg]">
                          <div className="w-full border-b border-amber-400/60 pb-0.5 text-[8px] font-mono font-bold text-amber-900 tracking-wider uppercase">
                            DEVA 3D
                          </div>
                          <div className="text-2xl sm:text-3xl my-0.5 drop-shadow-xs">🪐</div>
                          <div className="w-full border-t border-amber-400/60 pt-0.5 flex items-center justify-between text-[7px] font-mono font-bold text-amber-800 px-0.5">
                            <span>AIRMAIL</span>
                            <span>25¢</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Postcard Form with Ruled Guidelines */}
                    {success ? (
                      <div className="py-10 text-center space-y-3 bg-emerald-50 rounded-2xl border-2 border-emerald-300 p-6 my-auto">
                        <div className="text-4xl animate-bounce">📮</div>
                        <h3 className="text-2xl font-bold text-emerald-900 font-handwriting">
                          Postcard Delivered Safely!
                        </h3>
                        <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto font-medium">
                          Thank you for reaching out. Devaroopa has received your dispatch and will reply shortly!
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                        {errorMsg && (
                          <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 font-mono">
                            {errorMsg}
                          </div>
                        )}

                        {/* Ruled Line 1: To / Name */}
                        <div className="relative border-b-2 border-stone-400/80 pb-1 flex items-baseline gap-2">
                          <label className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wider shrink-0">
                            To (Name):
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Full Name"
                            className="w-full bg-transparent text-xs text-stone-900 font-handwriting text-lg focus:outline-hidden placeholder:font-sans placeholder:text-xs placeholder:text-stone-400"
                          />
                        </div>

                        {/* Ruled Line 2: Return Address / Email */}
                        <div className="relative border-b-2 border-stone-400/80 pb-1 flex items-baseline gap-2">
                          <label className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wider shrink-0">
                            Return Email:
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@domain.com"
                            className="w-full bg-transparent text-xs text-stone-900 font-mono focus:outline-hidden placeholder:text-xs placeholder:text-stone-400"
                          />
                        </div>

                        {/* Ruled Line 3: Subject */}
                        <div className="relative border-b-2 border-stone-400/80 pb-1 flex items-baseline gap-2">
                          <label className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wider shrink-0">
                            Regarding:
                          </label>
                          <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Project Inquiry / Tech Collaboration"
                            className="w-full bg-transparent text-xs text-stone-900 font-handwriting text-lg focus:outline-hidden placeholder:font-sans placeholder:text-xs placeholder:text-stone-400"
                          />
                        </div>

                        {/* Ruled Message Area (Multi-line postcard ruled notebook guidelines) */}
                        <div className="space-y-1 pt-1">
                          <label className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wider block">
                            Postcard Message:
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your note here on the postcard..."
                            className="w-full p-2.5 bg-amber-50/30 rounded-xl border border-stone-300 text-xs text-stone-900 font-handwriting text-xl focus:outline-hidden focus:border-stone-500 focus:bg-white/80 transition-all resize-none leading-relaxed"
                          />
                        </div>

                        {/* Dispatch Button Styled as Postal Franking / Wax Seal Button */}
                        <div className="pt-2 flex items-center justify-between">
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 hover:from-amber-900 hover:to-rose-900 disabled:opacity-50 text-amber-100 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 border border-amber-300/40"
                          >
                            {loading ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Dispatching...</span>
                              </>
                            ) : (
                              <>
                                <span>✉</span>
                                <span>Dispatch Postcard ✈</span>
                              </>
                            )}
                          </button>

                          <span className="text-[10px] font-mono text-stone-400">
                            POSTAGE PRE-PAID · AIR TRANSMISSION
                          </span>
                        </div>
                      </form>
                    )}

                    {/* Sitting Postman Character in Bottom-Right Corner - Completely Transparent */}
                    <div className="relative pt-1 flex items-end justify-end select-none pointer-events-none">
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative w-36 sm:w-44 md:w-48"
                      >
                        <img
                          src="/assets/postman/postman_sitting.png"
                          alt="Cute postman resting happily"
                          className="w-full h-auto drop-shadow-md select-none"
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
              <div className="mt-6 text-center text-xs text-stone-600 font-mono flex items-center justify-center gap-3">
                <span>Hand-delivered across the spatial web</span>
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
