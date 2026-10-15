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
        <h1 className="font-doodle-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wide text-[#141414] leading-none drop-shadow-xs flex items-baseline">
          <span>Deva</span>
          {suffix && (
            <span className="font-doodle-heading text-4xl sm:text-5xl md:text-6xl text-[#F26A1F] -ml-1">
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
            stroke="#F26A1F"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cute heart at the end of the stroke */}
          <path
            d="M266 18 C266 14 271 12 274 15 C277 12 282 14 282 18 C282 23 274 27 274 27 C274 27 266 23 266 18 Z"
            fill="#F26A1F"
          />
        </motion.svg>
      </motion.div>
    </div>
  );
};

// Hand-Drawn Animated Squiggle Underline (Draws itself when scrolled into view)
export const SquiggleUnderline: React.FC<{
  color?: string;
  width?: number | string;
  className?: string;
}> = ({ color = '#F26A1F', className = '' }) => {
  return (
    <motion.svg
      viewBox="0 0 200 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[220px] h-3 sm:h-4 overflow-visible ${className}`}
      initial={{ pathLength: 0, opacity: 0.2 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1.1, ease: 'easeInOut' }}
    >
      <motion.path
        d="M3 10 Q 25 3, 50 10 T 100 10 T 150 10 T 195 10"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
};

// Curving Dashed Line with Flat Paper Plane (Flies along the curve between sections)
export const SectionCurvedPlaneDivider: React.FC<{
  className?: string;
  flip?: boolean;
}> = ({ className = '', flip = false }) => {
  return (
    <div className={`relative w-full py-6 sm:py-8 overflow-hidden select-none pointer-events-none ${className}`}>
      <div className={`max-w-4xl mx-auto px-4 ${flip ? 'scale-x-[-1]' : ''}`}>
        <svg
          viewBox="0 0 800 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible"
        >
          {/* Dashed flight track */}
          <path
            d="M 20 45 C 200 85, 350 10, 520 60 S 740 25, 780 40"
            stroke="#141414"
            strokeWidth="2"
            strokeDasharray="6 8"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* Animated Paper Plane following track */}
          <motion.g
            initial={{ offsetDistance: '0%', opacity: 0 }}
            whileInView={{ offsetDistance: '100%', opacity: 1 }}
            viewport={{ once: true }}
            animate={{
              x: [120, 480, 720],
              y: [40, 25, 38],
              rotate: [12, -8, 10],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Flat 2D Paper Plane */}
            <polygon points="0,14 36,0 16,22" fill="#FFFFFF" stroke="#141414" strokeWidth="2.5" strokeLinejoin="round" />
            <polygon points="36,0 16,22 12,30 18,24" fill="#F26A1F" stroke="#141414" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="36,0 0,14 16,18" fill="#FFE9DC" stroke="#141414" strokeWidth="2" strokeLinejoin="round" />
          </motion.g>
        </svg>
      </div>
    </div>
  );
};

// Small Flat Line-Art Doodle: Pencil
export const PencilDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-7 h-7 ${className}`}
  >
    <g transform="rotate(45 20 20)">
      {/* Eraser */}
      <rect x="14" y="2" width="12" height="6" rx="2" fill="#F26A1F" stroke="#141414" strokeWidth="2" />
      {/* Ferrule */}
      <rect x="14" y="8" width="12" height="4" fill="#FFE9DC" stroke="#141414" strokeWidth="2" />
      {/* Body */}
      <rect x="14" y="12" width="12" height="18" fill="#F26A1F" stroke="#141414" strokeWidth="2" />
      <line x1="18" y1="12" x2="18" y2="30" stroke="#141414" strokeWidth="1.5" />
      <line x1="22" y1="12" x2="22" y2="30" stroke="#141414" strokeWidth="1.5" />
      {/* Wood point */}
      <polygon points="14,30 26,30 20,38" fill="#FFFFFF" stroke="#141414" strokeWidth="2" strokeLinejoin="round" />
      {/* Graphite */}
      <polygon points="18,35 22,35 20,38" fill="#141414" />
    </g>
  </svg>
);

// Small Flat Line-Art Doodle: Paintbrush
export const BrushDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-7 h-7 ${className}`}
  >
    <g transform="rotate(-30 20 20)">
      {/* Handle */}
      <path d="M18 4 L22 4 L21 22 L19 22 Z" fill="#FFE9DC" stroke="#141414" strokeWidth="2" />
      {/* Ferrule */}
      <rect x="17" y="22" width="6" height="5" rx="1" fill="#FFFFFF" stroke="#141414" strokeWidth="2" />
      {/* Bristles */}
      <path d="M17 27 C17 35 20 37 20 37 C20 37 23 35 23 27 Z" fill="#F26A1F" stroke="#141414" strokeWidth="2" />
    </g>
  </svg>
);

