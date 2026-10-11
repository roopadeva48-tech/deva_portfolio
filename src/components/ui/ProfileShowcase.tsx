import React, { useState } from 'react';
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

export const ProfileShowcase: React.FC<ProfileShowcaseProps> = ({
  isOpen,
  onClose,
  profile,
  onNavigateToProjects,
  onOpenContact,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'skills' | 'timeline' | 'projects'>('about');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Embedded contact form state on the page
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

  const handleCelebrate = () => {
    sound.playChime();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.4 },
      colors: ['#0284c7', '#38bdf8', '#facc15', '#ec4899', '#22c55e'],
    });
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 bg-slate-50 text-slate-900 overflow-y-auto flex flex-col selection:bg-teal-500 selection:text-white"
      >
        {/* 1. Sticky Navigation Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs w-full">
          <div className="w-full px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
            {/* Left: Back to 3D Globe Action */}
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

            {/* Right: Actions */}
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

        {/* 2. Main Page Container */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12">
          {/* Hero Profile Banner */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-100/50 via-sky-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Profile Avatar with Girl on Suitcase Badge */}
              <div className="relative group shrink-0">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-3 border-slate-900 shadow-lg bg-slate-100">
                  <img
                    src={profile.avatar}
                    alt="devaroopa"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-mono font-extrabold px-3 py-0.5 rounded-full border border-slate-950 shadow-sm whitespace-nowrap">
                  GLOBE PILOT 👩‍💻
                </div>
              </div>

              {/* Bio & Details */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                    devaroopa
                  </h1>
                  <span className="text-xs text-slate-500 font-mono px-2.5 py-0.5 bg-slate-100 rounded-full border border-slate-200">
                    {profile.pronouns || 'she/her'}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ● Available for Projects
                  </span>
                </div>

                <p className="text-base sm:text-lg font-semibold text-teal-800">
                  {profile.title}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {profile.headline}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    📍 {profile.location}
                  </span>
                  <span>·</span>
                  <span className="font-medium text-slate-700">
                    WebGL, Spatial Three.js & Creative Engineering
                  </span>
                </div>

                {/* Quick Action Badges */}
                <div className="flex flex-wrap items-center gap-2.5 pt-3">
                  <button
                    onClick={handleCopyEmail}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
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
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-xl transition-colors border border-slate-200"
                    >
                      {s.platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 backdrop-blur rounded-2xl w-fit mx-auto border border-slate-300/60">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('about');
              }}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Story & Bio
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('skills');
              }}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tech Stack & Capabilities
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('timeline');
              }}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Experience & Milestones
            </button>
          </div>

          {/* Tab 1: Story & Bio */}
          {activeTab === 'about' && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>📖</span>
                  <span>The Creative Journey</span>
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
                  <p className="text-slate-800 font-medium text-lg leading-relaxed">
                    {profile.bio}
                  </p>
                  {profile.extendedBio.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Passions and Pillars */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-4">
                  Curiosities & Core Passions
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {profile.passions.map((p, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200/80 transition-colors"
                    >
                      ✦ {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              {profile.education && profile.education.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-4">
                    Academic Foundation
                  </h3>
                  <div className="space-y-2">
                    {profile.education.map((edu, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{edu.degree}</div>
                          <div className="text-xs text-slate-500">{edu.institution}</div>
                        </div>
                        <div className="text-xs font-mono text-slate-500 mt-1 sm:mt-0">{edu.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          )}

          {/* Tab 2: Tech Stack */}
          {activeTab === 'skills' && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span>⚡</span>
                  <span>Technical Arsenal & Tooling</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Comprehensive breakdown of core engineering, 3D WebGL graphics, and frontend architectural skills.
                </p>
              </div>

              <div className="space-y-8">
                {profile.skills.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-4">
                    <h3 className="text-xs font-mono font-bold tracking-wider text-teal-800 uppercase flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      <span>{group.category}</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      {group.items.map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-bold text-slate-900">
                              {skill.name}
                            </span>
                            <span className="text-xs font-mono font-semibold text-slate-500">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-900 rounded-full transition-all duration-700"
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

          {/* Tab 3: Timeline */}
          {activeTab === 'timeline' && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span>💼</span>
                  <span>Career & Production Experience</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Milestones architecting web applications, spatial systems, and interactive productions.
                </p>
              </div>

              <div className="relative border-l-2 border-slate-200 pl-6 sm:pl-8 space-y-8 ml-2 sm:ml-4">
                {profile.experience.map((exp, eIdx) => (
                  <div key={eIdx} className="relative group">
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-900 ring-4 ring-white shadow-sm" />
                    <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-base font-bold text-slate-900">
                          {exp.role}
                        </h4>
                        <span className="text-xs font-mono font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 w-fit">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-teal-800">
                        {exp.company}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {exp.description}
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 pt-2">
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

          {/* Contact Section right on the page */}
          <section id="contact-section" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                  GET IN TOUCH
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Let's Build Something Memorable
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  Have an ambitious project, creative engagement, or 3D interactive concept? Send a message directly to devaroopa.
                </p>
              </div>

              {sentSuccess ? (
                <div className="py-8 text-center space-y-2 bg-slate-800/80 rounded-2xl border border-emerald-500/40 p-6">
                  <div className="text-3xl">🎉</div>
                  <h3 className="text-lg font-bold text-emerald-400">Message Received!</h3>
                  <p className="text-xs text-slate-300">
                    Thank you for reaching out. devaroopa will get back to you shortly at {contactEmail}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendContact} className="space-y-4 bg-slate-800/60 p-5 sm:p-7 rounded-2xl border border-slate-700/60">
                  {contactErr && (
                    <div className="p-3 bg-rose-500/20 text-rose-300 text-xs rounded-xl border border-rose-500/40">
                      {contactErr}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Alex River"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Project / Subject</label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="e.g. 3D Web App / Interactive Experience"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Tell me about your goals, timelines, or questions..."
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    {isSending ? 'Sending Transmission...' : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* Page Footer */}
          <footer className="pt-6 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">devaroopa</span>
              <span>·</span>
              <span>Designed & Built with Three.js, React 19 & Framer Motion</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl border border-slate-200 transition-all cursor-pointer shadow-xs"
            >
              <span>← Return to 3D Globe Orbit</span>
              <span>🌍</span>
            </button>
          </footer>
        </main>
      </motion.div>
    </AnimatePresence>
  );
};
