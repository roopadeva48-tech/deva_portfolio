import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileData, ProjectItem, CertificateItem } from '../../types';
import { sound } from '../../utils/audio';
import { sendContactMessage, fallbackProjects, fallbackCertificates } from '../../services/api';
import confetti from 'canvas-confetti';
import {
  WritingGirlCharacter,
  BeanbagGirlIllustration,
  JugglingGirlIllustration,
} from './illustrated/GirlIllustrations';
import {
  PaperPlaneDoodle,
  ScissorsDoodle,
  LightbulbDoodle,
  SquigglyArrowDoodle,
  PushPinDoodle,
  ArtisticDevaTitle,
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

export const ProfileShowcase: React.FC<ProfileShowcaseProps> = ({
  isOpen,
  onClose,
  profile,
  projects = [],
  certificates = [],
}) => {
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

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;
  const displayCertificates = certificates.length > 0 ? certificates : fallbackCertificates;

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
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ea580c', '#f59e0b', '#38bdf8', '#fb7185'],
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 bg-[#fdfbf7] text-[#1e293b] overflow-y-auto flex flex-col selection:bg-amber-400 selection:text-slate-900"
      >
        {/* ========================================================
            1. STICKY HEADER (PRESERVED "Back to 3D Globe" on Far-Left)
           ======================================================== */}
        <header className="sticky top-0 z-50 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-amber-200/50 shadow-xs w-full">
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

            {/* Quick Section Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
              <a href="#about" className="hover:text-amber-600 transition-colors">
                About
              </a>
              <a href="#skills" className="hover:text-amber-600 transition-colors">
                Skills
              </a>
              <a href="#experience" className="hover:text-amber-600 transition-colors">
                Experience
              </a>
              <a href="#projects" className="hover:text-amber-600 transition-colors">
                Projects
              </a>
              <a href="#certificates" className="hover:text-amber-600 transition-colors">
                Certificates
              </a>
              <a href="#contact" className="hover:text-amber-600 transition-colors">
                Contact
              </a>
            </nav>

            {/* Right End: Get in Touch Action */}
            <div className="flex items-center gap-2">
              <a
                href="#contact"
                className="px-4 py-2 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </header>

        {/* Ambient Decorative Doodles in Page Background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30 z-0">
          <div className="absolute top-24 left-6">
            <LightbulbDoodle />
          </div>
          <div className="absolute top-48 right-12 hidden lg:block">
            <PaperPlaneDoodle />
          </div>
          <div className="absolute top-[42%] left-4 text-2xl select-none font-doodle text-amber-500">
            ✦
          </div>
          <div className="absolute top-[68%] right-8 text-3xl select-none font-doodle text-rose-400">
            ✧
          </div>
        </div>

        {/* ========================================================
            2. MAIN CONTENT SECTIONS (ILLUSTRATED AESTHETIC)
           ======================================================== */}
        <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-20">
          {/* ----------------------------------------------------
              SECTION 1: HERO / LANDING PAGE
              - Girl writes "Deva" in artistic handwritten script
              - Hand-drawn doodles, intro & action buttons
             ---------------------------------------------------- */}
          <section className="relative pt-4 sm:pt-8 pb-10 flex flex-col items-center text-center">
            {/* The Girl Writing "Deva" Composition */}
            <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 my-2">
              {/* Handwritten Script Title "Deva's" */}
              <div className="order-2 md:order-1 flex flex-col items-center md:items-end z-10">
                <ArtisticDevaTitle suffix="'s" />
                <span className="font-handwriting text-2xl sm:text-3xl text-amber-700 font-bold -rotate-2 mt-1">
                  Creative Technologist & 3D Interactive Engineer
                </span>
              </div>

              {/* Animated Illustrated Girl Character Writing the Title */}
              <div className="order-1 md:order-2 w-52 sm:w-64 md:w-72 shrink-0 relative">
                <WritingGirlCharacter />
              </div>
            </div>

            {/* Short Introduction & Bio */}
            <div className="max-w-2xl mx-auto mt-6 space-y-4">
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                {profile.headline}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-mono">
                <span className="px-3 py-1 bg-amber-100/70 text-amber-900 rounded-full border border-amber-200">
                  📍 {profile.location}
                </span>
                <span className="px-3 py-1 bg-emerald-100/70 text-emerald-900 rounded-full border border-emerald-200">
                  ● Available for Select Projects
                </span>
              </div>
            </div>

            {/* Action Buttons & Curly Arrow */}
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#projects"
                className="px-6 py-3 bg-[#1e293b] hover:bg-[#0f172a] text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <span>Explore My Work</span>
                <span>↓</span>
              </a>

              <a
                href="#contact"
                className="px-6 py-3 bg-white hover:bg-amber-50 text-slate-800 rounded-2xl text-xs sm:text-sm font-bold transition-all border border-amber-200 shadow-xs hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <span>Get in Touch</span>
                <span>✉</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="px-5 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-2xl text-xs font-bold transition-all border border-amber-300 shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                <span>📋</span>
              </button>

              {/* Doodled curly arrow pointing down */}
              <div className="hidden sm:block absolute -right-20 top-0">
                <SquigglyArrowDoodle label="scroll down!" direction="down" />
              </div>
            </div>
          </section>

          {/* Doodled Separator */}
          <ScissorsDoodle />

          {/* ----------------------------------------------------
              SECTION 2: ABOUT ME
              - Girl relaxing in warm beanbag chair with laptop (Frame 8s)
              - Story, stats, and "Off the clock" hobbies
             ---------------------------------------------------- */}
          <section id="about" className="space-y-10 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-handwriting text-xl text-amber-600 font-bold block">
                  Get to know me
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span>📖</span>
                  <span>About Me</span>
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                01 / STORY
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Illustrated Character on Beanbag Chair (Frame 8s) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-sm">
                  <BeanbagGirlIllustration />
                </div>
                {/* Polaroid Sticker with Real Photo Accent */}
                <div className="mt-4 rotate-2 bg-white p-3 rounded-2xl shadow-md border border-amber-100 flex items-center gap-3 max-w-xs">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 font-handwriting text-lg leading-tight">
                      devaroopa
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      spatial engineer & artist
                    </div>
                  </div>
                </div>
              </div>

              {/* Narrative Story & Stats */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                  <p className="text-lg font-bold text-slate-900 leading-snug">
                    {profile.bio}
                  </p>
                  {profile.extendedBio.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Creative Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {profile.stats.map((s, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs text-center space-y-1 hover:border-amber-300 transition-colors"
                    >
                      <div className="text-2xl sm:text-3xl font-black text-amber-600 font-script">
                        {s.value}
                      </div>
                      <div className="text-xs font-bold text-slate-800">{s.label}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{s.description}</div>
                    </div>
                  ))}
                </div>

                {/* "Off the clock, you'll find me:" (Frame 8s) */}
                <div className="space-y-2.5 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="font-handwriting text-lg text-slate-700 font-bold">
                      Off the clock, you'll find me:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.passions.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-semibold rounded-xl border border-amber-200 transition-colors flex items-center gap-1.5"
                      >
                        <span>✦</span>
                        <span>{p}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Doodled Separator */}
          <ScissorsDoodle />

          {/* ----------------------------------------------------
              SECTION 3: SKILLS ("Tools I'm fluent in" — Frame 12s)
              - Juggling Girl on Unicycle illustration
              - Categorized tools with playful proficiency meters
             ---------------------------------------------------- */}
          <section id="skills" className="space-y-10 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-handwriting text-xl text-amber-600 font-bold block">
                  Technical Arsenal
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span>⚡</span>
                  <span>Tools I'm Fluent In</span>
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                02 / SKILLS
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Illustrated Juggling Girl (Frame 12s) */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-full max-w-xs">
                  <JugglingGirlIllustration />
                </div>
              </div>

              {/* Categorized Skills Grid */}
              <div className="lg:col-span-8 space-y-6">
                {profile.skills.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-3">
                    <h3 className="text-xs font-mono font-bold tracking-wider text-amber-800 uppercase flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{group.category}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {group.items.map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-white p-3.5 rounded-2xl border border-amber-100 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-900">{skill.name}</span>
                            <span className="text-xs font-mono font-bold text-amber-600">
                              {skill.level}%
                            </span>
                          </div>

                          {/* Playful Colorful Proficiency Dot Bar */}
                          <div className="flex items-center gap-1.5">
                            {[20, 40, 60, 80, 100].map((step, idx) => (
                              <div
                                key={idx}
                                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                                  skill.level >= step
                                    ? 'bg-amber-500'
                                    : skill.level >= step - 10
                                    ? 'bg-amber-300'
                                    : 'bg-slate-100'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Doodled Separator */}
          <ScissorsDoodle />

          {/* ----------------------------------------------------
              SECTION 4: EXPERIENCE & MILESTONES (Frame 18s)
              - Notebook sketch cards with red pushpins 📌
             ---------------------------------------------------- */}
          <section id="experience" className="space-y-10 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-handwriting text-xl text-amber-600 font-bold block">
                  Career Milestones
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span>💼</span>
                  <span>Work & Experience</span>
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                03 / EXPERIENCE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.experience.map((exp, eIdx) => (
                <div
                  key={eIdx}
                  className="relative bg-white rounded-3xl p-6 sm:p-7 border-2 border-dashed border-amber-200/90 shadow-sm hover:border-amber-400 transition-all space-y-4 pt-8"
                >
                  {/* Push Pin at Top Center (Frame 18s) */}
                  <div className="absolute -top-3.5 left-8">
                    <PushPinDoodle color={eIdx % 2 === 0 ? '#ef4444' : '#f59e0b'} />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{exp.role}</h3>
                      <p className="text-xs font-bold text-amber-700">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 w-fit">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {exp.description}
                  </p>

                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">✔</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Doodled Separator */}
          <ScissorsDoodle />

          {/* ----------------------------------------------------
              SECTION 5: FEATURED PROJECTS
              - Attractive cards with tech stack badges, links
             ---------------------------------------------------- */}
          <section id="projects" className="space-y-10 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-handwriting text-xl text-amber-600 font-bold block">
                  Creative Portfolio
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span>🚀</span>
                  <span>Featured Projects</span>
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                04 / PROJECTS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayProjects.map((prj: ProjectItem, pIdx: number) => (
                <div
                  key={prj.id || pIdx}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[11px] font-mono font-bold rounded-lg border border-amber-200">
                        {prj.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{prj.year}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {prj.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {prj.tagline || prj.description}
                    </p>

                    {/* Technologies Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prj.technologies.map((tech: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 bg-slate-50 text-slate-700 text-[10px] font-mono font-semibold rounded-md border border-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics & Actions */}
                  <div className="border-t border-amber-100 pt-3 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-500 line-clamp-1">
                      ⚡ {prj.metrics}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {prj.links?.github && (
                        <a
                          href={prj.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-bold transition-colors cursor-pointer"
                        >
                          Code
                        </a>
                      )}
                      {prj.links?.live && (
                        <a
                          href={prj.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold transition-colors cursor-pointer"
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

          {/* Doodled Separator */}
          <ScissorsDoodle />

          {/* ----------------------------------------------------
              SECTION 6: CERTIFICATES & ACHIEVEMENTS
              - Visually appealing cards with badge icons
             ---------------------------------------------------- */}
          <section id="certificates" className="space-y-10 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-handwriting text-xl text-amber-600 font-bold block">
                  Verified Honors
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <span>🏆</span>
                  <span>Certificates & Achievements</span>
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                05 / CERTIFICATES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayCertificates.map((cert, cIdx) => (
                <div
                  key={cert.id || cIdx}
                  className="bg-white rounded-2xl p-5 border border-amber-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{cert.badgeIcon || '📜'}</span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                        {cert.gradeScore || 'Verified'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-amber-700 font-semibold">{cert.issuer}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{cert.description}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{cert.issueDate}</span>
                    {cert.verificationUrl && (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Verify ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ----------------------------------------------------
              SECTION 7: EDUCATION
             ---------------------------------------------------- */}
          {profile.education && profile.education.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <h3 className="text-2xl font-bold text-slate-900">Academic Foundation</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl border border-amber-100 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-950">{edu.degree}</div>
                      <div className="text-xs text-slate-600 mt-1">{edu.institution}</div>
                    </div>
                    <div className="text-xs font-mono text-amber-700 font-semibold mt-3">
                      {edu.year}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Doodled Separator */}
          <ScissorsDoodle />

          {/* ----------------------------------------------------
              SECTION 8: CONTACT FORM & SOCIALS
             ---------------------------------------------------- */}
          <section id="contact" className="space-y-8 scroll-mt-24 pt-4">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="font-handwriting text-2xl text-amber-600 font-bold block">
                Say Hello!
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Let's Build Something Memorable
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Have an ambitious creative project, WebGL concept, or just want to chat about 3D worlds? Send a message directly.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-md">
              {sentSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="text-4xl">🎉</div>
                  <h3 className="text-lg font-bold text-emerald-800">Message Received!</h3>
                  <p className="text-xs text-slate-600">
                    Thank you for reaching out. Deva will get back to you shortly at {contactEmail}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendContact} className="space-y-4">
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
                        className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-all"
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
                        className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-all"
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-all"
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full sm:w-auto px-7 py-3 bg-[#1e293b] hover:bg-[#0f172a] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <span>Send Message 🚀</span>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Social Links & Quick Contact */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
              <button
                onClick={handleCopyEmail}
                className="px-4 py-2 bg-white hover:bg-amber-50 text-slate-800 text-xs font-bold rounded-xl transition-all border border-amber-200 shadow-xs flex items-center gap-1.5 cursor-pointer"
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
                  className="px-3.5 py-2 bg-white hover:bg-amber-50 text-slate-800 text-xs font-semibold rounded-xl transition-colors border border-amber-200 shadow-xs"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          </section>

          {/* Footer note */}
          <footer className="pt-10 pb-6 text-center border-t border-amber-200/50 text-xs text-slate-400 font-mono">
            Crafted with ♡ by devaroopa · React 19, Three.js & Framer Motion
          </footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
