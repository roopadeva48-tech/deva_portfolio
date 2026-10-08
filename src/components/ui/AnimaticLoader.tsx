import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../utils/audio';

interface AnimaticLoaderProps {
  onComplete: () => void;
}

export const AnimaticLoader: React.FC<AnimaticLoaderProps> = ({ onComplete }) => {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Exact duration to feel natural like the reference video
    const timer = setTimeout(() => {
      sound.playZoom();
      setIsDone(true);
      setTimeout(onComplete, 700);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="animatic-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-900 select-none overflow-hidden"
        >
          {/* Diagonal wipe transition element from video (00:02) */}
          <motion.div
            initial={{ x: '-130%', y: '130%' }}
            animate={isDone ? { x: '130%', y: '-130%' } : { x: '-130%', y: '130%' }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0 bg-[#38bdf8] pointer-events-none z-10"
            style={{
              transform: 'skewX(-20deg)',
              width: '240%',
              height: '240%',
              left: '-70%',
              top: '-70%',
            }}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center z-20"
          >
            {/* Hand-drawn Envelope Icon - Pixel-matched to Image 1 */}
            <div className="relative mb-5 animate-sketch">
              <svg
                width="84"
                height="64"
                viewBox="0 0 100 80"
                fill="none"
                stroke="#1e293b"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform -rotate-1"
              >
                {/* Hand-drawn irregular envelope outline matching image 1 */}
                <path d="M12 18 C18 16, 82 8, 88 12 C90 14, 88 64, 86 72 C85 75, 20 78, 16 75 C14 74, 11 25, 12 18 Z" />
                {/* Envelope flap folds with uneven hand-drawn lines */}
                <path d="M13 19 C28 32, 45 46, 52 48 C58 46, 75 28, 87 13" />
                {/* Inner crease lines */}
                <path d="M18 18 C26 21, 38 23, 48 23" strokeWidth="2.2" opacity="0.6" />
              </svg>
            </div>

            {/* Handwritten "LOADING" matching image 1 typography */}
            <div className="flex items-center gap-1.5 font-bold tracking-[0.25em] text-slate-800 text-sm select-none">
              <span className="transform -rotate-2">L</span>
              <span className="transform rotate-1">O</span>
              <span className="transform -rotate-1">A</span>
              <span className="transform rotate-2">D</span>
              <span className="transform -rotate-1">I</span>
              <span className="transform rotate-1">N</span>
              <span className="transform -rotate-2">G</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
