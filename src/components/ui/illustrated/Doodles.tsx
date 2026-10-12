import React from 'react';
import { motion } from 'motion/react';

// Dotted Paper Airplane Floating across
export const PaperPlaneDoodle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 260 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
      >
        {/* Curving dashed flight path */}
        <motion.path
          d="M10 80 Q70 110 120 70 T200 40 L220 32"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="4 6"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        {/* Paper Plane */}
        <motion.g
          animate={{
            x: [0, 8, -4, 0],
            y: [0, -6, 3, 0],
            rotate: [0, 4, -3, 0],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          transform="translate(210, 24)"
        >
          <polygon points="0,15 35,0 15,22" fill="#ffffff" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="35,0 15,22 12,32 18,24" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="35,0 0,15 15,18" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
        </motion.g>
      </svg>
    </div>
  );
};

// Hand-Drawn Scissors with Dashed Cutting Line (Directly from video frame 8s & 12s)
export const ScissorsDoodle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 select-none pointer-events-none opacity-70 ${className}`}>
      <span className="text-xl rotate-45 inline-block text-slate-700">✂</span>
      <div className="flex-1 border-b-2 border-dashed border-slate-300 h-0" />
    </div>
  );
};

// Cute Lightbulb Doodle (Idea / Creativity)
export const LightbulbDoodle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.svg
      viewBox="0 0 60 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-12 h-14 ${className}`}
      animate={{ rotate: [-4, 4, -4] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Glow rays */}
      <line x1="30" y1="5" x2="30" y2="0" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="12" x2="8" y2="8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <line x1="48" y1="12" x2="52" y2="8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="30" x2="0" y2="30" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <line x1="55" y1="30" x2="60" y2="30" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

      {/* Glass bulb */}
      <path
        d="M20 48 C12 40 10 24 20 15 C30 6 45 10 48 24 C50 35 40 45 35 48 Z"
        fill="#fef08a"
        stroke="#0f172a"
        strokeWidth="2.5"
      />
      {/* Filament */}
      <path d="M26 36 L28 26 L32 26 L34 36" stroke="#ea580c" strokeWidth="1.5" fill="none" />
      {/* Base */}
      <rect x="23" y="48" width="14" height="4" rx="1" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
      <rect x="24" y="53" width="12" height="4" rx="1" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
      <rect x="26" y="58" width="8" height="3" rx="1" fill="#0f172a" />
    </motion.svg>
  );
};

// Playful Curly Hand-drawn Arrow
export const SquigglyArrowDoodle: React.FC<{
  label?: string;
  className?: string;
  direction?: 'down' | 'right';
}> = ({ label, className = '', direction = 'down' }) => {
  return (
    <div className={`flex flex-col items-center gap-1 select-none pointer-events-none ${className}`}>
      {label && (
        <span className="font-handwriting text-lg text-slate-600 font-bold tracking-wide -rotate-6">
          {label}
        </span>
      )}
      <svg
        viewBox="0 0 50 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-10 overflow-visible text-slate-700"
      >
        {direction === 'down' ? (
          <>
            <path
              d="M15 5 Q35 15 25 35 Q18 45 28 55"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M18 48 L28 56 L32 44"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        ) : (
          <>
            <path
              d="M5 25 Q20 10 35 20 Q42 25 45 25"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M38 18 L46 25 L38 32"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        )}
      </svg>
    </div>
  );
};

// Hand-Drawn Push-Pin (Directly from video frame 18s)
export const PushPinDoodle: React.FC<{ color?: string; className?: string }> = ({
  color = '#ef4444',
  className = '',
}) => {
  return (
    <div className={`select-none pointer-events-none ${className}`}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 drop-shadow-sm">
        {/* Shadow */}
        <ellipse cx="16" cy="28" rx="8" ry="3" fill="#64748b" opacity="0.3" />
        {/* Pin Needle */}
        <line x1="16" y1="18" x2="16" y2="28" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        {/* Pin Head */}
        <circle cx="16" cy="12" r="8" fill={color} stroke="#991b1b" strokeWidth="1.5" />
        <ellipse cx="14" cy="9" rx="3" ry="1.8" fill="#ffffff" opacity="0.8" />
      </svg>
    </div>
  );
};

// Large Handwritten Script "Deva" or "Deva's" (Written by the girl in the hero!)
export const ArtisticDevaTitle: React.FC<{
  suffix?: string;
  className?: string;
}> = ({ suffix = "'s", className = '' }) => {
  return (
    <div className={`relative inline-flex items-baseline select-none ${className}`}>
      {/* Handwriting SVG or Large Script */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <h1 className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-wide text-[#1e293b] leading-none drop-shadow-xs flex items-baseline">
          <span>Deva</span>
          {suffix && (
            <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#ea580c] -ml-1">
              {suffix}
            </span>
          )}
        </h1>

        {/* Decorative flourish line under the script name */}
        <motion.svg
          viewBox="0 0 280 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-4 sm:h-6 -mt-1 sm:-mt-2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: 'easeInOut' }}
        >
          <path
            d="M5 16 Q80 24 160 14 T270 20"
            stroke="#ea580c"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cute heart at the end of the stroke */}
          <path
            d="M266 18 C266 14 271 12 274 15 C277 12 282 14 282 18 C282 23 274 27 274 27 C274 27 266 23 266 18 Z"
            fill="#ea580c"
          />
        </motion.svg>
      </motion.div>
    </div>
  );
};
