import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileData } from '../../types';
import { sound } from '../../utils/audio';
import { sendContactMessage } from '../../services/api';
import confetti from 'canvas-confetti';

interface ProfileShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData | null;
  onNavigateToProjects: () => void;
  onOpenContact: () => void;
}

// Interactive 3D Card Frame with Mouse-Tracking Perspective Tilt & Specular Light Sheen
const Interactive3DPhotoFrame: React.FC<{
  avatar: string;
  name: string;
}> = ({ avatar, name }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // tilt -12 to +12 deg
    const rotateY = ((x - centerX) / centerX) * 12;

    setCoords({
      rotateX,
      rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.45,
    });
  };

  const handleMouseLeave = () => {
    setCoords({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
    });
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative shrink-0 flex justify-center items-center py-3 select-none"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: coords.rotateX,
          rotateY: coords.rotateY,
          scale: coords.glareOpacity > 0 ? 1.025 : 1,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, mass: 0.8 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-72 sm:w-80 md:w-[340px] rounded-3xl p-3.5 bg-gradient-to-b from-white via-slate-100 to-slate-200/95 shadow-[0_30px_70px_-20px_rgba(15,23,42,0.35),0_15px_30px_-10px_rgba(15,23,42,0.2),0_0_0_1px_rgba(255,255,255,0.9)] border-2 border-white/90 ring-1 ring-slate-900/10 cursor-pointer group"
      >
        {/* Physical 3D Beveled Frame Inset */}
        <div
          style={{ transform: 'translateZ(26px)' }}
          className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border-2 border-slate-900"
        >
          {/* Main Photo in Bigger, Clear Format */}
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Dynamic Interactive 3D Specular Light Glare */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 mix-blend-overlay"
            style={{
              background: `radial-gradient(circle at ${coords.glareX}% ${coords.glareY}%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 65%)`,
              opacity: coords.glareOpacity,
            }}
          />

          {/* Ambient Film Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-white/10" />

          {/* High-Tech Holographic Grid / Corner Brackets */}
          <div className="pointer-events-none absolute inset-2.5 border border-white/20 rounded-xl" />
          <div className="pointer-events-none absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
          <div className="pointer-events-none absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
          <div className="pointer-events-none absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
          <div className="pointer-events-none absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

          {/* 3D Depth Card Footer Tag */}
          <div
            style={{ transform: 'translateZ(34px)' }}
            className="absolute bottom-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none"
          >
            <span className="px-3 py-1 bg-black/75 backdrop-blur-md rounded-lg text-[10px] font-mono font-bold text-amber-300 border border-white/20 shadow-md">
              PORTFOLIO ARCHITECT
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/90 backdrop-blur-md rounded-lg text-[10px] font-mono font-bold text-white shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              AVAILABLE
            </span>
          </div>
        </div>

        {/* 3D Floating Elevated Badge */}
        <div
          style={{ transform: 'translateZ(50px)' }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-xs font-mono font-black px-4 py-1.5 rounded-xl border-2 border-slate-950 shadow-[0_10px_20px_rgba(0,0,0,0.25)] flex items-center gap-2 whitespace-nowrap"
        >
          <span>👩‍💻</span>
          <span>GLOBE PILOT · DEVAROOPA</span>
          <span className="text-[10px] bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded font-bold">
            3D
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export const ProfileShowcase: React.FC<ProfileShowcaseProps> = ({
  isOpen,
  onClose,
  profile,
  onNavigateToProjects,
  onOpenContact,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'skills' | 'timeline'>('about');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Embedded contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [contactErr, setContactErr] = useState('');

  if (!isOpen || !profile) return null;

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText('roopadeva48@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      setContactErr('Please fill in your name, email, and message.');
      return;
    }
    try {
      setIsSending(true);
      setContactErr('');
      await sendContactMessage({
        name: contactName,
        email: contactEmail,
        subject: contactSubject,
        message: contactMsg,
      });
      sound.playChime();
      setSentSuccess(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#38bdf8', '#facc15'],
      });
      setTimeout(() => {
        setContactName('');
        setContactEmail('');
        setContactSubject('');
        setContactMsg('');
        setSentSuccess(false);
      }, 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message';
      setContactErr(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 bg-white text-slate-900 overflow-y-auto flex flex-col selection:bg-teal-500 selection:text-white"
      >
        {/* 1. Sticky Navigation Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs w-full">
          <div className="w-full px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
            {/* Left End: Back to 3D Globe */}
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-bold transition-all hover:-translate-x-0.5 cursor-pointer border border-slate-200"
            >
              <span>←</span>
              <span>Back to 3D Globe</span>
              <span className="text-sm">🌍</span>
            </button>

            {/* Right End: Action */}
            <div className="flex items-center gap-2">
              <a
                href="#contact-section"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </header>

        {/* 2. Open Seamless Page Layout (NO CONTAINERS) */}
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-14">
          {/* Hero Profile Showcase (Open Layout with Bigger 3D Photo Card) */}
          <section className="relative flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-14 pt-2">
            {/* Bigger 3D Framed Card */}
            <Interactive3DPhotoFrame avatar={profile.avatar} name={profile.name} />

            {/* Bio, Typography & Actions (Seamlessly open, no container) */}
            <div className="flex-1 space-y-5 text-center lg:text-left">
              {/* Name & Availability Status */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950">
                    {profile.name}
                  </h1>
                  <span className="text-xs text-slate-500 font-mono px-2.5 py-0.5 bg-slate-100 rounded-full border border-slate-200">
                    {profile.pronouns || 'she/her'}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ● Available for Projects
                  </span>
                </div>

                <p className="text-lg sm:text-xl font-bold text-teal-800">
                  {profile.title}
                </p>
              </div>

              {/* Main Headline & Location */}
              <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {profile.headline}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  📍 {profile.location}
                </span>
                <span>·</span>
                <span className="font-semibold text-slate-800">
                  WebGL, Spatial Three.js & Creative Engineering
                </span>
              </div>

              {/* Action Buttons & Socials */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
                <button
                  onClick={handleCopyEmail}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>✉</span>
                  <span>{copiedEmail ? 'Copied to Clipboard!' : 'roopadeva48@gmail.com'}</span>
                </button>
                {profile.socials?.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors border border-slate-200"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Section Navigation Tabs (Seamless Minimalist Bar, No Boxed Container) */}
          <div className="border-b border-slate-200/90 pb-3 flex items-center justify-center sm:justify-start gap-4 sm:gap-8 overflow-x-auto">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('about');
              }}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'about'
                  ? 'text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              Story & Bio
              {activeTab === 'about' && (
                <motion.div
                  layoutId="tabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('skills');
              }}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'skills'
                  ? 'text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              Tech Stack & Capabilities
              {activeTab === 'skills' && (
                <motion.div
                  layoutId="tabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('timeline');
              }}
              className={`pb-2 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'timeline'
                  ? 'text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              Experience & Milestones
              {activeTab === 'timeline' && (
                <motion.div
                  layoutId="tabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 rounded-full"
                />
              )}
            </button>
          </div>

          {/* Tab 1: Story & Bio (Open Editorial Layout, No Container Box) */}
          {activeTab === 'about' && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2">
                  <span>📖</span>
                  <span>The Creative Journey</span>
                </h2>
                <div className="space-y-4 text-base text-slate-700 leading-relaxed max-w-3xl">
                  <p className="text-slate-950 font-medium text-lg leading-relaxed">
                    {profile.bio}
                  </p>
                  {profile.extendedBio.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Curiosities & Passions */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                  Curiosities & Core Passions
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {profile.passions.map((p, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                    >
                      ✦ {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education Foundation */}
              {profile.education && profile.education.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                    Academic Foundation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                    {profile.education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-950">{edu.degree}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{edu.institution}</div>
                        </div>
                        <div className="text-xs font-mono text-slate-400 mt-2">{edu.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          )}

          {/* Tab 2: Tech Stack (Open Grid Layout, No Container Box) */}
          {activeTab === 'skills' && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2 mb-1">
                  <span>⚡</span>
                  <span>Technical Arsenal & Tooling</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Comprehensive breakdown of core engineering, 3D WebGL graphics, and frontend architectural skills.
                </p>
              </div>

              <div className="space-y-8">
                {profile.skills.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-3">
                    <h3 className="text-xs font-mono font-bold tracking-wider text-teal-800 uppercase flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      <span>{group.category}</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {group.items.map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 bg-slate-50 hover:bg-slate-100/90 rounded-2xl border border-slate-200/80 flex flex-col justify-between transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-900">{skill.name}</span>
                            <span className="text-xs font-mono font-semibold text-slate-500">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-950 rounded-full transition-all duration-700"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Tab 3: Timeline (Open Timeline, No Container Box) */}
          {activeTab === 'timeline' && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2 mb-1">
                  <span>💼</span>
                  <span>Career & Production Experience</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Milestones architecting web applications, spatial systems, and interactive productions.
                </p>
              </div>

              <div className="relative border-l-2 border-slate-200 pl-6 sm:pl-8 space-y-8 ml-2">
                {profile.experience.map((exp, eIdx) => (
                  <div key={eIdx} className="relative group">
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 ring-4 ring-white shadow-sm" />
                    <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-base font-bold text-slate-950">{exp.role}</h4>
                        <span className="text-xs font-mono font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 w-fit">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-teal-800">{exp.company}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 pt-1">
                        {exp.highlights.map((h, hIdx) => (
                          <li key={hIdx}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Contact Section (Open Design, No Dark Box Container) */}
          <section id="contact-section" className="pt-8 border-t border-slate-200/90 space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <span className="text-xs font-mono font-bold tracking-widest text-teal-700 uppercase">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Let's Build Something Memorable
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                Have an ambitious project, creative engagement, or 3D interactive concept? Send a message directly to devaroopa.
              </p>
            </div>

            {sentSuccess ? (
              <div className="py-8 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200 p-6 max-w-2xl">
                <div className="text-3xl">🎉</div>
                <h3 className="text-lg font-bold text-emerald-800">Message Received!</h3>
                <p className="text-xs text-slate-600">
                  Thank you for reaching out. devaroopa will get back to you shortly at {contactEmail}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-4 max-w-2xl">
                {contactErr && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                    {contactErr}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Subject / Inquiry</label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g. 3D WebGL Portfolio or Creative Project"
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Tell me about your idea, timeline, or requirements..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-3 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <span>Send Message 🚀</span>
                  )}
                </button>
              </form>
            )}
          </section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
