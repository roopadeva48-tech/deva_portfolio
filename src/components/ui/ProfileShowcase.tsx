import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileData, ProjectItem, CertificateItem } from '../../types';
import { sound } from '../../utils/audio';
import { fallbackProjects, fallbackCertificates } from '../../services/api';
import {
  BeanbagGirlIllustration,
  JugglingGirlIllustration,
} from './illustrated/GirlIllustrations';
import { ProfilePhotoFrame } from './ProfilePhotoFrame';
import {
  PaperPlaneDoodle,
  ScissorsDoodle,
  LightbulbDoodle,
  SquigglyArrowDoodle,
  PushPinDoodle,
  ArtisticDevaTitle,
  SquiggleUnderline,
  SectionCurvedPlaneDivider,
  PencilDoodle,
  BrushDoodle,
  PaletteDoodle,
  CrayonDoodle,
  StarDoodle,
  SwirlDoodle,
  HeartDoodle,
  PaintDropDoodle,
  SparkleDoodle,
  ScrollProgressPencil,
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

// Flat 2D Margin Doodle Scatter (Left and Right page margins, hidden on phones <640px)
const MarginDoodles: React.FC = () => {
  return (
    <div className="hidden sm:block pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Left Margin Doodles */}
      <div className="absolute top-36 left-4 md:left-8 animate-wiggle">
        <PencilDoodle className="w-8 h-8 opacity-75" />
      </div>
      <div className="absolute top-[28%] left-3 md:left-6 animate-spin-slow">
        <StarDoodle className="w-7 h-7 opacity-70" color="#F26A1F" />
      </div>
      <div className="absolute top-[48%] left-4 md:left-7 animate-bob">
        <PaintDropDoodle className="w-6 h-7 opacity-80" />
      </div>
      <div className="absolute top-[68%] left-3 md:left-6 animate-wiggle">
        <BrushDoodle className="w-8 h-8 opacity-75" />
      </div>
      <div className="absolute top-[86%] left-4 md:left-8 animate-float">
        <SwirlDoodle className="w-7 h-7 opacity-60" />
      </div>

      {/* Right Margin Doodles */}
      <div className="absolute top-44 right-4 md:right-8 animate-bob">
        <PaletteDoodle className="w-8 h-8 opacity-75" />
      </div>
      <div className="absolute top-[32%] right-3 md:right-6 animate-wiggle">
        <CrayonDoodle className="w-8 h-8 opacity-75" />
      </div>
      <div className="absolute top-[52%] right-4 md:right-8 animate-float">
        <HeartDoodle className="w-7 h-7 opacity-80" fill="#F26A1F" />
      </div>
      <div className="absolute top-[72%] right-3 md:right-6 animate-spin-slow">
        <StarDoodle className="w-7 h-7 opacity-70" color="#FFE9DC" />
      </div>
      <div className="absolute top-[88%] right-4 md:right-8 animate-bob">
        <LightbulbDoodle className="w-9 h-11 opacity-80" />
      </div>
    </div>
  );
};

export const ProfileShowcase: React.FC<ProfileShowcaseProps> = ({
  isOpen,
  onClose,
  profile,
  projects = [],
  certificates = [],
  onOpenContact,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !profile) return null;

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;
  const displayCertificates = certificates.length > 0 ? certificates : fallbackCertificates;

  // Track scroll position for top orange pencil progress bar
  const handleContainerScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      setScrollProgress((scrollTop / maxScroll) * 100);
    }
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
    const body = encodeURIComponent('Hi Deva,\n\nI came across your portfolio and would love to chat about...');

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
      const topOffset = element.offsetTop - 72;
      scrollContainerRef.current.scrollTo({
        top: topOffset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={scrollContainerRef}
        onScroll={handleContainerScroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 bg-[#FDFBF7] text-[#141414] overflow-y-auto flex flex-col font-doodle-body selection:bg-[#F26A1F] selection:text-white"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(20, 20, 20, 0.04) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* ========================================================
            TOP SCROLL-PROGRESS BAR (Thin Orange line + Riding Pencil)
           ======================================================== */}
        <ScrollProgressPencil progress={scrollProgress} />

        {/* ========================================================
            MARGIN LINE-ART DOODLES (Wiggling, floating, spinning)
           ======================================================== */}
        <MarginDoodles />

        {/* ========================================================
            1. NAVBAR
            - Far-Left: "← Back to 3D Globe 🌍" (matches exact user instruction)
            - Script logo: Deva.
            - Links: About / Skills / Tools / Experience / Certificates / Contact
            - "Let's talk" Button
           ======================================================== */}
        <header className="sticky top-0 inset-x-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-xs border-b-2 border-[#141414] transition-all px-4 sm:px-8 py-3.5 flex items-center justify-between w-full">
          {/* Far-Left: Back to 3D Globe Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="doodle-btn-black flex items-center gap-2 px-3.5 py-1.5 bg-[#FFFFFF] hover:bg-[#FFE9DC] text-[#141414] text-xs font-bold rounded-2xl cursor-pointer"
            >
              <span>←</span>
              <span>Back to 3D Globe</span>
              <span className="text-sm">🌍</span>
            </button>
          </div>

          {/* Center / Brand Logo: Script "Deva." with orange dot */}
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection('hero')}
              className="font-doodle-heading text-3xl font-black text-[#141414] hover:text-[#F26A1F] transition-colors cursor-pointer flex items-baseline tracking-wide"
            >
              <span>Deva</span>
              <span className="text-[#F26A1F] text-4xl leading-none">.</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-base font-bold text-[#141414]">
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-[#F26A1F] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="hover:text-[#F26A1F] transition-colors cursor-pointer"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('tools')}
              className="hover:text-[#F26A1F] transition-colors cursor-pointer"
            >
              Tools
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="hover:text-[#F26A1F] transition-colors cursor-pointer"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('certificates')}
              className="hover:text-[#F26A1F] transition-colors cursor-pointer"
            >
              Certificates
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-[#F26A1F] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action: "Let's talk" Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleEmailClick}
              className="hidden sm:flex doodle-btn-orange items-center gap-1.5 px-4 py-1.5 bg-[#F26A1F] hover:bg-[#ff7a2f] text-white text-xs sm:text-sm font-black rounded-2xl cursor-pointer"
            >
              <span>Let's talk</span>
              <span className="text-xs">✏️</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden doodle-btn-black p-2 bg-white text-[#141414] rounded-xl cursor-pointer text-sm"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed top-16 inset-x-4 z-50 bg-white border-2 border-[#141414] rounded-3xl p-5 shadow-[4px_4px_0px_0px_#141414] flex flex-col gap-3 font-doodle-heading text-xl">
            <button
              onClick={() => scrollToSection('about')}
              className="text-left py-1.5 hover:text-[#F26A1F]"
            >
              📖 About Me
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="text-left py-1.5 hover:text-[#F26A1F]"
            >
              ⚡ What I Do
            </button>
            <button
              onClick={() => scrollToSection('tools')}
              className="text-left py-1.5 hover:text-[#F26A1F]"
            >
              🛠 Tools I'm Fluent In
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="text-left py-1.5 hover:text-[#F26A1F]"
            >
              💼 Where My Pencil Has Been
            </button>
            <button
              onClick={() => scrollToSection('certificates')}
              className="text-left py-1.5 hover:text-[#F26A1F]"
            >
              🏆 Verified Honors
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-left py-1.5 hover:text-[#F26A1F]"
            >
              ✉️ Let's Draw Something Together
            </button>
            <button
              onClick={handleEmailClick}
              className="doodle-btn-orange mt-2 py-2.5 bg-[#F26A1F] text-white text-center text-lg font-black rounded-2xl"
            >
              Let's talk ✏️
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
              - Orange one-line tagline & narrative description
              - Action buttons: "View my work", "Resume", "Copy Email"
             ---------------------------------------------------- */}
          <section
            id="hero"
            className="relative pt-6 sm:pt-10 pb-8 flex flex-col items-center text-center scroll-mt-24"
          >
            {/* Composition: Character Frame + Handwritten Script Title */}
            <div className="relative w-full max-w-3xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 my-4">
              {/* Handwritten Script Title "Deva's" */}
              <div className="order-2 md:order-1 flex flex-col items-center md:items-end z-10">
                <ArtisticDevaTitle suffix="'s" />
                <span className="font-doodle-label text-2xl sm:text-3xl font-bold text-[#F26A1F] -rotate-1 mt-1 tracking-wide">
                  Creative Technologist & 3D Engineer
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

            {/* Description & Narrative */}
            <div className="max-w-2xl mx-auto mt-6 space-y-4">
              <p className="font-doodle-body text-lg sm:text-xl text-[#141414] leading-relaxed">
                Bridging the boundaries between spatial computing, 3D interactive graphics, and full-stack software architecture to craft digital experiences that amaze.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
                <span className="px-3.5 py-1 bg-[#FFE9DC] text-[#141414] rounded-full border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414]">
                  📍 {profile.location || 'Bengaluru, India'}
                </span>
                <span className="px-3.5 py-1 bg-white text-[#141414] rounded-full border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414]">
                  ● Available for Select Projects
                </span>
              </div>
            </div>

            {/* Hero Action Buttons */}
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection('experience')}
                className="doodle-btn-black px-6 py-3 bg-[#141414] hover:bg-[#2d2d2d] text-white rounded-2xl text-base font-bold cursor-pointer flex items-center gap-2"
              >
                <span>View my work</span>
                <span>↓</span>
              </button>

              <button
                onClick={handleEmailClick}
                className="doodle-btn-orange px-6 py-3 bg-[#FFFFFF] hover:bg-[#FFE9DC] text-[#141414] rounded-2xl text-base font-bold cursor-pointer flex items-center gap-2"
              >
                <span>Get in touch</span>
                <span>✏️</span>
              </button>

              <button
                onClick={handleCopyEmail}
                className="doodle-btn-black px-5 py-3 bg-[#FFE9DC] hover:bg-[#ffd9c2] text-[#141414] rounded-2xl text-sm font-bold cursor-pointer flex items-center gap-1.5"
              >
                <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Email'}</span>
                <span>📋</span>
              </button>

              {/* Doodled curly arrow pointing down */}
              <div className="hidden sm:block absolute -right-20 top-2">
                <SquigglyArrowDoodle label="scroll down!" direction="down" />
              </div>
            </div>
          </section>

          {/* Section Curving Paper Plane Divider */}
          <SectionCurvedPlaneDivider />

          {/* ----------------------------------------------------
              SECTION 2: ABOUT
              - Two columns: illustration LEFT, text RIGHT
              - Pale orange morphing blob behind character
              - Story, 3 tilted fact cards, hobbies as dashed pills
             ---------------------------------------------------- */}
          <section id="about" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col items-start">
              <span className="font-doodle-label text-xl text-[#F26A1F] font-bold">
                Hello there!
              </span>
              <h2 className="font-doodle-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#141414] tracking-tight">
                I'm <span className="text-[#F26A1F]">Devaroopa</span>, nice to meet you
              </h2>
              <SquiggleUnderline color="#F26A1F" className="mt-1" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Illustration LEFT with Morphing Pale Orange Blob (#FFE9DC) */}
              <div className="lg:col-span-5 flex flex-col items-center relative">
                {/* Morphing Pale Orange Blob behind the character */}
                <div className="absolute inset-0 -m-6 bg-[#FFE9DC] animate-blob-morph opacity-90 z-0 pointer-events-none" />

                <div className="relative z-10 w-full max-w-sm">
                  <BeanbagGirlIllustration />
                </div>

                {/* Tilted Polaroid Sticker */}
                <div className="relative z-10 mt-3 rotate-2 bg-white p-3 rounded-2xl border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] flex items-center gap-3 max-w-xs">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#141414] shrink-0"
                  />
                  <div>
                    <div className="font-doodle-heading text-lg font-black text-[#141414] leading-tight">
                      devaroopa
                    </div>
                    <div className="font-doodle-body text-xs text-[#F26A1F] font-bold">
                      spatial engineer & artist
                    </div>
                  </div>
                </div>
              </div>

              {/* Narrative Story & Tilted Fact Cards RIGHT */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4 font-doodle-body text-lg text-[#141414] leading-relaxed">
                  <p className="text-xl font-bold leading-snug">
                    {profile.bio}
                  </p>
                  {profile.extendedBio.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Three Tilted Fact Cards with Hard Drop Shadows */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white p-4 rounded-2xl border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] text-center space-y-1 rotate-1 hover:rotate-0 transition-transform">
                    <div className="font-doodle-heading text-3xl font-black text-[#F26A1F]">
                      3+ Years
                    </div>
                    <div className="font-doodle-label text-sm font-bold text-[#141414]">Experience</div>
                    <div className="font-doodle-body text-xs text-stone-600">Spatial & Full-Stack</div>
                  </div>

                  <div className="bg-[#FFE9DC] p-4 rounded-2xl border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] text-center space-y-1 -rotate-1 hover:rotate-0 transition-transform">
                    <div className="font-doodle-heading text-3xl font-black text-[#141414]">
                      Full-Stack
                    </div>
                    <div className="font-doodle-label text-sm font-bold text-[#141414]">Domain</div>
                    <div className="font-doodle-body text-xs text-stone-700">WebGL, React & APIs</div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] text-center space-y-1 rotate-2 hover:rotate-0 transition-transform">
                    <div className="font-doodle-heading text-3xl font-black text-[#F26A1F]">
                      100% Chai
                    </div>
                    <div className="font-doodle-label text-sm font-bold text-[#141414]">Playful Fuel</div>
                    <div className="font-doodle-body text-xs text-stone-600">Curiosity & Tea</div>
                  </div>
                </div>

                {/* Hobbies as Dashed Pill Chips */}
                <div className="space-y-2.5 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="font-doodle-label text-xl text-[#141414] font-bold">
                      Off the clock, you'll find me:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.passions.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 bg-white text-[#141414] text-sm font-bold rounded-xl border-2 border-dashed border-[#141414] shadow-[2px_2px_0px_0px_#F26A1F] flex items-center gap-1.5 hover:bg-[#FFE9DC] transition-colors"
                      >
                        <span className="text-[#F26A1F]">✦</span>
                        <span>{p}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section Curving Paper Plane Divider (Flipped) */}
          <SectionCurvedPlaneDivider flip />

          {/* ----------------------------------------------------
              SECTION 3: SKILLS ("What I do & love doing")
              - Text LEFT, 2-column grid of hand-drawn cards RIGHT
              - Hand-drawn cards with matching flat line icons & tiny tilt
             ---------------------------------------------------- */}
          <section id="skills" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col items-start">
              <span className="font-doodle-label text-xl text-[#F26A1F] font-bold">
                Core Craft
              </span>
              <h2 className="font-doodle-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#141414] tracking-tight">
                What I do & <span className="text-[#F26A1F]">love doing</span>
              </h2>
              <SquiggleUnderline color="#F26A1F" className="mt-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: 3D Spatial */}
              <div className="doodle-card bg-white p-6 rounded-2xl border-2 border-[#141414] shadow-[4px_4px_0px_0px_#141414] rotate-[0.5deg] hover:rotate-0 transition-transform space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🌐</span>
                  <span className="font-doodle-label text-xs font-bold px-3 py-1 bg-[#FFE9DC] rounded-full border border-[#141414]">
                    Interactive 3D
                  </span>
                </div>
                <h3 className="font-doodle-heading text-2xl font-black text-[#141414]">
                  3D Spatial & WebGL Worlds
                </h3>
                <p className="font-doodle-body text-base text-stone-700 leading-relaxed">
                  Crafting interactive diorama globes, virtual hallway galleries, custom GLSL shaders, lighting systems, and butter-smooth Three.js camera choreographies.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['Three.js', 'React Three Fiber', 'GLSL', 'WebGL', 'Canvas'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 bg-[#FDFBF7] text-[#141414] text-xs font-bold rounded-md border border-[#141414]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 2: Full-Stack Engineering */}
              <div className="doodle-card bg-white p-6 rounded-2xl border-2 border-[#141414] shadow-[4px_4px_0px_0px_#141414] -rotate-[0.5deg] hover:rotate-0 transition-transform space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">⚙️</span>
                  <span className="font-doodle-label text-xs font-bold px-3 py-1 bg-[#FFE9DC] rounded-full border border-[#141414]">
                    Architecture
                  </span>
                </div>
                <h3 className="font-doodle-heading text-2xl font-black text-[#141414]">
                  Full-Stack Web Engineering
                </h3>
                <p className="font-doodle-body text-base text-stone-700 leading-relaxed">
                  Building production-grade client & server architectures, RESTful backend APIs, state stores, secure authentication, and resilient full-stack systems.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['React 19', 'TypeScript', 'Node.js', 'Express', 'Postman'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 bg-[#FDFBF7] text-[#141414] text-xs font-bold rounded-md border border-[#141414]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 3: UI/UX & Motion Design */}
              <div className="doodle-card bg-white p-6 rounded-2xl border-2 border-[#141414] shadow-[4px_4px_0px_0px_#141414] -rotate-[0.5deg] hover:rotate-0 transition-transform space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🎨</span>
                  <span className="font-doodle-label text-xs font-bold px-3 py-1 bg-[#FFE9DC] rounded-full border border-[#141414]">
                    Aesthetics
                  </span>
                </div>
                <h3 className="font-doodle-heading text-2xl font-black text-[#141414]">
                  Hand-Drawn & Motion UI/UX
                </h3>
                <p className="font-doodle-body text-base text-stone-700 leading-relaxed">
                  Sculpting high-delight interfaces, playful micro-interactions, custom SVGs, fluid layout transitions, and responsive hand-drawn design systems.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['TailwindCSS', 'Framer Motion', 'Figma', 'SVG Art', 'Design Systems'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 bg-[#FDFBF7] text-[#141414] text-xs font-bold rounded-md border border-[#141414]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 4: Generative AI & Spatial UX */}
              <div className="doodle-card bg-white p-6 rounded-2xl border-2 border-[#141414] shadow-[4px_4px_0px_0px_#141414] rotate-[0.5deg] hover:rotate-0 transition-transform space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">✨</span>
                  <span className="font-doodle-label text-xs font-bold px-3 py-1 bg-[#FFE9DC] rounded-full border border-[#141414]">
                    Next-Gen
                  </span>
                </div>
                <h3 className="font-doodle-heading text-2xl font-black text-[#141414]">
                  AI & Agentic Workflows
                </h3>
                <p className="font-doodle-body text-base text-stone-700 leading-relaxed">
                  Integrating intelligent developer assistants, automated pipelines, conversational agents, and generative assets into delightful user journeys.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {['Antigravity', 'Python', 'Prompt Craft', 'Automation', 'MCP'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 bg-[#FDFBF7] text-[#141414] text-xs font-bold rounded-md border border-[#141414]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section Curving Paper Plane Divider */}
          <SectionCurvedPlaneDivider />

          {/* ----------------------------------------------------
              SECTION 4: TOOLS ("Tools I'm fluent in")
              - Doodle LEFT (Juggling girl), Tools badges RIGHT
              - Round black badges with orange two-letter initials
                (Ps, Ai, Ae, Id, Ts, Py, Re, Fm, 3D, Gl…) gently bobbing
             ---------------------------------------------------- */}
          <section id="tools" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col items-start">
              <span className="font-doodle-label text-xl text-[#F26A1F] font-bold">
                Technical Arsenal
              </span>
              <h2 className="font-doodle-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#141414] tracking-tight">
                Tools I'm <span className="text-[#F26A1F]">fluent in</span>
              </h2>
              <SquiggleUnderline color="#F26A1F" className="mt-1" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Illustrated Juggling Girl LEFT */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-xs">
                  <JugglingGirlIllustration />
                </div>
              </div>

              {/* Round Black Badges with Orange Two-Letter Initials RIGHT */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-5">
                  {[
                    { initial: 'Ts', name: 'TypeScript', delay: '0s' },
                    { initial: 'Re', name: 'React', delay: '0.2s' },
                    { initial: '3D', name: 'Three.js', delay: '0.4s' },
                    { initial: 'Py', name: 'Python', delay: '0.1s' },
                    { initial: 'Fm', name: 'Motion', delay: '0.3s' },
                    { initial: 'Gl', name: 'WebGL', delay: '0.5s' },
                    { initial: 'Nd', name: 'Node.js', delay: '0.25s' },
                    { initial: 'Tw', name: 'Tailwind', delay: '0.45s' },
                    { initial: 'Fg', name: 'Figma', delay: '0.15s' },
                    { initial: 'Ps', name: 'Photoshop', delay: '0.35s' },
                    { initial: 'Ai', name: 'Illustrator', delay: '0.55s' },
                    { initial: 'Git', name: 'GitHub', delay: '0.2s' },
                  ].map((tool, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center space-y-1.5 group cursor-default"
                      style={{ animationDelay: tool.delay }}
                    >
                      {/* Round Black Badge with Orange Two-Letter Initials */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#141414] text-[#F26A1F] border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] group-hover:shadow-[4px_4px_0px_0px_#F26A1F] group-hover:-translate-y-1 transition-all flex items-center justify-center font-doodle-heading text-2xl font-black select-none">
                        {tool.initial}
                      </div>
                      <span className="font-doodle-body text-sm font-bold text-[#141414] group-hover:text-[#F26A1F] transition-colors">
                        {tool.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section Curving Paper Plane Divider (Flipped) */}
          <SectionCurvedPlaneDivider flip />

          {/* ----------------------------------------------------
              SECTION 5: EXPERIENCE ("Where my pencil has been")
              - Intro text LEFT, timeline with squiggly dashed line
              - Job cards with number badge, role, orange dates,
                pushpins, and tilted polaroid style
             ---------------------------------------------------- */}
          <section id="experience" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col items-start">
              <span className="font-doodle-label text-xl text-[#F26A1F] font-bold">
                Career Milestones
              </span>
              <h2 className="font-doodle-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#141414] tracking-tight">
                Where my <span className="text-[#F26A1F]">pencil has been</span>
              </h2>
              <SquiggleUnderline color="#F26A1F" className="mt-1" />
            </div>

            <div className="space-y-8">
              {profile.experience.map((exp, eIdx) => (
                <div
                  key={eIdx}
                  className="relative bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#141414] shadow-[4px_4px_0px_0px_#141414] space-y-4 pt-9"
                >
                  {/* Push Pin at Top Left */}
                  <div className="absolute -top-3.5 left-8">
                    <PushPinDoodle color={eIdx % 2 === 0 ? '#F26A1F' : '#ef4444'} />
                  </div>

                  {/* Washi Tape Accent at Top Center */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#FFE9DC] border border-[#141414] rounded-xs rotate-[-1deg] flex items-center justify-center pointer-events-none">
                    <span className="font-doodle-label text-[10px] font-bold text-[#141414]">
                      MILESTONE #{eIdx + 1}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-dashed border-stone-200 pb-3">
                    <div>
                      <h3 className="font-doodle-heading text-2xl font-black text-[#141414]">
                        {exp.role}
                      </h3>
                      <p className="font-doodle-label text-lg font-bold text-[#F26A1F]">
                        {exp.company}
                      </p>
                    </div>
                    <span className="font-doodle-body text-sm font-bold text-[#141414] bg-[#FFE9DC] px-3.5 py-1 rounded-full border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414] w-fit">
                      {exp.period}
                    </span>
                  </div>

                  <p className="font-doodle-body text-base text-stone-700 leading-relaxed">
                    {exp.description}
                  </p>

                  <ul className="space-y-1.5 font-doodle-body text-sm text-stone-700">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-[#F26A1F] font-black">✔</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section Curving Paper Plane Divider */}
          <SectionCurvedPlaneDivider />

          {/* ----------------------------------------------------
              SECTION 6: FEATURED PROJECTS
             ---------------------------------------------------- */}
          <section id="projects" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col items-start">
              <span className="font-doodle-label text-xl text-[#F26A1F] font-bold">
                Portfolio
              </span>
              <h2 className="font-doodle-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#141414] tracking-tight">
                Featured <span className="text-[#F26A1F]">Projects</span>
              </h2>
              <SquiggleUnderline color="#F26A1F" className="mt-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayProjects.map((prj: ProjectItem, pIdx: number) => (
                <div
                  key={prj.id || pIdx}
                  className="doodle-card bg-white rounded-3xl p-6 border-2 border-[#141414] shadow-[4px_4px_0px_0px_#141414] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-0.5 bg-[#FFE9DC] text-[#141414] text-xs font-bold rounded-lg border border-[#141414]">
                        {prj.category}
                      </span>
                      <span className="font-doodle-body text-xs font-bold text-stone-500">
                        {prj.year}
                      </span>
                    </div>

                    <h3 className="font-doodle-heading text-2xl font-black text-[#141414]">
                      {prj.title}
                    </h3>
                    <p className="font-doodle-body text-base text-stone-700 leading-relaxed">
                      {prj.tagline || prj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prj.technologies.map((tech: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 bg-[#FDFBF7] text-[#141414] text-xs font-bold rounded-md border border-[#141414]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t-2 border-dashed border-stone-200 pt-3 flex items-center justify-between text-xs">
                    <span className="font-doodle-body text-sm font-bold text-[#F26A1F]">
                      ⚡ {prj.metrics}
                    </span>
                    <div className="flex items-center gap-2">
                      {prj.links?.github && (
                        <a
                          href={prj.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doodle-btn-black px-3 py-1 bg-stone-100 hover:bg-stone-200 text-[#141414] rounded-lg font-bold text-xs"
                        >
                          Code
                        </a>
                      )}
                      {prj.links?.live && (
                        <a
                          href={prj.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doodle-btn-orange px-3 py-1 bg-[#F26A1F] hover:bg-[#ff7a2f] text-white rounded-lg font-bold text-xs"
                        >
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section Curving Paper Plane Divider (Flipped) */}
          <SectionCurvedPlaneDivider flip />

          {/* ----------------------------------------------------
              SECTION 7: CERTIFICATES & ACHIEVEMENTS
              - 5 verified real certificates with Door links
             ---------------------------------------------------- */}
          <section id="certificates" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col items-start">
              <span className="font-doodle-label text-xl text-[#F26A1F] font-bold">
                Credentials
              </span>
              <h2 className="font-doodle-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#141414] tracking-tight">
                Verified <span className="text-[#F26A1F]">Honors</span> & Hallway Doors
              </h2>
              <SquiggleUnderline color="#F26A1F" className="mt-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayCertificates.map((cert, cIdx) => (
                <div
                  key={cert.id || cIdx}
                  className="doodle-card bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#141414] shadow-[4px_4px_0px_0px_#141414] hover:-translate-y-1 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    {/* Certificate Thumbnail */}
                    {cert.imageUrl && (
                      <div className="relative rounded-xl overflow-hidden border-2 border-[#141414] bg-stone-100 aspect-[16/11] group/thumb shadow-xs">
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 bg-[#141414] text-[#F26A1F] font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20">
                          Door #{cert.doorNumber || 101 + cIdx}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{cert.badgeIcon || '📜'}</span>
                      <span className="font-doodle-body text-xs text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-400 font-bold">
                        {cert.gradeScore || 'Verified'}
                      </span>
                    </div>

                    <h4 className="font-doodle-heading text-xl font-black text-[#141414] leading-snug">
                      {cert.title}
                    </h4>
                    <p className="font-doodle-label text-sm text-[#F26A1F] font-bold">
                      {cert.issuer}
                    </p>
                    <p className="font-doodle-body text-sm text-stone-700 line-clamp-2">
                      {cert.description}
                    </p>
                  </div>

                  <div className="border-t-2 border-dashed border-stone-200 pt-3 flex items-center justify-between text-xs font-bold text-stone-500">
                    <span>{cert.issueDate}</span>
                    <a
                      href={`/certificates/${cert.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        window.history.pushState(
                          { path: `/certificates/${cert.id}` },
                          '',
                          `/certificates/${cert.id}`
                        );
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }}
                      className="doodle-btn-orange text-[#141414] hover:text-white font-black flex items-center gap-1 cursor-pointer bg-[#F26A1F] px-2.5 py-1 rounded-xl border-2 border-[#141414] transition-all text-xs"
                    >
                      Door #{cert.doorNumber || 101 + cIdx} 🚪
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section Curving Paper Plane Divider */}
          <SectionCurvedPlaneDivider />

          {/* ----------------------------------------------------
              SECTION 8: CONTACT
              - "Let's draw something together!"
              - 3 hand-drawn cards (Email, Availability, Location)
              - Action buttons: "Send an Email", "Copy Email"
             ---------------------------------------------------- */}
          <section id="contact" className="space-y-8 scroll-mt-24 text-center">
            <div className="flex flex-col items-center">
              <span className="font-doodle-label text-xl text-[#F26A1F] font-bold">
                Get In Touch
              </span>
              <h2 className="font-doodle-heading text-4xl sm:text-5xl md:text-6xl font-black text-[#141414] tracking-tight">
                Let's <span className="text-[#F26A1F]">draw something</span> together!
              </h2>
              <SquiggleUnderline color="#F26A1F" className="mt-2" />
              <p className="font-doodle-body text-lg text-stone-700 max-w-xl mx-auto mt-4">
                Have an ambitious idea, spatial computing project, or creative challenge? Let's connect and build something extraordinary.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-white p-5 rounded-2xl border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] space-y-1">
                <div className="text-2xl">✉️</div>
                <div className="font-doodle-heading text-lg font-black text-[#141414]">Email</div>
                <div className="font-doodle-body text-sm font-bold text-[#F26A1F] break-all">
                  roopadeva48@gmail.com
                </div>
              </div>

              <div className="bg-[#FFE9DC] p-5 rounded-2xl border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] space-y-1">
                <div className="text-2xl">🚀</div>
                <div className="font-doodle-heading text-lg font-black text-[#141414]">Status</div>
                <div className="font-doodle-body text-sm font-bold text-[#141414]">
                  Open for Select Projects
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-[#141414] shadow-[3px_3px_0px_0px_#141414] space-y-1">
                <div className="text-2xl">📍</div>
                <div className="font-doodle-heading text-lg font-black text-[#141414]">Location</div>
                <div className="font-doodle-body text-sm font-bold text-stone-700">
                  Bengaluru · Worldwide Remote
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleEmailClick}
                className="doodle-btn-orange px-8 py-3.5 bg-[#F26A1F] hover:bg-[#ff7a2f] text-white rounded-2xl text-lg font-black cursor-pointer flex items-center gap-2"
              >
                <span>Send an Email</span>
                <span>✏️</span>
              </button>

              <button
                onClick={handleCopyEmail}
                className="doodle-btn-black px-6 py-3.5 bg-white hover:bg-[#FFE9DC] text-[#141414] rounded-2xl text-base font-bold cursor-pointer flex items-center gap-2"
              >
                <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Email'}</span>
                <span>📋</span>
              </button>
            </div>
          </section>
        </main>

        {/* ========================================================
            9. FOOTER
            - Black bar with logo and one-line credit
           ======================================================== */}
        <footer className="mt-20 bg-[#141414] text-white border-t-2 border-[#141414] py-8 px-4 text-center">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-doodle-heading text-2xl font-black flex items-baseline">
              <span>Deva</span>
              <span className="text-[#F26A1F] text-3xl leading-none">.</span>
            </div>
            <p className="font-doodle-body text-sm text-stone-300">
              Crafted with ♡ & sketchbook ink by Devaroopa · Flat 2D Hand-Drawn Doodle Portfolio
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/roopadeva48-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-[#F26A1F] transition-colors text-sm font-bold"
              >
                GitHub ↗
              </a>
              <span className="text-stone-600">·</span>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="text-stone-300 hover:text-[#F26A1F] transition-colors text-sm font-bold cursor-pointer"
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
