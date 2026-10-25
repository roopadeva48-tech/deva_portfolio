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
// ========================================================
// 2. ANIME SKY & EARTH SPACE BACKGROUND
// - At top: Luminous anime sky with fluffy cumulus clouds
// - When scrolling down: Clouds move downwards (parallax descent)
//   and reveal deep space and planet Earth with atmospheric halo
// - When scrolling up: Returns to the clouds and sky
// ========================================================
interface AnimeSkyBackgroundProps {
  scrollProgress: number;
}

const AnimeSkyBackground: React.FC<AnimeSkyBackgroundProps> = ({ scrollProgress }) => {
  // progress: 0 (top/hero) to 1 (bottom/contact)
  const progress = Math.min(1, Math.max(0, scrollProgress / 100));

  // 1. Cloud Layer Parallax:
  // Move downwards smoothly without ever exposing a top edge
  const cloudsTranslateY = progress * 42; // moves downwards within extended container
  const cloudsOpacity = Math.max(0, 1 - Math.pow(progress, 1.1) * 1.25);

  // 2. Cosmic Deep Space Atmosphere Transition:
  const spaceOpacity = Math.min(1, Math.max(0, (progress - 0.05) * 1.3));

  // 3. Earth Globe Emergence:
  const earthProgress = Math.min(1, Math.max(0, (progress - 0.1) / 0.9));
  const earthTranslateY = (1 - earthProgress) * 70 + 8; // moves from 78vh down to 8vh
  const earthScale = 0.7 + earthProgress * 0.38; // scales from 0.7 to ~1.08
  const earthOpacity = Math.min(1, Math.max(0, earthProgress * 1.4));

  // 4. Foreground Passing Cloud Wisps (Faster Parallax Descent)
  const wispsTranslateY = progress * 75;
  const wispsOpacity = Math.max(0, 1 - progress * 1.4);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* 1. Underlying Natural Atmospheric Sky Gradient (Seamless Color Shading from Cosmic Space to Daylight Blue) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #020817 0%, #06193d 28%, #0d3b84 55%, #1d72d6 80%, #38bdf8 100%)',
        }}
      />

      {/* 2. Deep Cosmic Space & Twinkling Stars (Fades in smoothly as you descend) */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: spaceOpacity,
          background: 'radial-gradient(ellipse at 50% 90%, #0b2554 0%, #04122d 42%, #020817 78%, #01040f 100%)',
        }}
      >
        <div className="absolute top-[8%] left-[12%] text-cyan-200/90 text-sm animate-pulse">✦</div>
        <div className="absolute top-[16%] right-[15%] text-white/80 text-xs animate-pulse delay-500">✧</div>
        <div className="absolute top-[26%] left-[28%] text-sky-200/70 text-xs animate-pulse delay-1000">✦</div>
        <div className="absolute top-[34%] right-[26%] text-white/90 text-sm animate-pulse delay-700">✧</div>
        <div className="absolute top-[48%] left-[8%] text-cyan-300/80 text-xs animate-pulse delay-300">✦</div>
        <div className="absolute top-[58%] right-[10%] text-sky-100/75 text-sm animate-pulse delay-1200">✧</div>
        <div className="absolute top-[72%] left-[18%] text-white/60 text-xs animate-pulse delay-900">✦</div>
        <div className="absolute top-[82%] right-[22%] text-cyan-200/90 text-xs animate-pulse delay-400">✧</div>
      </div>

      {/* 3. Earth Globe Layer (Rises into view with Soft Atmospheric Cyan Shading — No Harsh Lines) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 transition-transform duration-150 ease-out will-change-transform flex flex-col items-center justify-center pointer-events-none"
        style={{
          top: 0,
          transform: `translate3d(-50%, ${earthTranslateY}vh, 0) scale(${earthScale})`,
          opacity: earthOpacity,
        }}
      >
        {/* Soft Radial Atmospheric Cyan Halo (Pure Color Shading) */}
        <div className="absolute w-[400px] h-[400px] sm:w-[560px] sm:h-[560px] md:w-[720px] md:h-[720px] rounded-full bg-gradient-to-tr from-cyan-400/30 via-sky-300/20 to-transparent blur-3xl animate-earth-glow pointer-events-none" />

        {/* Photorealistic 3D Earth Globe with Living Orbital Float */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[480px] md:h-[480px] lg:w-[560px] lg:h-[560px] animate-earth-float">
          <img
            src="/assets/profile/earth_globe.png"
            alt="Planet Earth"
            className="w-full h-full object-contain drop-shadow-[0_25px_60px_rgba(2,132,199,0.5)]"
          />

          {/* Orbiting Satellite Transmission Badge */}
          <div className="absolute -top-3 -right-2 bg-sky-950/85 border-2 border-cyan-400/60 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-mono font-bold text-cyan-200 flex items-center gap-1.5 shadow-lg select-none">
            <span className="animate-spin text-sm" style={{ animationDuration: '8s' }}>🛰️</span>
            <span>Station Earth</span>
          </div>
        </div>
      </div>

      {/* 4. Anime Clouds Layer (Oversized & Feathered Mask — Seamlessly Shaded with Zero Hard Line Edges) */}
      <div
        className="absolute left-[-5%] right-[-5%] overflow-hidden transition-transform duration-150 ease-out will-change-transform"
        style={{
          top: '-50vh',
          height: '180vh',
          transform: `translate3d(0, ${cloudsTranslateY}vh, 0)`,
          opacity: cloudsOpacity,
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 15%, black 35%, black 75%, rgba(0,0,0,0.4) 90%, transparent 100%)',
          maskImage: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 15%, black 35%, black 75%, rgba(0,0,0,0.4) 90%, transparent 100%)',
        }}
      >
        <picture className="w-full h-full block animate-sky-anime">
          <source
            media="(max-aspect-ratio: 1/1)"
            srcSet="/assets/profile/sky_clouds_mobile.png"
          />
          <source
            media="(min-aspect-ratio: 1/1)"
            srcSet="/assets/profile/sky_clouds_desktop.jpg"
          />
          <img
            src="/assets/profile/sky_clouds_desktop.jpg"
            alt="Luminous Anime Sky with Volumetric Clouds"
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>

      {/* 5. Smooth Atmospheric Gradient Shade Overlay (Melts dark space color into clouds) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: spaceOpacity,
          background: 'linear-gradient(180deg, #020817 0%, rgba(3, 11, 28, 0.9) 20%, rgba(6, 25, 61, 0.6) 45%, rgba(13, 56, 128, 0.3) 70%, transparent 100%)',
        }}
      />

      {/* 6. Passing Cloud Wisps (Soft feathered blur for depth) */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: `translate3d(0, ${wispsTranslateY}vh, 0)`,
          opacity: wispsOpacity,
        }}
      >
        <div className="absolute top-[20%] left-[-5%] w-[420px] h-[140px] bg-white/20 blur-3xl rounded-full" />
        <div className="absolute top-[45%] right-[-8%] w-[480px] h-[160px] bg-cyan-100/25 blur-3xl rounded-full" />
        <div className="absolute top-[70%] left-[10%] w-[520px] h-[180px] bg-white/25 blur-3xl rounded-full" />
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
        if (maxScroll > 0) {
          setScrollProgress((container.scrollTop / maxScroll) * 100);
        }
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
        className="fixed inset-0 z-40 text-slate-900 overflow-y-auto flex flex-col font-doodle-body selection:bg-cyan-400 selection:text-slate-950 bg-[#1e6fcf]"
      >
        {/* ========================================================
            TOP ROCKET ORBIT PROGRESS BAR
           ======================================================== */}
        <ScrollProgressRocket progress={scrollProgress} />

        {/* ========================================================
            ANIME SKY & EARTH SPACE BACKGROUND (Scroll-Driven Descent)
           ======================================================== */}
        <AnimeSkyBackground scrollProgress={scrollProgress} />

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

          {/* Right Action: Auto-Tour Button + Speed Pills & "Let's talk" Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAutoScroll}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                isAutoScrolling
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                  : 'bg-sky-900/80 hover:bg-sky-800 text-sky-100 border-cyan-400/40'
              }`}
              title="Toggle cinematic auto-scroll"
            >
              <span>{isAutoScrolling ? '⏸ Tour Active' : '🚀 Auto-Tour'}</span>
            </button>

            {/* Auto-Tour Speed Selector directly in Header near Auto-Tour button */}
            <div className="hidden md:flex items-center gap-1 bg-sky-900/80 backdrop-blur-md px-1.5 py-1 rounded-xl border border-cyan-400/40 text-[11px] text-sky-200">
              <span className="text-[10px] font-bold text-sky-300 pl-1 pr-0.5">Speed:</span>
              {[
                { label: '0.8x', val: 0.8 },
                { label: '1.3x', val: 1.3 },
                { label: '2.2x', val: 2.2 },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    sound.playClick();
                    setScrollSpeed(s.val);
                  }}
                  title={`Set auto-tour speed to ${s.label}`}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                    scrollSpeed === s.val
                      ? 'bg-cyan-400 text-slate-950 shadow-xs'
                      : 'hover:text-white text-sky-200 hover:bg-sky-800/60'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

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
            <div className="flex items-center justify-center gap-2 pt-1 pb-1">
              <span className="font-doodle-label text-sm font-bold text-slate-700">Speed:</span>
              {[
                { label: '0.8x', val: 0.8 },
                { label: '1.3x', val: 1.3 },
                { label: '2.2x', val: 2.2 },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    sound.playClick();
                    setScrollSpeed(s.val);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border border-slate-900 transition-all ${
                    scrollSpeed === s.val
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-xs'
                      : 'bg-white text-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
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
            <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 my-auto">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Website Crafting */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0284c7] hover:shadow-[6px_6px_0px_0px_#38bdf8] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🌐</span>
                  <span className="font-doodle-label text-xs font-bold px-3 py-1 bg-sky-100 text-sky-900 rounded-full border border-slate-900">
                    Web Craft
                  </span>
                </div>
                <h3 className="font-doodle-heading text-2xl font-black text-slate-900">
                  Website Crafting
                </h3>
                <p className="font-doodle-body text-base text-slate-700 leading-relaxed">
                  Crafting responsive web applications, interactive portfolios, and engaging landing pages with clean architectures and smooth navigation.
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

              {/* Card 6: Hand Crafting */}
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0284c7] hover:shadow-[6px_6px_0px_0px_#38bdf8] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">✂️</span>
                  <span className="font-doodle-label text-xs font-bold px-3 py-1 bg-sky-100 text-sky-900 rounded-full border border-slate-900">
                    Tactile Craft
                  </span>
                </div>
                <h3 className="font-doodle-heading text-2xl font-black text-slate-900">
                  Hand Crafting
                </h3>
                <p className="font-doodle-body text-base text-slate-700 leading-relaxed">
                  Creating tactile handmade artifacts, DIY papercraft, miniature diorama models, and physical creative sculptures that inspire playful imagination.
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
                    { initial: 'Sb', name: 'Supabase' },
                    { initial: 'Py', name: 'Python' },
                    { initial: 'Ca', name: 'Canva' },
                    { initial: 'Gl', name: 'WebGL' },
                    { initial: 'Nd', name: 'Node.js' },
                    { initial: 'Tw', name: 'Tailwind' },
                    { initial: 'Fg', name: 'Figma' },
                    { initial: 'Ps', name: 'Photoshop' },
                    { initial: 'Ai', name: 'Google AI Studio' },
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
