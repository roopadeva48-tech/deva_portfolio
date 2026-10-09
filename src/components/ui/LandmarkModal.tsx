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
  onToggleAntiGravity: () => void;
  isAntiGravity: boolean;
}

export const LandmarkModal: React.FC<LandmarkModalProps> = ({
  landmark,
  isOpen,
  onClose,
  projects,
  onOpenContact,
  onSwitchLandmark,
  onToggleAntiGravity,
  isAntiGravity,
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
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 my-auto flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>LANDMARK EXPLORER</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-900 font-semibold">{landmark.name}</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-teal-800">
                  {landmark.category}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-xs font-mono text-slate-500">
                  {landmark.statsBadge}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {landmark.name}
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                {landmark.tagline}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
                {landmark.description}
              </p>
            </div>

            {/* Skyscrapers: Projects */}
            {landmark.id === 'skyscrapers' && (
              <div className="space-y-6 pt-2">
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {['all', '3D Spatial', 'Animatic & Motion', 'Creative Lab'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        sound.playClick();
                        setProjectCategory(cat);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        projectCategory === cat
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat === 'all' ? 'All Works' : cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {filteredProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-5 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all space-y-3"
                    >
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                          <span>{proj.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{proj.year}</span>
                        </div>
                        {proj.metrics && (
                          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {proj.metrics}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                          {proj.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-600">
                        {proj.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-mono text-[11px]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <ul className="list-disc list-inside text-xs text-slate-500 space-y-1 pt-1">
                        {proj.features.map((feat, fIdx) => (
                          <li key={fIdx}>{feat}</li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-3 pt-2">
                        {proj.links.github && (
                          <a
                            href={proj.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-slate-800 hover:underline flex items-center gap-1"
                          >
                            View Repository ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cozy House: Story */}
            {landmark.id === 'cozy_house' && (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2 text-xs sm:text-sm text-amber-950">
                  <h4 className="font-bold text-amber-900">
                    The Origin of Miniature World Building
                  </h4>
                  <p>
                    "Ever since I sketched my first miniature diorama, I realized that bounding an entire world into a single playful orb changes how people interact with code. Instead of infinite flat pages, a miniature globe feels tangible, intimate, and alive."
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <h4 className="font-semibold text-slate-900">Key Pillars of My Creative Process:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 text-xs">Tactile Animatics</div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Hand-drawn linework and wobbly physics bring human warmth to sterile 3D shaders.
                      </div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 text-xs">Anti-Gravity Wonder</div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Allowing digital structures to escape gravity unlocks novel gestures and interactive exploration.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      sound.playChime();
                      onSwitchLandmark('girl_me');
                    }}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                  >
                    Meet the Creator on the Globe →
                  </button>
                </div>
              </div>
            )}

            {/* Rocket: Tech Stack */}
            {landmark.id === 'rocket' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-xl font-bold font-mono text-slate-900">16.6ms</div>
                    <div className="text-xs text-slate-500 mt-0.5">Frame Budget (60 FPS)</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-xl font-bold font-mono text-slate-900">&lt; 0.8s</div>
                    <div className="text-xs text-slate-500 mt-0.5">Scene Initialization</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-xl font-bold font-mono text-slate-900">0 KB</div>
                    <div className="text-xs text-slate-500 mt-0.5">External Model Lag</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900">Optimized 3D Scene Architecture:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Dynamic procedural geometries: zero external network asset stalls.</li>
                    <li>Slerp camera transitions: seamless interpolated navigation without frame stutter.</li>
                    <li>Pointer raycasting with throttled hover matrix tests for battery efficiency.</li>
                    <li>Decoupled Node.js Express backend with REST modular structure.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Crane & Harbor: Lab experiments */}
            {landmark.id === 'crane' && (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl space-y-2 text-xs sm:text-sm text-yellow-950">
                  <h4 className="font-bold text-yellow-900">
                    Active Anti-Gravity Prototype
                  </h4>
                  <p>
                    Test the zero-G physics system directly! When activated, gravitational anchors release and structures float into weightless orbital equilibrium.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        sound.playAntiGravity();
                        onToggleAntiGravity();
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-lg shadow-sm transition-all ${
                        isAntiGravity
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-600'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isAntiGravity ? '✓ Anti-Gravity Active (Float ON)' : '⚡ Activate Anti-Gravity Float'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <h4 className="font-semibold text-slate-900">Upcoming Experiments in Progress:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-500">
                    <li>Volumetric Raymarched Cloud Shadows on Earth Continents</li>
                    <li>Audio Reactive Water Ripples on Procedural Oceans</li>
                    <li>Multiplayer Globe Orbit with Real-time Presence Cursors</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Hot Air Balloon: Contact */}
            {landmark.id === 'hot_air_balloon' && (
              <div className="space-y-4 pt-2">
                <p className="text-xs sm:text-sm text-slate-600">
                  The aero balloons carry messages around the globe. Send a transmission to devaroopa to collaborate on upcoming spatial or web engineering projects.
                </p>
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                    onOpenContact();
                  }}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  Open Contact Transmission Form →
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              Close Window
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playChime();
                  onSwitchLandmark('girl_me');
                }}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
              >
                Go to devaroopa's Profile
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
