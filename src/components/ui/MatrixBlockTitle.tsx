import React from 'react';
import { motion } from 'motion/react';
import { sound } from '../../utils/audio';

interface MatrixBlockTitleProps {
  onBegin: () => void;
  onExploreGirl: () => void;
}

// 3 Rows x 5 Columns = 15 Characters:
// Row 1: R - O - O - P - A
// Row 2: W - O - R - L - D
// Row 3: F - O - L - I - O
const MATRIX_ROWS = [
  ['R', 'O', 'O', 'P', 'A'],
  ['W', 'O', 'R', 'L', 'D'],
  ['F', 'O', 'L', 'I', 'O'],
];

// Architectural 3D Block Letter SVG paths matching Image 2
const renderBlockGlyph = (char: string) => {
  switch (char) {
    case 'R':
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
          {/* 3D Extrusion Depth Shadows */}
          <path d="M12 10 L22 2 M82 10 L92 2 L92 100 L82 108 L82 10 M82 108 L22 108 L12 100" fill="#94a3b8" />
          <path d="M82 10 L92 2 L92 60 L82 68 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M52 100 L62 92 L92 92 L82 108 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          {/* Main Top Face */}
          <path
            d="M14 12 H80 V62 H54 L80 104 H50 L28 62 H38 V104 H14 Z"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Inner cutout */}
          <path
            d="M38 28 H58 V46 H38 Z"
            fill="#cbd5e1"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'O':
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
          {/* 3D Extrusion Depth Shadows */}
          <path d="M82 12 L94 4 L94 98 L82 106 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M14 106 L26 114 L94 114 L82 106 Z" fill="#94a3b8" stroke="#1e293b" strokeWidth="2.5" />
          {/* Main Top Face */}
          <rect
            x="14"
            y="12"
            width="68"
            height="94"
            rx="2"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Inner window cutout */}
          <rect
            x="36"
            y="34"
            width="24"
            height="50"
            rx="1"
            fill="#cbd5e1"
            stroke="#1e293b"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'P':
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
          <path d="M82 12 L94 4 L94 62 L82 70 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M38 106 L50 114 L50 78 L38 70 Z" fill="#94a3b8" />
          {/* Main Top Face */}
          <path
            d="M14 12 H80 V68 H38 V106 H14 Z"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Inner cutout */}
          <rect
            x="38"
            y="28"
            width="22"
            height="26"
            fill="#cbd5e1"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'A':
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
          <path d="M82 12 L94 4 L94 98 L82 106 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M14 106 L26 114 L94 114 L82 106 Z" fill="#94a3b8" />
          {/* Main Top Face */}
          <path
            d="M14 12 H82 V106 H58 V70 H38 V106 H14 Z"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Inner cutout */}
          <rect
            x="38"
            y="32"
            width="20"
            height="22"
            fill="#cbd5e1"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'W':
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
          <path d="M84 12 L96 4 L96 98 L84 106 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M12 106 L24 114 L96 114 L84 106 Z" fill="#94a3b8" />
          {/* Main Top Face */}
          <path
            d="M12 12 H34 V72 H42 V28 H58 V72 H66 V12 H84 V106 H12 Z"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'R2':
    case 'R':
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
          <path d="M82 12 L94 4 L94 62 L82 70 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M52 106 L64 98 L94 98 L82 106 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          <path
            d="M14 12 H80 V62 H54 L80 106 H50 L28 62 H38 V106 H14 Z"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M38 28 H58 V46 H38 Z"
            fill="#cbd5e1"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'L':
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
          <path d="M82 74 L94 66 L94 98 L82 106 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M14 106 L26 114 L94 114 L82 106 Z" fill="#94a3b8" />
          {/* Main Top Face */}
          <path
            d="M14 12 H38 V78 H82 V106 H14 Z"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'D':
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
          <path d="M82 12 L94 4 L94 98 L82 106 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M14 106 L26 114 L94 114 L82 106 Z" fill="#94a3b8" />
          {/* Main Top Face */}
          <path
            d="M14 12 H64 C76 12 82 24 82 40 V78 C82 94 76 106 64 106 H14 Z"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Inner window */}
          <rect
            x="36"
            y="34"
            width="22"
            height="50"
            rx="2"
            fill="#cbd5e1"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'F':
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
          <path d="M82 12 L94 4 L94 44 L82 52 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M68 56 L80 48 L80 72 L68 80 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          {/* Main Top Face */}
          <path
            d="M14 12 H82 V44 H38 V56 H68 V80 H38 V106 H14 Z"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'I':
      return (
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md">
          <path d="M66 12 L78 4 L78 98 L66 106 Z" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M34 106 L46 114 L78 114 L66 106 Z" fill="#94a3b8" />
          {/* Main Top Face */}
          <rect
            x="34"
            y="12"
            width="32"
            height="94"
            rx="2"
            fill="#f8fafc"
            stroke="#1e293b"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <div className="w-full h-full flex items-center justify-center font-black text-2xl text-slate-800 bg-white border-2 border-slate-900 shadow-md">
          {char}
        </div>
      );
  }
};

export const MatrixBlockTitle: React.FC<MatrixBlockTitleProps> = ({
  onBegin,
  onExploreGirl,
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-auto w-full max-w-xs mx-auto px-2 pointer-events-auto select-none">
      {/* 3 x 5 Architectural Block Matrix - Reduced & Sleek Proportion */}
      <div className="w-full max-w-[185px] sm:max-w-[205px] bg-white/70 backdrop-blur-md p-1.5 sm:p-2 rounded-xl border border-slate-900/15 shadow-lg">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          {MATRIX_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-5 gap-0.5 sm:gap-1">
              {row.map((char, cIdx) => (
                <motion.div
                  key={`${rIdx}-${cIdx}`}
                  initial={{ scale: 0, y: -6, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.08 + (rIdx * 5 + cIdx) * 0.025,
                    type: 'spring',
                    stiffness: 300,
                    damping: 22,
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -2,
                    transition: { duration: 0.12 },
                  }}
                  onClick={() => sound.playClick()}
                  className="aspect-[4/5] flex items-center justify-center cursor-pointer transition-transform"
                  title={`${char}`}
                >
                  {renderBlockGlyph(char)}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Retro Pixel / Arcade BEGIN Button - Compact */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.35 }}
        className="mt-3 flex flex-row items-center justify-center gap-2"
      >
        <button
          onClick={() => {
            sound.playClick();
            onBegin();
          }}
          className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-[11px] font-extrabold tracking-widest uppercase rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all border border-slate-950 cursor-pointer"
        >
          BEGIN
        </button>

        <button
          onClick={() => {
            sound.playChime();
            onExploreGirl();
          }}
          className="px-3 py-1.5 bg-white/95 hover:bg-white text-slate-900 text-[11px] font-bold rounded-lg shadow-xs border border-slate-900/20 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          Meet Roopa →
        </button>
      </motion.div>
    </div>
  );
};
