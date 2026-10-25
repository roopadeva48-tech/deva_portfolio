import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileData, ProjectItem, CertificateItem } from '../../types';
import { sound } from '../../utils/audio';
import {
  BeanbagGirlIllustration,
  JugglingGirlIllustration,
} from './illustrated/GirlIllustrations';
import { ProfilePhotoFrame } from './ProfilePhotoFrame';
import {
  PushPinDoodle,
  ArtisticDevaTitle,
  SquiggleUnderline,
} from './illustrated/Doodles';

interface ProfileShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData | null;
  projects?: ProjectItem[];
  certificates?: CertificateItem[];
  onNavigateToProjects: () => void;
  onOpenContact: () => void;
}

// ========================================================
// 1. TOP ORBITAL ROCKET PROGRESS BAR (Cyan & Sky Blue Theme)
// Rides across the top edge as the page is scrolled
// ========================================================
const ScrollProgressRocket: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-sky-950/50 backdrop-blur-xs pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-sky-400 via-cyan-300 to-white shadow-[0_0_14px_rgba(56,189,248,0.9)] relative transition-all duration-75 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      >
        {/* Miniature Rocket Riding the Orbit Track */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 pointer-events-none drop-shadow-[0_2px_8px_rgba(56,189,248,0.8)]"
          style={{ transform: 'translate(6px, -50%) rotate(90deg)' }}
        >
          <span className="text-base select-none inline-block">🚀</span>
        </div>
      </div>
    </div>
  );
};

