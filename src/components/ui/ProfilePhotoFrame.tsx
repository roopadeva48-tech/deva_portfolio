import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PushPinDoodle } from './illustrated/Doodles';

interface ProfilePhotoFrameProps {
  photoUrl?: string;
  className?: string;
  name?: string;
}

export const ProfilePhotoFrame: React.FC<ProfilePhotoFrameProps> = ({
  photoUrl = '/assets/profile/deva_photo.jpg',
  className = '',
  name = 'Devaroopa',
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Clean up any legacy user-uploaded preview from localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('deva_profile_photo_preview');
      } catch {
        // Storage disabled or quota error
      }
    }
    setHasError(false);
  }, [photoUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
      whileHover={{ scale: 1.025, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`relative inline-block select-none group ${className}`}
    >
      {/* Decorative Washi Tape at Top */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-6 bg-amber-200/95 border-y border-dashed border-amber-400/80 rounded-xs rotate-[2deg] shadow-xs z-30 pointer-events-none flex items-center justify-center">
        <span className="text-[10px] font-mono tracking-widest text-amber-800 uppercase opacity-75">
          PORTRAIT
        </span>
      </div>

      {/* Hand-drawn Push Pin at the top right */}
      <div className="absolute -top-3 -right-2 z-35 pointer-events-none">
        <PushPinDoodle color="#f59e0b" className="scale-110 drop-shadow-md" />
      </div>

      {/* Floating Sparkle Doodles */}
      <div className="absolute -top-4 -left-3 text-amber-500 font-bold text-lg select-none pointer-events-none animate-pulse">
        ✦
      </div>
      <div className="absolute -bottom-3 -right-4 text-orange-400 font-bold text-xl select-none pointer-events-none">
        ✧
      </div>

      {/* Outer Polaroid / Gallery Frame */}
      <div className="relative bg-[#fefaf0] p-3.5 sm:p-5 pb-6 sm:pb-7 rounded-3xl shadow-[0_20px_45px_-10px_rgba(45,30,15,0.22),0_4px_12px_rgba(0,0,0,0.06)] border-2 border-amber-200/90 ring-1 ring-amber-300/40 w-64 sm:w-72 md:w-80 lg:w-88 transition-shadow duration-300 group-hover:shadow-[0_28px_55px_-10px_rgba(45,30,15,0.28)]">
        {/* Inner Photo Window */}
        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-amber-50/50 border border-amber-300/60 shadow-inner flex flex-col items-center justify-center">
          {!hasError && photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              onError={() => setHasError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            /* Fallback Portrait State if photo fails to load */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <div className="absolute inset-2.5 rounded-xl border-2 border-dashed border-amber-300/80 pointer-events-none" />
              <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-amber-300 border-2 border-white shadow-md flex items-center justify-center text-2xl sm:text-3xl mb-3">
                <span>✨</span>
              </div>
              <div className="relative z-10 space-y-1">
                <span className="font-serif font-black text-xs sm:text-sm text-stone-800 tracking-wide block uppercase">
                  {name}
                </span>
                <p className="text-[11px] font-mono text-amber-800 font-semibold leading-tight">
                  Creative Technologist
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Polaroid Bottom Caption (Handwritten Script) */}
        <div className="mt-3 sm:mt-4 text-center">
          <span className="font-handwriting text-xl sm:text-2xl text-stone-800 font-bold block -rotate-1">
            {name} ✨
          </span>
          <span className="text-[10px] font-mono tracking-widest text-amber-800 uppercase block font-medium">
            Creative Technologist
          </span>
        </div>
      </div>
    </motion.div>
  );
};