// Small Flat Line-Art Doodle: Palette
export const PaletteDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-8 h-8 ${className}`}
  >
    <path
      d="M22 6 C12 6 6 12 6 22 C6 30 11 36 19 36 C22 36 24 33 24 31 C24 29 25 28 27 28 C30 28 32 30 35 30 C37 30 38 28 38 26 C38 15 31 6 22 6 Z"
      fill="#FFFFFF"
      stroke="#141414"
      strokeWidth="2.5"
    />
    <circle cx="14" cy="16" r="3" fill="#F26A1F" />
    <circle cx="22" cy="13" r="3" fill="#141414" />
    <circle cx="30" cy="17" r="3" fill="#FFE9DC" stroke="#141414" strokeWidth="1.5" />
    <circle cx="29" cy="24" r="2.5" fill="#F26A1F" />
    {/* Thumb hole */}
    <circle cx="16" cy="27" r="3" fill="#FDFBF7" stroke="#141414" strokeWidth="2" />
  </svg>
);

// Small Flat Line-Art Doodle: Crayon
export const CrayonDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-7 h-7 ${className}`}
  >
    <g transform="rotate(25 18 18)">
      <polygon points="14,8 22,8 18,2" fill="#F26A1F" stroke="#141414" strokeWidth="2" strokeLinejoin="round" />
      <rect x="14" y="8" width="8" height="22" rx="1" fill="#FFFFFF" stroke="#141414" strokeWidth="2" />
      {/* Label band */}
      <rect x="14" y="14" width="8" height="10" fill="#F26A1F" stroke="#141414" strokeWidth="1.5" />
      <line x1="18" y1="15" x2="18" y2="23" stroke="#141414" strokeWidth="1" />
    </g>
  </svg>
);

// Small Flat Line-Art Doodle: Star
export const StarDoodle: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#F26A1F',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 ${className}`}
  >
    <path
      d="M16 2 L19.5 11.5 L29 12.5 L21.5 19 L24 28.5 L16 23.5 L8 28.5 L10.5 19 L3 12.5 L12.5 11.5 Z"
      fill={color}
      stroke="#141414"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

// Small Flat Line-Art Doodle: Swirl
export const SwirlDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 ${className}`}
  >
    <path
      d="M16 16 C14 16 13 14 14 13 C15 12 18 11 19 14 C20 17 17 21 13 20 C8 19 8 12 12 8 C17 4 25 6 26 13 C27 21 19 27 12 26"
      stroke="#141414"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// Small Flat Line-Art Doodle: Heart
export const HeartDoodle: React.FC<{ className?: string; fill?: string }> = ({
  className = '',
  fill = '#F26A1F',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 ${className}`}
  >
    <path
      d="M16 28 C16 28 4 20 4 11 C4 6 8 3 12.5 3 C14.5 3 16 4.5 16 4.5 C16 4.5 17.5 3 19.5 3 C24 3 28 6 28 11 C28 20 16 28 16 28 Z"
      fill={fill}
      stroke="#141414"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

// Small Flat Line-Art Doodle: Paint Drop
export const PaintDropDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 30 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-5 h-6 ${className}`}
  >
    <path
      d="M15 3 C15 3 6 15 6 22 C6 28 10 32 15 32 C20 32 24 28 24 22 C24 15 15 3 15 3 Z"
      fill="#F26A1F"
      stroke="#141414"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <ellipse cx="12" cy="22" rx="2" ry="4" fill="#FFFFFF" opacity="0.75" />
  </svg>
);

// Sparkle ✦
export const SparkleDoodle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`select-none pointer-events-none text-xl sm:text-2xl text-[#F26A1F] font-bold ${className}`}>
    ✦
  </div>
);

// Top Thin Scroll Progress Bar with Riding Pencil
export const ScrollProgressPencil: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
      {/* Orange line */}
      <div
        className="h-full bg-[#F26A1F] transition-all duration-75 ease-out relative"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      >
        {/* Tiny Pencil Riding the Tip */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 pointer-events-none"
          style={{ transform: 'translate(4px, -50%) rotate(45deg)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 drop-shadow-sm">
            <polygon points="12,2 16,8 8,8" fill="#F26A1F" stroke="#141414" strokeWidth="1.5" />
            <rect x="8" y="8" width="8" height="12" fill="#FFE9DC" stroke="#141414" strokeWidth="1.5" />
            <polygon points="8,20 16,20 12,24" fill="#141414" />
          </svg>
        </div>
      </div>
    </div>
  );
};