// ========================================================
// 2. CELESTIAL SPACE BACKGROUND (Clean Space / Zero Yellow)
// Atmospheric sky blue with floating fluffy clouds, orbital
// trails, twinkling stars & space landmarks matching the 3D globe
// ========================================================
const CelestialSpaceAtmosphere: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Dynamic Starfield Sparkles in Cyan, White, and Sky-Blue */}
      <div className="absolute inset-0">
        {[
          { top: '8%', left: '12%', size: 'text-sm', delay: '0s', char: '✦', color: 'text-cyan-200' },
          { top: '15%', left: '88%', size: 'text-lg', delay: '1s', char: '★', color: 'text-white' },
          { top: '24%', left: '5%', size: 'text-xs', delay: '2s', char: '✧', color: 'text-sky-200' },
          { top: '32%', left: '92%', size: 'text-base', delay: '0.5s', char: '✦', color: 'text-cyan-300' },
          { top: '44%', left: '8%', size: 'text-sm', delay: '1.5s', char: '★', color: 'text-white' },
          { top: '56%', left: '94%', size: 'text-xs', delay: '2.5s', char: '✧', color: 'text-cyan-200' },
          { top: '68%', left: '4%', size: 'text-base', delay: '0.8s', char: '✦', color: 'text-sky-100' },
          { top: '78%', left: '90%', size: 'text-sm', delay: '1.8s', char: '★', color: 'text-white' },
          { top: '88%', left: '10%', size: 'text-xs', delay: '0.3s', char: '✧', color: 'text-cyan-300' },
          { top: '94%', left: '85%', size: 'text-sm', delay: '2.2s', char: '✦', color: 'text-cyan-100' },
        ].map((star, idx) => (
          <span
            key={idx}
            className={`absolute ${star.size} ${star.color} animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]`}
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              animationDuration: '3s',
            }}
          >
            {star.char}
          </span>
        ))}
      </div>

      {/* Floating 3D-Styled Puffy White Clouds (Matching the 3D globe scene) */}
      <motion.div
        animate={{ x: [-15, 15, -15], y: [-6, 6, -6] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-28 -left-12 w-48 opacity-85"
      >
        <svg viewBox="0 0 140 70" fill="none" className="w-full h-auto drop-shadow-[0_12px_24px_rgba(2,132,199,0.3)]">
          <path
            d="M30 55 C15 55 5 45 5 32 C5 20 18 10 32 12 C38 4 52 0 65 5 C75 0 95 2 105 12 C118 10 130 20 130 32 C130 45 120 55 105 55 Z"
            fill="#ffffff"
          />
        </svg>
      </motion.div>

      <motion.div
        animate={{ x: [20, -20, 20], y: [6, -6, 6] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[40%] -right-10 w-56 opacity-85"
      >
        <svg viewBox="0 0 140 70" fill="none" className="w-full h-auto drop-shadow-[0_12px_24px_rgba(2,132,199,0.3)]">
          <path
            d="M30 55 C15 55 5 45 5 32 C5 20 18 10 32 12 C38 4 52 0 65 5 C75 0 95 2 105 12 C118 10 130 20 130 32 C130 45 120 55 105 55 Z"
            fill="#ffffff"
          />
        </svg>
      </motion.div>

      <motion.div
        animate={{ x: [-10, 10, -10], y: [-4, 4, -4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-36 -left-8 w-44 opacity-80"
      >
        <svg viewBox="0 0 140 70" fill="none" className="w-full h-auto drop-shadow-[0_12px_24px_rgba(2,132,199,0.3)]">
          <path
            d="M30 55 C15 55 5 45 5 32 C5 20 18 10 32 12 C38 4 52 0 65 5 C75 0 95 2 105 12 C118 10 130 20 130 32 C130 45 120 55 105 55 Z"
            fill="#ffffff"
          />
        </svg>
      </motion.div>

      {/* Orbital Path Trails (Like the globe's elliptical trajectory rings) */}
      <svg className="absolute inset-0 w-full h-full opacity-35" preserveAspectRatio="none">
        <ellipse
          cx="50%"
          cy="30%"
          rx="52%"
          ry="28%"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="8 12"
          transform="rotate(-8 500 300)"
        />
        <ellipse
          cx="48%"
          cy="65%"
          rx="56%"
          ry="32%"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          transform="rotate(6 500 650)"
        />
      </svg>

      {/* Margin Space Elements */}
      <div className="hidden sm:block">
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-48 left-6 text-3xl"
        >
          🚀
        </motion.div>
        <motion.div
          animate={{ y: [0, 14, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[35%] right-8 text-3xl"
        >
          🎈
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[60%] left-6 text-2xl opacity-75"
        >
          🪐
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[82%] right-7 text-2xl opacity-80"
        >
          🛰️
        </motion.div>
      </div>
    </div>
  );
};

// ========================================================
// 3. ORBITAL FLYBY DIVIDER (Cyan & Star Trails)
// ========================================================
const OrbitalFlybyDivider: React.FC<{ flip?: boolean }> = ({ flip = false }) => {
  return (
    <div
      className={`relative w-full my-6 sm:my-8 flex items-center justify-center select-none pointer-events-none ${
        flip ? '-scale-x-100' : ''
      }`}
    >
      <div className="relative w-full max-w-2xl h-10 flex items-center justify-center">
        <svg viewBox="0 0 600 50" fill="none" className="w-full h-full overflow-visible">
          <path
            d="M10 25 Q 160 5 300 25 T 590 25"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2"
            strokeDasharray="6 8"
          />
        </svg>
        <motion.div
          animate={{ x: [-24, 24, -24], y: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute text-xl drop-shadow-[0_2px_8px_rgba(56,189,248,0.8)]"
        >
          🚀
        </motion.div>
        <div className="absolute left-1/4 -top-1 text-cyan-200 text-xs animate-pulse">✦</div>
        <div className="absolute right-1/4 -bottom-1 text-white text-xs animate-pulse">✧</div>
      </div>
    </div>
  );
};

// ========================================================
// MAIN COMPONENT: ProfileShowcase (Cyan Space Theme + Auto-Scroll)
// ========================================================
export const ProfileShowcase: React.FC<ProfileShowcaseProps> = ({
  isOpen,
  onClose,
  profile,
  projects = [],
  onOpenContact,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Auto-scroll state
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1.3); // 1.3px per frame cruise
  const [userPausedNotice, setUserPausedNotice] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollAnimRef = useRef<number | null>(null);
  const isAutoScrollingRef = useRef(isAutoScrolling);
  isAutoScrollingRef.current = isAutoScrolling;

  // Track scroll position for top orbital rocket progress bar
  const handleContainerScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      setScrollProgress((scrollTop / maxScroll) * 100);
    }
  }, []);

  // Smooth frame-based auto-scrolling engine
  useEffect(() => {
    if (!isAutoScrolling) {
      if (autoScrollAnimRef.current) cancelAnimationFrame(autoScrollAnimRef.current);
      return;
    }

    let lastTime = performance.now();

    const autoScrollStep = (now: number) => {
      const delta = Math.min(32, now - lastTime);
      lastTime = now;

      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollHeight - container.clientHeight;

        if (container.scrollTop >= maxScroll - 2) {
          // Reached bottom: stop gracefully
          setIsAutoScrolling(false);
          return;
        }

        // Sub-pixel continuous momentum
        const increment = (scrollSpeed * 60 * delta) / 1000;
        container.scrollTop += increment;
      }

      autoScrollAnimRef.current = requestAnimationFrame(autoScrollStep);
    };

    autoScrollAnimRef.current = requestAnimationFrame(autoScrollStep);

    return () => {
      if (autoScrollAnimRef.current) cancelAnimationFrame(autoScrollAnimRef.current);
    };
  }, [isAutoScrolling, scrollSpeed]);

  // Pause auto-scroll when user manually scrolls or touches
  const handleManualUserScroll = () => {
    if (isAutoScrollingRef.current) {
      setIsAutoScrolling(false);
      setUserPausedNotice(true);
      setTimeout(() => setUserPausedNotice(false), 2400);
    }
  };

  const toggleAutoScroll = () => {
    sound.playClick();
    setIsAutoScrolling((prev) => !prev);
    setUserPausedNotice(false);
  };

  const startTourFromHero = () => {
    sound.playClick();
    setIsAutoScrolling(true);
    setUserPausedNotice(false);
    scrollToSection('intro-statement');
  };

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText('roopadeva48@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleEmailClick = () => {
    sound.playClick();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const email = 'roopadeva48@gmail.com';
    const subject = encodeURIComponent('Hello Deva — Creative Project Inquiry');
    const body = encodeURIComponent(
      'Hi Deva,\n\nI came across your 3D spatial portfolio and would love to chat about...'
    );

    if (isMobile) {
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    } else {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  const scrollToSection = (id: string) => {
    sound.playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element && scrollContainerRef.current) {
      const topOffset = element.offsetTop - 76;
      scrollContainerRef.current.scrollTo({
        top: topOffset,
        behavior: 'smooth',
      });
    }
  };

  if (!isOpen || !profile) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={scrollContainerRef}
        onScroll={handleContainerScroll}
        onWheel={handleManualUserScroll}
        onTouchMove={handleManualUserScroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 text-slate-900 overflow-y-auto flex flex-col font-doodle-body selection:bg-cyan-400 selection:text-slate-950"
        style={{
          background: 'linear-gradient(180deg, #38bdf8 0%, #0ea5e9 18%, #0284c7 42%, #0369a1 72%, #082f49 100%)',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* ========================================================
            TOP ROCKET ORBIT PROGRESS BAR
           ======================================================== */}
        <ScrollProgressRocket progress={scrollProgress} />

        {/* ========================================================
            CELESTIAL SPACE ATMOSPHERE (Clouds, Stars, Orbits)
           ======================================================== */}
        <CelestialSpaceAtmosphere />

        {/* ========================================================
            FLOATING COSMIC AUTO-SCROLL CONTROLLER (Bottom-Right)
           ======================================================== */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 select-none">
          {/* User pause feedback pill */}
          <AnimatePresence>
            {userPausedNotice && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-sky-950/90 text-cyan-200 text-xs px-3 py-1.5 rounded-full border border-cyan-400/50 backdrop-blur-md shadow-lg"
              >
                Orbit tour paused ⏸
              </motion.div>
            )}
          </AnimatePresence>

          {/* Speed Pills (Visible when auto-scrolling is active) */}
          {isAutoScrolling && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 bg-sky-950/90 backdrop-blur-md px-2 py-1.5 rounded-full border-2 border-cyan-400/40 text-xs text-sky-200 shadow-[0_4px_16px_rgba(2,132,199,0.4)]"
            >
              {[
                { label: '0.8x', val: 0.8 },
                { label: '1.3x', val: 1.3 },
                { label: '2.2x', val: 2.2 },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => setScrollSpeed(s.val)}
                  className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                    scrollSpeed === s.val
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-xs'
                      : 'hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Master Auto-Scroll Toggle Button */}
          <button
            onClick={toggleAutoScroll}
            className={`px-4 sm:px-5 py-2.5 rounded-full font-doodle-heading text-base sm:text-lg font-black flex items-center gap-2 cursor-pointer transition-all border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] ${
              isAutoScrolling
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.7)] animate-pulse'
                : 'bg-white text-slate-900 hover:bg-sky-50 hover:-translate-y-0.5'
            }`}
          >
            <span>{isAutoScrolling ? '⏸ Pause Orbit Tour' : '🚀 Auto-Scroll Orbit'}</span>
            {isAutoScrolling && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-900"></span>
              </span>
            )}
          </button>
        </div>

        {/* ========================================================
            NAVBAR (Glassmorphic Aerospace Navigation)
           ======================================================== */}
        <header className="sticky top-0 inset-x-0 z-40 bg-sky-950/75 backdrop-blur-md border-b-2 border-white/20 transition-all px-4 sm:px-8 py-3.5 flex items-center justify-between w-full text-white shadow-md">
          {/* Far-Left: Back to 3D Globe */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white text-slate-950 hover:bg-cyan-100 text-xs font-bold rounded-2xl cursor-pointer border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0284c7] transition-all hover:-translate-y-0.5"
            >
              <span>←</span>
              <span>Back to 3D Globe</span>
              <span className="text-sm">🌍</span>
            </button>
          </div>

          {/* Center Brand Logo: Script "Deva." with Glowing Cyan Dot */}
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection('hero')}
              className="font-doodle-heading text-3xl font-black text-white hover:text-cyan-300 transition-colors cursor-pointer flex items-baseline tracking-wide drop-shadow-sm"
            >
              <span>Deva</span>
              <span className="text-cyan-400 text-4xl leading-none">.</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-base font-bold text-sky-100">
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('tools')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Tools
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action: Auto-Tour Pill & "Let's talk" Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAutoScroll}
              className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-sky-900/80 hover:bg-sky-800 text-sky-200 text-xs font-bold rounded-xl border border-cyan-400/40 cursor-pointer"
              title="Toggle cinematic auto-scroll"
            >
              <span>{isAutoScrolling ? '⏸ Tour Active' : '🚀 Auto-Tour'}</span>
            </button>

            <button
              onClick={handleEmailClick}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs sm:text-sm font-black rounded-2xl cursor-pointer border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] transition-all hover:-translate-y-0.5"
            >
              <span>Let's talk</span>
              <span className="text-xs">🛰️</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-white text-slate-950 rounded-xl cursor-pointer text-sm font-bold border-2 border-slate-900"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed top-16 inset-x-4 z-50 bg-white/95 backdrop-blur-md border-2 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_#0284c7] flex flex-col gap-3 font-doodle-heading text-xl">
            <button onClick={() => scrollToSection('about')} className="text-left py-1.5 hover:text-cyan-600">
              📖 About Me
            </button>
            <button onClick={() => scrollToSection('skills')} className="text-left py-1.5 hover:text-cyan-600">
              ⚡ What I Do
            </button>
            <button onClick={() => scrollToSection('tools')} className="text-left py-1.5 hover:text-cyan-600">
              🛠 Technical Arsenal
            </button>
            <button onClick={() => scrollToSection('experience')} className="text-left py-1.5 hover:text-cyan-600">
              💼 Career Milestones
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-left py-1.5 hover:text-cyan-600">
              ✉️ Contact Transmission
            </button>
            <button
              onClick={toggleAutoScroll}
              className="py-2 bg-sky-100 text-sky-950 text-center text-lg font-black rounded-2xl border-2 border-slate-900"
            >
              {isAutoScrolling ? '⏸ Pause Auto-Scroll' : '🚀 Launch Auto-Scroll Orbit'}
            </button>
          </div>
        )}

        {/* ========================================================
            MAIN CONTAINER
           ======================================================== */}
        <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-16 sm:space-y-24">
          {/* ----------------------------------------------------
              SECTION 1: HERO
              - Script name "Deva's" + Polaroid Character Illustration
              - Fits initial screen without cutting off content
              - Start Auto-Scroll Orbit button + scroll down cue
             ---------------------------------------------------- */}
          <section
            id="hero"
            className="relative min-h-[calc(100vh-84px)] flex flex-col justify-between items-center text-center scroll-mt-24 pt-4 sm:pt-8 pb-4"
          >
            <div className="opacity-0 pointer-events-none select-none h-1" />

            {/* Central Composition: Polaroid Frame + Artistic Deva's Title */}
            <div className="relative w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 my-auto">
              {/* Handwritten Script Title "Deva's" with Space Tag */}
              <div className="order-2 md:order-1 flex flex-col items-center md:items-end z-10">
                <ArtisticDevaTitle suffix="'s" textColor="text-white" accentColor="#38bdf8" />
                <span className="font-doodle-label text-2xl sm:text-3xl font-extrabold text-white drop-shadow-[0_2px_6px_rgba(2,6,23,0.7)] -rotate-1 mt-1 tracking-wide">
                  Creative Technologist & 3D Engineer
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-100 bg-sky-950/60 px-3 py-1 rounded-full border border-cyan-400/40 mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Stationed atop the Globe 🪐</span>
                </span>
              </div>

              {/* Character Illustration / Polaroid Frame */}
              <div className="order-1 md:order-2 shrink-0 relative my-2">
                <ProfilePhotoFrame
                  photoUrl={profile.avatar || '/assets/profile/deva_photo.jpg'}
                  name={profile.name || 'Devaroopa'}
                />
              </div>
            </div>

            {/* Action Buttons in Hero */}
            <div className="pt-4 pb-2 flex flex-col items-center select-none z-10">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={startTourFromHero}
                  className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-2xl text-base font-black cursor-pointer flex items-center gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all hover:-translate-y-1"
                >
                  <span>🚀 Launch Auto-Scroll Tour</span>
                </button>
                <button
                  onClick={() => scrollToSection('intro-statement')}
                  className="px-5 py-3 bg-white/95 hover:bg-white text-slate-900 rounded-2xl text-base font-bold cursor-pointer flex items-center gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0284c7] transition-all hover:-translate-y-1"
                >
                  <span>Explore on My Own</span>
                  <span>↓</span>
                </button>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------
              SECTION 1.5: INTRO STATEMENT & ACTIONS (Reached After Scrolling)
              - Highlights the core mission statement
              - Location & Availability badges
              - Action buttons: "View my work", "Get in touch", "Copy Email"
             ---------------------------------------------------- */}
          <motion.section
            id="intro-statement"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative flex flex-col items-center text-center scroll-mt-28 pt-2 pb-6"
          >
            <div className="relative max-w-3xl w-full mx-auto bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0284c7] space-y-6">
              {/* Mission Statement */}
              <p className="font-doodle-body text-xl sm:text-2xl text-slate-900 font-medium leading-relaxed">
                Bridging the boundaries between spatial computing, 3D interactive graphics, and full-stack software architecture to craft digital experiences that amaze.
              </p>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
                <span className="px-4 py-1.5 bg-sky-100 text-sky-950 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0284c7] flex items-center gap-1.5">
                  <span>📍</span>
                  <span>{profile.location || 'Bengaluru, India'}</span>
                </span>
                <span className="px-4 py-1.5 bg-emerald-100 text-emerald-900 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0284c7] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Available for Select Projects</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="relative pt-2 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => scrollToSection('experience')}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-base font-bold cursor-pointer flex items-center gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0284c7] transition-all hover:-translate-y-0.5"
                >
                  <span>View my work</span>
                  <span>↓</span>
                </button>

                <button
                  onClick={handleEmailClick}
                  className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-2xl text-base font-bold cursor-pointer flex items-center gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all hover:-translate-y-0.5"
                >
                  <span>Get in touch</span>
                  <span>🛰️</span>
                </button>

                <button
                  onClick={handleCopyEmail}
                  className="px-5 py-3 bg-white hover:bg-sky-50 text-slate-900 rounded-2xl text-sm font-bold cursor-pointer flex items-center gap-1.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0284c7] transition-all hover:-translate-y-0.5"
                >
                  <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Email'}</span>
                  <span>📋</span>
                </button>
              </div>
            </div>
          </motion.section>

          {/* Orbital Divider */}
          <OrbitalFlybyDivider />

          {/* ----------------------------------------------------
              SECTION 2: ABOUT
              - Illustration LEFT, Story & Tilted Fact Cards RIGHT
             ---------------------------------------------------- */}
          <motion.section
            id="about"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8 scroll-mt-24"
          >
            <div className="flex flex-col items-start">
              <span className="font-doodle-label text-xl text-cyan-300 font-bold drop-shadow-sm">
                Orbit Transmission · Hello There!
              </span>
              <h2 className="font-doodle-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                I'm <span className="text-cyan-400">Devaroopa</span>, nice to meet you
              </h2>
              <SquiggleUnderline color="#38bdf8" className="mt-1" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Illustration LEFT */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                <div className="relative z-10 w-full max-w-sm flex justify-center">
                  <BeanbagGirlIllustration />
                </div>
              </div>

              {/* Story & Cards RIGHT */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4 font-doodle-body text-lg text-white drop-shadow-sm leading-relaxed bg-sky-950/50 p-6 rounded-3xl border border-sky-400/30 backdrop-blur-xs">
                  <p className="text-xl font-bold leading-snug text-cyan-100">
                    {profile.bio}
                  </p>
                  {profile.extendedBio.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Three Tilted Fact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/95 p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0284c7] text-center space-y-1 rotate-1 hover:rotate-0 transition-transform">
                    <div className="font-doodle-heading text-3xl font-black text-sky-600">
                      3+ Years
                    </div>
                    <div className="font-doodle-label text-sm font-bold text-slate-900">Experience</div>
                    <div className="font-doodle-body text-xs text-slate-600">Spatial & Full-Stack</div>
                  </div>

                  <div className="bg-sky-100 p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0284c7] text-center space-y-1 -rotate-1 hover:rotate-0 transition-transform">
                    <div className="font-doodle-heading text-3xl font-black text-slate-950">
                      Full-Stack
                    </div>
                    <div className="font-doodle-label text-sm font-bold text-slate-900">Domain</div>
                    <div className="font-doodle-body text-xs text-slate-800">WebGL, React & APIs</div>
                  </div>

                  <div className="bg-white/95 p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0284c7] text-center space-y-1 rotate-2 hover:rotate-0 transition-transform">
                    <div className="font-doodle-heading text-3xl font-black text-cyan-600">
                      100% Passion
                    </div>
                    <div className="font-doodle-label text-sm font-bold text-slate-900">Playful Fuel</div>
                    <div className="font-doodle-body text-xs text-slate-600">Curiosity & Craft ⚡</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Orbital Divider */}
          <OrbitalFlybyDivider flip />

          {/* ----------------------------------------------------
              SECTION 3: SKILLS ("Core Craft")
             ---------------------------------------------------- */}
          <motion.section
            id="skills"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8 scroll-mt-24"
          >
            <div className="flex flex-col items-start">
              <span className="font-doodle-label text-xl text-cyan-300 font-bold drop-shadow-sm">
                Orbital Capabilities · Core Craft
              </span>
              <h2 className="font-doodle-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                What I do & <span className="text-cyan-400">love doing</span>
              </h2>
              <SquiggleUnderline color="#38bdf8" className="mt-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Hand Crafting & Website Crafting */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0284c7] hover:shadow-[6px_6px_0px_0px_#38bdf8] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">✂️</span>
                  <span className="font-doodle-label text-xs font-bold px-3 py-1 bg-sky-100 text-sky-900 rounded-full border border-slate-900">
                    Handmade & Web
                  </span>
                </div>
                <h3 className="font-doodle-heading text-2xl font-black text-slate-900">
                  Hand Crafting & Website Crafting
                </h3>
                <p className="font-doodle-body text-base text-slate-700 leading-relaxed">
                  Fusing tactile handmade creations, miniature models, and papercraft with modern interactive websites, responsive layouts, and delightful digital experiences.
                </p>
              </div>

              {/* Card 2: Full-Stack Engineering */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0284c7] hover:shadow-[6px_6px_0px_0px_#38bdf8] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">⚙️</span>
                  <span className="font-doodle-label text-xs font-bold px-3 py-1 bg-sky-100 text-sky-900 rounded-full border border-slate-900">
                    Architecture
                  </span>
                </div>
                <h3 className="font-doodle-heading text-2xl font-black text-slate-900">
                  Full-Stack Web Engineering
                </h3>
                <p className="font-doodle-body text-base text-slate-700 leading-relaxed">
                  Building production-grade client & server architectures, RESTful backend APIs, state stores, secure authentication, and resilient full-stack systems.
                </p>
              </div>

              {/* Card 3: UI/UX & Motion Design */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0284c7] hover:shadow-[6px_6px_0px_0px_#38bdf8] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🎨</span>
                  <span className="font-doodle-label text-xs font-bold px-3 py-1 bg-sky-100 text-sky-900 rounded-full border border-slate-900">
                    Aesthetics
                  </span>
                </div>
                <h3 className="font-doodle-heading text-2xl font-black text-slate-900">
                  Hand-Drawn & Motion UI/UX
                </h3>
                <p className="font-doodle-body text-base text-slate-700 leading-relaxed">
                  Sculpting high-delight interfaces, playful micro-interactions, custom SVGs, fluid layout transitions, and responsive hand-drawn design systems.
                </p>
              </div>

              {/* Card 4: Poster Designing */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0284c7] hover:shadow-[6px_6px_0px_0px_#38bdf8] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🖼️</span>
                  <span className="font-doodle-label text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-slate-900">
                    Visual Art
                  </span>
                </div>
                <h3 className="font-doodle-heading text-2xl font-black text-slate-900">
                  Poster Designing
                </h3>
                <p className="font-doodle-body text-base text-slate-700 leading-relaxed">
                  Creating eye-catching event posters, typographic compositions, promotional artwork, and creative digital graphics with bold visual hierarchy and color harmony.
                </p>
              </div>

              {/* Card 5: Logo Designing */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0284c7] hover:shadow-[6px_6px_0px_0px_#38bdf8] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">✒️</span>
                  <span className="font-doodle-label text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full border border-slate-900">
                    Brand Identity
                  </span>
                </div>
                <h3 className="font-doodle-heading text-2xl font-black text-slate-900">
                  Logo Designing
                </h3>
                <p className="font-doodle-body text-base text-slate-700 leading-relaxed">
                  Crafting memorable brand marks, iconic emblems, minimalist vector symbols, and custom typographic identity systems that resonate across print and digital media.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Orbital Divider */}
          <OrbitalFlybyDivider />

          {/* ----------------------------------------------------
              SECTION 4: TOOLS ("Technical Arsenal")
             ---------------------------------------------------- */}
          <motion.section
            id="tools"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8 scroll-mt-24"
          >
            <div className="flex flex-col items-start">
              <span className="font-doodle-label text-xl text-cyan-300 font-bold drop-shadow-sm">
                Equipment Deck · Technical Arsenal
              </span>
              <h2 className="font-doodle-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                Tools I'm <span className="text-cyan-400">fluent in</span>
              </h2>
              <SquiggleUnderline color="#38bdf8" className="mt-1" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white/95 p-6 sm:p-10 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0284c7]">
              {/* Illustrated Juggling Girl LEFT */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-xs">
                  <JugglingGirlIllustration />
                </div>
              </div>

              {/* Round Space Badges RIGHT (Cyan Accents, Zero Yellow) */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-5">
                  {[
                    { initial: 'Ts', name: 'TypeScript' },
                    { initial: 'Re', name: 'React' },
                    { initial: '3D', name: 'Three.js' },
                    { initial: 'Py', name: 'Python' },
                    { initial: 'Fm', name: 'Motion' },
                    { initial: 'Gl', name: 'WebGL' },
                    { initial: 'Nd', name: 'Node.js' },
                    { initial: 'Tw', name: 'Tailwind' },
                    { initial: 'Fg', name: 'Figma' },
                    { initial: 'Ps', name: 'Photoshop' },
                    { initial: 'Ai', name: 'Illustrator' },
                    { initial: 'Git', name: 'GitHub' },
                  ].map((tool, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center space-y-1.5 group cursor-default"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900 text-cyan-400 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0284c7] group-hover:shadow-[4px_4px_0px_0px_#38bdf8] group-hover:-translate-y-1 transition-all flex items-center justify-center font-doodle-heading text-2xl font-black select-none">
                        {tool.initial}
                      </div>
                      <span className="font-doodle-body text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                        {tool.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Orbital Divider */}
          <OrbitalFlybyDivider flip />

          {/* ----------------------------------------------------
              SECTION 5: EXPERIENCE ("Career Milestones")
             ---------------------------------------------------- */}
          <motion.section
            id="experience"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8 scroll-mt-24"
          >
            <div className="flex flex-col items-start">
              <span className="font-doodle-label text-xl text-cyan-300 font-bold drop-shadow-sm">
                Flight Log · Career Milestones
              </span>
              <h2 className="font-doodle-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                Where my <span className="text-cyan-400">journey has traveled</span>
              </h2>
              <SquiggleUnderline color="#38bdf8" className="mt-1" />
            </div>

            <div className="space-y-8">
              {profile.experience.map((exp, eIdx) => (
                <div
                  key={eIdx}
                  className="relative bg-white/95 rounded-3xl p-6 sm:p-8 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0284c7] space-y-4 pt-9"
                >
                  <div className="absolute -top-3.5 left-8">
                    <PushPinDoodle color={eIdx % 2 === 0 ? '#0284c7' : '#38bdf8'} />
                  </div>

                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-5 bg-sky-100 border border-slate-900 rounded-xs rotate-[-1deg] flex items-center justify-center pointer-events-none">
                    <span className="font-doodle-label text-[10px] font-bold text-slate-900">
                      ORBIT MILESTONE #{eIdx + 1}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-dashed border-slate-200 pb-3">
                    <div>
                      <h3 className="font-doodle-heading text-2xl font-black text-slate-900">
                        {exp.role}
                      </h3>
                      <p className="font-doodle-label text-lg font-bold text-sky-600">
                        {exp.company}
                      </p>
                    </div>
                    <span className="font-doodle-body text-sm font-bold text-slate-900 bg-sky-100 px-3.5 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0284c7] w-fit">
                      {exp.period}
                    </span>
                  </div>

                  <p className="font-doodle-body text-base text-slate-700 leading-relaxed">
                    {exp.description}
                  </p>

                  <ul className="space-y-1.5 font-doodle-body text-sm text-slate-700">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-cyan-500 font-black">✔</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Orbital Divider */}
          <OrbitalFlybyDivider />


          {/* ----------------------------------------------------
              SECTION 7: CONTACT
             ---------------------------------------------------- */}
          <motion.section
            id="contact"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8 scroll-mt-24 text-center"
          >
            <div className="flex flex-col items-center">
              <span className="font-doodle-label text-xl text-cyan-300 font-bold drop-shadow-sm">
                Satellite Uplink · Get In Touch
              </span>
              <h2 className="font-doodle-heading text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md">
                Let's <span className="text-cyan-400">build something</span> together!
              </h2>
              <SquiggleUnderline color="#38bdf8" className="mt-2" />
              <p className="font-doodle-body text-lg text-sky-100 max-w-xl mx-auto mt-4 drop-shadow-sm">
                Have an ambitious idea, spatial computing project, or creative challenge? Let's connect and build something extraordinary.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-white/95 p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0284c7] space-y-1">
                <div className="text-2xl">✉️</div>
                <div className="font-doodle-heading text-lg font-black text-slate-900">Email</div>
                <div className="font-doodle-body text-sm font-bold text-sky-600 break-all">
                  roopadeva48@gmail.com
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleEmailClick}
                className="px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-2xl text-lg font-black cursor-pointer flex items-center gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] transition-all hover:-translate-y-1"
              >
                <span>Send a Transmission</span>
                <span>🛰️</span>
              </button>

              <button
                onClick={handleCopyEmail}
                className="px-6 py-3.5 bg-white hover:bg-sky-50 text-slate-900 rounded-2xl text-base font-bold cursor-pointer flex items-center gap-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0284c7] transition-all hover:-translate-y-1"
              >
                <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Email'}</span>
                <span>📋</span>
              </button>
            </div>
          </motion.section>
        </main>

        {/* ========================================================
            FOOTER (Cosmic Night Horizon)
           ======================================================== */}
        <footer className="mt-20 bg-sky-950 text-white border-t-2 border-sky-400/30 py-8 px-4 text-center">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-doodle-heading text-2xl font-black flex items-baseline">
              <span>Deva</span>
              <span className="text-cyan-400 text-3xl leading-none">.</span>
            </div>
            <p className="font-doodle-body text-sm text-sky-200">
              Crafted with ♡ & 3D space wonder by Devaroopa · 3D Spatial & Creative Engineering Portfolio
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/roopadeva48-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-300 hover:text-cyan-300 transition-colors text-sm font-bold"
              >
                GitHub ↗
              </a>
              <span className="text-sky-600">·</span>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="text-sky-300 hover:text-cyan-300 transition-colors text-sm font-bold cursor-pointer"
              >
                3D Globe 🌍
              </button>
            </div>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};
