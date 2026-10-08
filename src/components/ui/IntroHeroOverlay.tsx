import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MatrixBlockTitle } from './MatrixBlockTitle';

interface IntroHeroOverlayProps {
  isVisible: boolean;
  onBegin: () => void;
  onExploreGirl: () => void;
}

export const IntroHeroOverlay: React.FC<IntroHeroOverlayProps> = ({
  isVisible,
  onBegin,
  onExploreGirl,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-8 select-none"
        >
          {/* Top Header Branding */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-between pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-slate-900" />
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-900">
                  ROOPA DEVA
                </span>
                <span className="hidden sm:inline-block ml-3 text-xs text-slate-800 font-medium">
                  Creative Technologist · 3D Spatial Systems
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-900 uppercase tracking-wider bg-white/80 backdrop-blur px-2.5 py-1 rounded-md border border-slate-900/15 shadow-sm font-semibold">
                3×5 MATRIX ARCHITECTURE
              </span>
            </div>
          </motion.div>

          {/* Center 3x5 Matrix Block Letters: "ROOPA WORLD FOLIO" matching Image 2 */}
          <MatrixBlockTitle onBegin={onBegin} onExploreGirl={onExploreGirl} />

          {/* Bottom helper text */}
          <div className="text-center pb-2">
            <span className="text-[11px] font-mono text-slate-800/80 bg-white/60 backdrop-blur px-3 py-1 rounded-full border border-white/60 shadow-sm">
              Each block carries 1 character · 3×5 architectural matrix
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
