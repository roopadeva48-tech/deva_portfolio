import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, ProjectItem } from '../../types';
import { sound } from '../../utils/audio';

interface LandmarkModalProps {
  landmark: Landmark | null;
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  onOpenContact: () => void;
  onSwitchLandmark: (id: Landmark['id']) => void;
  onToggleAntiGravity?: () => void;
  isAntiGravity?: boolean;
}

export const LandmarkModal: React.FC<LandmarkModalProps> = ({
  landmark,
  isOpen,
  onClose,
  projects,
  onOpenContact,
  onSwitchLandmark,
}) => {
  const [projectCategory, setProjectCategory] = useState<string>('all');

  if (!isOpen || !landmark) return null;

  const filteredProjects =
    projectCategory === 'all'
      ? projects
      : projects.filter(
          (p) => p.category.toLowerCase() === projectCategory.toLowerCase()
        );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 bg-slate-50 text-slate-900 overflow-y-auto flex flex-col selection:bg-teal-500 selection:text-white"
      >
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs w-full">
          <div className="w-full px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
            {/* Left: Back to Globe */}
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
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  sound.playChime();
                  onClose();
                  onSwitchLandmark('girl_me');
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer"
              >
                Go to devaroopa's Profile
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onOpenContact();
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </header>

        {/* Full Page Content */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-12">
          {/* Header Title Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-teal-800">
                {landmark.category}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-mono text-slate-500">
                {landmark.statsBadge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              {landmark.name}
            </h1>

            <p className="text-lg sm:text-xl font-semibold text-teal-900/90 max-w-3xl leading-snug">
              {landmark.tagline}
            </p>

            <p className="text-base text-slate-600 leading-relaxed max-w-3xl pt-1">
              {landmark.description}
            </p>
          </section>

          {/* Clean Content Area (No artificial cards or boxed card grids) */}
          <section className="space-y-10 pt-4 border-t border-slate-200">
            {/* 1. Rocket: Tech Stack */}
            {landmark.id === 'rocket' && (
              <div className="space-y-10 max-w-3xl">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Performance Rigs & Architecture
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Circumnavigating the digital globe with supersonic speeds, optimized asset streaming, and guaranteed 60 FPS frame rates. Built with procedural geometry synthesis and custom WebGL shaders to eliminate external 3D asset lag.
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-mono font-bold tracking-wider text-slate-400 uppercase">
                    Key Architectural Pillars
                  </h3>
                  <ul className="space-y-4 text-slate-700 text-base">
                    <li className="flex items-start gap-3">
                      <span className="text-teal-700 font-bold mt-1 text-sm">✦</span>
                      <div>
                        <strong className="text-slate-900 font-bold block">Dynamic Procedural Geometries</strong>
                        <span className="text-slate-600 text-sm leading-relaxed block">
                          Generates 3D planetary terrain, architectural blocks, and vehicles in code, achieving zero initial 3D mesh network stalls and instant scene initialization.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-teal-700 font-bold mt-1 text-sm">✦</span>
                      <div>
                        <strong className="text-slate-900 font-bold block">Slerp Camera Transitions</strong>
                        <span className="text-slate-600 text-sm leading-relaxed block">
                          Seamless spherical interpolation (Slerp) and custom FOV damping for smooth landmark focusing without frame drops.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-teal-700 font-bold mt-1 text-sm">✦</span>
                      <div>
                        <strong className="text-slate-900 font-bold block">Throttled Raycasting & Efficient Event Listeners</strong>
                        <span className="text-slate-600 text-sm leading-relaxed block">
                          Subpixel pointer calculations throttled to frame ticks to preserve CPU and battery life on mobile and high-refresh displays.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-teal-700 font-bold mt-1 text-sm">✦</span>
                      <div>
                        <strong className="text-slate-900 font-bold block">Modular Full-Stack Backend</strong>
                        <span className="text-slate-600 text-sm leading-relaxed block">
                          Decoupled Node.js Express REST microservices managing dynamic landmark payloads, contact dispatch, and profile metrics.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* 2. Skyscrapers: Projects */}
            {landmark.id === 'skyscrapers' && (
              <div className="space-y-8">
                {/* Category filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {['all', '3D Spatial', 'Animatic & Motion', 'Creative Lab'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        sound.playClick();
                        setProjectCategory(cat);
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        projectCategory === cat
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {cat === 'all' ? 'All Works' : cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-10 pt-4">
                  {filteredProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="space-y-3 pb-8 border-b border-slate-200 last:border-0"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                          <span className="font-bold text-teal-800 uppercase">{proj.category}</span>
                          <span>·</span>
                          <span>{proj.year}</span>
                        </div>
                        {proj.metrics && (
                          <span className="text-xs font-mono text-emerald-800 font-semibold">
                            {proj.metrics}
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900">
                        {proj.title}
                      </h3>

                      <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                        {proj.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-slate-100 px-3 py-1 rounded-lg font-mono text-xs text-slate-800 font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <ul className="space-y-1.5 text-sm text-slate-600 pt-2 list-disc list-inside">
                        {proj.features.map((feat, fIdx) => (
                          <li key={fIdx}>{feat}</li>
                        ))}
                      </ul>

                      {proj.links.github && (
                        <div className="pt-2">
                          <a
                            href={proj.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-slate-900 hover:underline inline-flex items-center gap-1"
                          >
                            View Repository ↗
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Cozy House: Story */}
            {landmark.id === 'cozy_house' && (
              <div className="space-y-8 max-w-3xl">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    The Origin of Miniature World Building
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    "Ever since I sketched my first miniature diorama, I realized that bounding an entire world into a single playful orb changes how people interact with code. Instead of infinite flat pages, a miniature globe feels tangible, intimate, and alive."
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-mono font-bold tracking-wider text-slate-400 uppercase">
                    Creative Tenets
                  </h3>
                  <div className="space-y-4 text-base text-slate-700">
                    <div>
                      <strong className="text-slate-900 font-bold block">Tactile Animatics</strong>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Hand-drawn linework and wobbly physics bring human warmth to sterile 3D shaders.
                      </p>
                    </div>
                    <div>
                      <strong className="text-slate-900 font-bold block">Spatial Wonder</strong>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Allowing digital structures to transcend flat layouts unlocks novel gestures and interactive exploration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Crane: Lab Experiments */}
            {landmark.id === 'crane' && (
              <div className="space-y-8 max-w-3xl">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Active Experiments & Creative Code Lab
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    The harbor dock and crane represent the ongoing workspace where creative experiments, custom shaders, and experimental interaction patterns are forged.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-mono font-bold tracking-wider text-slate-400 uppercase">
                    Upcoming Experiments in Progress
                  </h3>
                  <ul className="space-y-3 text-base text-slate-700 list-disc list-inside">
                    <li>Volumetric Raymarched Cloud Shadows on Earth Continents</li>
                    <li>Audio Reactive Water Ripples on Procedural Oceans</li>
                    <li>Multiplayer Globe Orbit with Real-time Presence Cursors</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 5. Hot Air Balloon: Contact */}
            {landmark.id === 'hot_air_balloon' && (
              <div className="space-y-8 max-w-3xl">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Aero Expeditions & Collaboration
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    The aero balloons carry messages around the globe. Send a transmission to devaroopa to collaborate on upcoming spatial, WebGL, or creative frontend engineering projects.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                    onOpenContact();
                  }}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Open Contact Form →
                </button>
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">devaroopa</span>
              <span>·</span>
              <span>3D Spatial Diorama Portfolio</span>
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
