import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileData } from '../../types';
import { sound } from '../../utils/audio';
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
  const [activeTab, setActiveTab] = useState<'about' | 'skills' | 'timeline'>('about');
  const [copiedEmail, setCopiedEmail] = useState(false);

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
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#47c7ac', '#facc15', '#ec4899', '#22c55e'],
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 my-auto flex flex-col max-h-[90vh]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>ROOPA DEVA</span>
              <span aria-hidden="true">·</span>
              <span>CREATIVE PROFILE</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-700 font-medium">{profile.status}</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Close Profile (Esc)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto px-6 py-6 sm:px-8 space-y-8">
            {/* Hero Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-900 shadow-md">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-900 shadow-sm">
                  GLOBE PILOT
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {profile.name}
                  </h1>
                  <span className="text-xs text-slate-500 font-mono">({profile.pronouns})</span>
                </div>
                <p className="text-sm font-medium text-teal-800">
                  {profile.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{profile.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>WebGL & Spatial Systems</span>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={handleCelebrate}
                    className="text-amber-600 hover:text-amber-700 font-medium underline"
                  >
                    Send Sparks ✨
                  </button>
                </div>
              </div>

              {/* Direct CTA Buttons */}
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenContact();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all text-center"
                >
                  Contact Me
                </button>
                <button
                  onClick={() => {
                    sound.playZoom();
                    onClose();
                    onNavigateToProjects();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-semibold rounded-lg border border-teal-200 transition-all text-center"
                >
                  Explore Works →
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              {profile.stats.map((st, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                    {st.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-0.5">
                    {st.label}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-tight">
                    {st.description}
                  </div>
                </div>
              ))}
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-sm">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('about');
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
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
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'skills'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tech Stack
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('timeline');
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'timeline'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Experience
              </button>
            </div>

            {/* Tab 1: Story & Bio */}
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                  <p className="text-base text-slate-800 font-medium">
                    {profile.headline}
                  </p>
                  {profile.extendedBio.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Passions list */}
                <div className="pt-2">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-3">
                    Curiosities & Passions
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                    {profile.passions.map((p, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200/60 font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors"
                  >
                    <span>✉ {copiedEmail ? 'Copied to Clipboard!' : 'roopadeva48@gmail.com'}</span>
                  </button>
                  {profile.socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
                    >
                      {s.platform} ({s.handle})
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tab 2: Skills */}
            {activeTab === 'skills' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {profile.skills.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-3">
                    <h3 className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase">
                      {group.category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {group.items.map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-800">
                              {skill.name}
                            </span>
                            <span className="text-xs font-mono text-slate-500">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-800 rounded-full transition-all duration-700"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Tab 3: Timeline */}
            {activeTab === 'timeline' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="relative border-l border-slate-200 pl-4 space-y-6">
                  {profile.experience.map((exp, eIdx) => (
                    <div key={eIdx} className="relative group">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-white" />
                      <div className="space-y-1">
                        <div className="flex items-baseline justify-between">
                          <h4 className="text-sm font-bold text-slate-900">
                            {exp.role}
                          </h4>
                          <span className="text-xs font-mono text-slate-500">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-teal-800">
                          {exp.company}
                        </p>
                        <p className="text-xs text-slate-600 pt-1">
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
              </motion.div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60">
            <span className="text-xs text-slate-400 font-mono">
              Designed & Built with Three.js, React 19 & Framer Motion
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Back to Globe Orbit
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
