import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { PushPinDoodle } from './illustrated/Doodles';
import { sound } from '../../utils/audio';

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
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    // Check if user uploaded a preview in localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deva_profile_photo_preview');
      if (saved) return saved;
    }
    return photoUrl;
  });
  const [hasError, setHasError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset error when photoUrl changes
    setHasError(false);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deva_profile_photo_preview');
      if (saved) {
        setCurrentSrc(saved);
        return;
      }
    }
    setCurrentSrc(photoUrl);
  }, [photoUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playClick();
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCurrentSrc(result);
          setHasError(false);
          try {
            localStorage.setItem('deva_profile_photo_preview', result);
          } catch {
            // Storage quota exceeded or disabled
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    sound.playClick();
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
      whileHover={{ scale: 1.025, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`relative inline-block select-none group ${className}`}
    >
      {/* Decorative Washi Tape at Top */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-6 bg-amber-200/85 backdrop-blur-xs border-y border-dashed border-amber-400/80 rounded-xs rotate-[2deg] shadow-xs z-30 pointer-events-none flex items-center justify-center">
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
      <div className="relative bg-[#fefaf0] p-3 sm:p-4 pb-5 sm:pb-6 rounded-3xl shadow-[0_20px_45px_-10px_rgba(45,30,15,0.22),0_4px_12px_rgba(0,0,0,0.06)] border-2 border-amber-200/90 ring-1 ring-amber-300/40 w-56 sm:w-64 md:w-72 transition-shadow duration-300 group-hover:shadow-[0_28px_55px_-10px_rgba(45,30,15,0.28)]">
        {/* Inner Photo Window */}
        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/60 border border-amber-300/60 shadow-inner flex flex-col items-center justify-center">
          {/* If Photo is loaded and valid */}
          {!hasError && currentSrc ? (
            <>
              <img
                src={currentSrc}
                alt={name}
                onError={() => setHasError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Glass Glare / Shimmer Effect across photo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Hover overlay with button to change/update photo */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={triggerUpload}
                  className="px-3.5 py-1.5 bg-white/95 hover:bg-white text-slate-900 rounded-xl text-xs font-bold shadow-lg border border-amber-200 cursor-pointer flex items-center gap-1.5 transition-transform hover:scale-105"
                >
                  <span>📷</span>
                  <span>Change Photo</span>
                </button>
              </div>
            </>
          ) : (
            /* Aesthetic Placeholder State (Waiting for User's Photo) */
            <div
              onClick={triggerUpload}
              className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-amber-100/40 transition-colors group/placeholder"
            >
              {/* Dashed Inner Frame */}
              <div className="absolute inset-2.5 rounded-xl border-2 border-dashed border-amber-300/80 pointer-events-none" />

              {/* Silhouette Avatar / Camera Badge */}
              <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-amber-300 border-2 border-white shadow-md flex items-center justify-center text-2xl sm:text-3xl mb-3 group-hover/placeholder:scale-110 transition-transform">
                <span>📸</span>
              </div>

              {/* Friendly Placeholder Caption */}
              <div className="relative z-10 space-y-1">
                <span className="font-serif font-black text-xs sm:text-sm text-stone-800 tracking-wide block uppercase">
                  Your Photo Frame
                </span>
                <p className="text-[11px] font-mono text-amber-800 font-semibold leading-tight">
                  Click to choose a photo
                </p>
                <p className="text-[10px] text-stone-500 italic">
                  or send your picture in chat
                </p>
              </div>

              {/* Upload Badge */}
              <div className="relative z-10 mt-3 inline-flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-[10px] font-bold shadow-xs transition-transform group-hover/placeholder:scale-105">
                <span>+</span>
                <span>Select Image</span>
              </div>
            </div>
          )}

          {/* Hidden File Input for Live Preview Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
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
