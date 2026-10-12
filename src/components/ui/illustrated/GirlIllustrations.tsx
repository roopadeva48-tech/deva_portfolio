import React from 'react';
import { motion } from 'motion/react';

/**
 * High-fidelity animated SVG illustrations matching the reference video style:
 * - Cute girl character with high ponytail, orange/yellow top, denim pants
 * - Smooth breathing, blinking, and gesture animations
 */

// 1. Girl Writing "Deva" with animated pencil and arm
export const WritingGirlCharacter: React.FC<{
  onPencilClick?: () => void;
  className?: string;
}> = ({ onPencilClick, className = '' }) => {
  return (
    <motion.div
      className={`relative select-none ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        viewBox="0 0 280 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="40%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="denimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Ambient Floor Shadow */}
        <ellipse cx="140" cy="330" rx="65" ry="8" fill="#e2e8f0" opacity="0.7" />

        {/* Floating Ink Sparkles around pen */}
        <motion.g
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.4, 0.9, 0.4],
            rotate: [0, 15, -15, 0],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M255 125 L258 120 L261 125 L266 128 L261 131 L258 136 L255 131 L250 128 Z" fill="#f59e0b" />
          <path d="M240 90 L242 86 L244 90 L248 92 L244 94 L242 98 L240 94 L236 92 Z" fill="#fb923c" />
          <path d="M268 150 L270 146 L272 150 L276 152 L272 154 L270 158 L268 154 L264 152 Z" fill="#38bdf8" />
        </motion.g>

        {/* Character Base & Gentle Breathing Group */}
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Ponytail Back Volume */}
          <path
            d="M80 65 C55 35, 30 70, 42 120 C50 155, 75 160, 85 140 C92 125, 88 95, 80 65 Z"
            fill="url(#hairGrad)"
          />
          {/* Hair Tie / Scrunchie */}
          <ellipse cx="88" cy="72" rx="9" ry="12" fill="#f59e0b" transform="rotate(-25 88 72)" />
          <ellipse cx="88" cy="72" rx="6" ry="9" fill="#fbbf24" transform="rotate(-25 88 72)" />

          {/* Legs & Denim Jeans */}
          <path d="M115 250 L112 320 Q112 326 122 326 L128 326 Q134 326 134 320 L136 250 Z" fill="url(#denimGrad)" />
          <path d="M144 250 L146 320 Q146 326 156 326 L162 326 Q168 326 168 320 L165 250 Z" fill="url(#denimGrad)" />
          {/* Cute White Sneakers */}
          <path d="M106 320 Q106 328 124 328 L136 328 Q140 328 140 322 Q136 318 126 318 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M142 320 Q142 328 160 328 L172 328 Q176 328 176 322 Q172 318 162 318 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="112" y1="324" x2="128" y2="324" stroke="#f97316" strokeWidth="2" />
          <line x1="148" y1="324" x2="164" y2="324" stroke="#f97316" strokeWidth="2" />

          {/* Denim Shorts/Pants Waist */}
          <path
            d="M105 210 Q140 216 175 210 L178 255 Q140 262 102 255 Z"
            fill="url(#denimGrad)"
          />
          {/* Pocket stitching */}
          <path d="M112 222 Q120 236 128 222" stroke="#93c5fd" strokeWidth="1.5" fill="none" strokeDasharray="2 2" />
          <path d="M152 222 Q160 236 168 222" stroke="#93c5fd" strokeWidth="1.5" fill="none" strokeDasharray="2 2" />

          {/* Torso & Warm Mustard/Orange T-Shirt */}
          <path
            d="M100 135 Q140 130 180 135 L176 218 Q140 224 104 218 Z"
            fill="url(#shirtGrad)"
            filter="url(#shadowFilter)"
          />
          {/* Left Arm (Relaxed or Hand on Hip) */}
          <path
            d="M102 138 Q82 165 86 195 Q90 205 98 202 Q105 198 104 185 Q102 168 114 148 Z"
            fill="url(#shirtGrad)"
          />
          {/* Left Hand resting on hip */}
          <ellipse cx="94" cy="205" rx="7" ry="9" fill="#fcd34d" transform="rotate(15 94 205)" />

          {/* Neck */}
          <rect x="132" y="112" width="16" height="26" rx="6" fill="#fcd34d" />
          {/* T-shirt Collar */}
          <path d="M126 135 Q140 144 154 135" stroke="#ea580c" strokeWidth="3" fill="none" />

          {/* Cute Head & Face */}
          <g>
            {/* Face base */}
            <path
              d="M112 70 Q140 58 168 70 Q176 96 165 120 Q140 134 115 120 Q104 96 112 70 Z"
              fill="#fef08a"
            />
            {/* Gentle Warm Skin Contour */}
            <path
              d="M114 74 Q140 64 166 74 Q172 96 162 118 Q140 130 118 118 Q108 96 114 74 Z"
              fill="#fde68a"
            />
            {/* Left Ear */}
            <ellipse cx="110" cy="94" rx="5" ry="8" fill="#fde68a" />
            {/* Right Ear */}
            <ellipse cx="170" cy="94" rx="5" ry="8" fill="#fde68a" />

            {/* Rosy Cheeks */}
            <ellipse cx="122" cy="104" rx="7" ry="4" fill="#fb7185" opacity="0.5" />
            <ellipse cx="158" cy="104" rx="7" ry="4" fill="#fb7185" opacity="0.5" />

            {/* Animated Eyes (Blinking) */}
            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.9, 0.94, 0.98, 1] }}
              style={{ originY: '95px' }}
            >
              {/* Left Eye */}
              <circle cx="126" cy="92" r="5" fill="#0f172a" />
              <circle cx="124.5" cy="90.5" r="1.8" fill="#ffffff" />
              <path d="M120 85 Q126 82 132 86" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Right Eye */}
              <circle cx="154" cy="92" r="5" fill="#0f172a" />
              <circle cx="152.5" cy="90.5" r="1.8" fill="#ffffff" />
              <path d="M148 85 Q154 82 160 86" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
            </motion.g>

            {/* Cute Smile */}
            <path
              d="M134 106 Q140 114 146 106"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cute Little Nose */}
            <circle cx="140" cy="99" r="1.5" fill="#d97706" />

            {/* Front Bangs & Chic Hair Framing */}
            <path
              d="M108 72 Q130 50 172 70 Q168 85 158 84 Q146 64 128 82 Q118 84 108 72 Z"
              fill="url(#hairGrad)"
            />
            <path
              d="M106 72 Q108 92 114 102 Q112 88 114 76 Z"
              fill="url(#hairGrad)"
            />
          </g>

          {/* Right Arm Holding Pencil — Animated Writing Motion */}
          <motion.g
            animate={{
              rotate: [0, 4, -3, 2, 0],
              x: [0, 4, -2, 3, 0],
              y: [0, -3, 2, -2, 0],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '175px', originY: '145px' }}
          >
            {/* Shoulder to elbow sleeve */}
            <path
              d="M176 138 Q202 145 215 162 Q210 172 198 168 Q185 158 174 150 Z"
              fill="url(#shirtGrad)"
            />
            {/* Forearm extending towards text */}
            <path
              d="M208 164 Q228 152 246 138 Q250 146 238 156 Q220 172 204 172 Z"
              fill="#fcd34d"
            />
            {/* Hand holding pencil */}
            <ellipse cx="244" cy="142" rx="7" ry="6" fill="#fcd34d" transform="rotate(-15 244 142)" />
            {/* Pencil/Stylus */}
            <g transform="rotate(-35 246 140)">
              {/* Pencil Body */}
              <rect x="238" y="110" width="8" height="42" rx="2" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
              {/* Eraser End */}
              <rect x="238" y="105" width="8" height="7" rx="1.5" fill="#f43f5e" />
              <rect x="238" y="112" width="8" height="3" fill="#cbd5e1" />
              {/* Sharp Pencil Tip */}
              <polygon points="238,152 246,152 242,164" fill="#fde68a" stroke="#78350f" strokeWidth="0.8" />
              <polygon points="240.5,159 243.5,159 242,164" fill="#0f172a" />
            </g>
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};

// 2. Girl Relaxing in Beanbag Chair with Laptop (Matches Frame 8s from video)
export const BeanbagGirlIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      className={`relative select-none ${className}`}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <svg
        viewBox="0 0 340 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="beanbagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* Ambient Floor Shadow */}
        <ellipse cx="170" cy="265" rx="110" ry="12" fill="#cbd5e1" opacity="0.6" />

        {/* Large Fluffy Orange/Red Beanbag Chair */}
        <path
          d="M90 200 C60 160 80 100 130 90 C180 80 230 100 250 140 C270 180 250 240 190 255 C140 265 100 240 90 200 Z"
          fill="url(#beanbagGrad)"
          stroke="#b91c1c"
          strokeWidth="3"
        />
        {/* Beanbag Fabric Folds & Stitches */}
        <path d="M120 120 Q160 140 190 130" stroke="#fca5a5" strokeWidth="2.5" fill="none" opacity="0.7" />
        <path d="M100 170 Q140 190 210 180" stroke="#b91c1c" strokeWidth="2" fill="none" opacity="0.8" />
        <path d="M130 220 Q170 235 220 220" stroke="#991b1b" strokeWidth="2" fill="none" opacity="0.8" />

        {/* Character Curled Up Inside Beanbag */}
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Relaxed Ponytail */}
          <path d="M135 60 C110 40 95 70 105 100 C112 118 130 115 135 95 Z" fill="#0f172a" />
          <ellipse cx="138" cy="66" rx="6" ry="8" fill="#f59e0b" transform="rotate(-20 138 66)" />

          {/* Head & Face */}
          <path d="M140 68 Q160 55 180 65 Q188 85 178 105 Q160 115 142 105 Q135 85 140 68 Z" fill="#fef08a" />
          <ellipse cx="148" cy="92" rx="5" ry="3" fill="#fb7185" opacity="0.5" />
          <ellipse cx="172" cy="90" rx="5" ry="3" fill="#fb7185" opacity="0.5" />
          {/* Eyes Focused Happily on Laptop */}
          <path d="M148 84 Q154 88 158 84" stroke="#0f172a" strokeWidth="2" fill="none" />
          <path d="M166 82 Q172 86 176 82" stroke="#0f172a" strokeWidth="2" fill="none" />
          <path d="M156 96 Q162 102 168 96" stroke="#0f172a" strokeWidth="2" fill="none" />

          {/* Dark Front Hair */}
          <path d="M140 66 Q158 50 182 66 Q178 78 168 76 Q158 64 144 76 Z" fill="#0f172a" />

          {/* Comfy Mustard T-shirt & Upper Body */}
          <path d="M142 105 Q175 100 200 110 L195 160 Q160 165 135 155 Z" fill="#f97316" />

          {/* Crossed/Curled Denim Legs */}
          <path d="M135 155 Q130 190 160 200 Q200 210 220 180 Q225 155 195 160 Z" fill="#0284c7" />

          {/* Open Laptop on Lap with Glowing Code Screen */}
          <g transform="translate(160, 130)">
            {/* Screen Back */}
            <polygon points="10,0 52,-15 50,30 8,45" fill="#475569" />
            {/* Glowing Screen Face */}
            <polygon points="12,2 50,-12 48,28 10,42" fill="#0284c7" />
            <polygon points="14,4 48,-10 46,26 12,40" fill="#38bdf8" opacity="0.9" />
            {/* Code lines on screen */}
            <line x1="16" y1="12" x2="38" y2="4" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="16" y1="18" x2="44" y2="8" stroke="#fef08a" strokeWidth="1.5" />
            <line x1="18" y1="24" x2="34" y2="18" stroke="#ffffff" strokeWidth="1.5" />
            {/* Keyboard Base */}
            <polygon points="8,45 50,30 75,50 32,65" fill="url(#laptopGrad)" stroke="#334155" strokeWidth="1" />
          </g>

          {/* Hands Resting on Keyboard */}
          <ellipse cx="192" cy="165" rx="6" ry="5" fill="#fcd34d" />
          <ellipse cx="204" cy="162" rx="6" ry="5" fill="#fcd34d" />

          {/* Cute Coffee Mug on the Side */}
          <g transform="translate(240, 195)">
            <rect x="0" y="8" width="18" height="22" rx="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            <path d="M18 14 Q26 18 18 24" stroke="#ca8a04" strokeWidth="2" fill="none" />
            {/* Coffee steam */}
            <motion.path
              d="M6 4 Q9 0 6 -4 Q3 -8 6 -12"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              animate={{ y: [-2, -8], opacity: [0.8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />
          </g>
        </motion.g>
      </svg>
    </motion.div>
  );
};

// 3. Girl Juggling / Balancing on Unicycle (Matches Frame 12s "Tools I'm Fluent In")
export const JugglingGirlIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      className={`relative select-none ${className}`}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <svg
        viewBox="0 0 300 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="juggleShirt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>

        {/* Ambient Floor Shadow */}
        <ellipse cx="150" cy="305" rx="50" ry="7" fill="#cbd5e1" opacity="0.6" />

        {/* Playful Floating Tech Badges (Juggling in Arc) */}
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Three.js / 3D Ball */}
          <g transform="translate(70, 40)">
            <circle cx="15" cy="15" r="16" fill="#0f172a" />
            <text x="15" y="20" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">▲</text>
          </g>
          {/* React 19 Ball */}
          <g transform="translate(110, 15)">
            <circle cx="15" cy="15" r="16" fill="#0284c7" />
            <text x="15" y="20" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">⚛</text>
          </g>
          {/* Blender / 3D Art Ball */}
          <g transform="translate(160, 15)">
            <circle cx="15" cy="15" r="16" fill="#ea580c" />
            <text x="15" y="20" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">🎨</text>
          </g>
          {/* TypeScript / WebGL Ball */}
          <g transform="translate(205, 45)">
            <circle cx="15" cy="15" r="16" fill="#3b82f6" />
            <text x="15" y="20" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">TS</text>
          </g>
        </motion.g>

        {/* Character Balancing on Unicycle */}
        <motion.g
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '150px', originY: '270px' }}
        >
          {/* Unicycle Wheel */}
          <circle cx="150" cy="270" r="30" fill="none" stroke="#334155" strokeWidth="6" />
          <circle cx="150" cy="270" r="4" fill="#0f172a" />
          {/* Spokes */}
          <line x1="150" y1="240" x2="150" y2="300" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="120" y1="270" x2="180" y2="270" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="129" y1="249" x2="171" y2="291" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="129" y1="291" x2="171" y2="249" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Unicycle Fork & Pedals */}
          <line x1="150" y1="270" x2="150" y2="210" stroke="#475569" strokeWidth="5" />
          <rect x="135" y="205" width="30" height="7" rx="3" fill="#0f172a" />

          {/* Legs pedaling */}
          <path d="M142 165 L136 210 L130 220" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M158 165 L164 210 L170 215" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Sneakers */}
          <ellipse cx="128" cy="223" rx="8" ry="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <ellipse cx="172" cy="218" rx="8" ry="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Torso & Orange Shirt */}
          <path d="M135 115 Q150 110 165 115 L162 170 Q150 174 138 170 Z" fill="url(#juggleShirt)" />

          {/* Arms Reaching Up Juggling */}
          <path d="M136 120 Q105 95 95 65" stroke="#fcd34d" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="95" cy="63" r="5" fill="#fcd34d" />
          <path d="M164 120 Q195 95 205 65" stroke="#fcd34d" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="205" cy="63" r="5" fill="#fcd34d" />

          {/* Head & Smiling Face */}
          <g>
            {/* Ponytail */}
            <path d="M125 50 C100 30 85 60 95 85 C102 100 120 95 125 75 Z" fill="#0f172a" />
            <ellipse cx="128" cy="54" rx="5" ry="7" fill="#f59e0b" transform="rotate(-20 128 54)" />

            <path d="M132 58 Q150 48 168 58 Q174 78 164 94 Q150 104 134 94 Q126 78 132 58 Z" fill="#fef08a" />
            <ellipse cx="140" cy="80" rx="5" ry="3" fill="#fb7185" opacity="0.5" />
            <ellipse cx="160" cy="80" rx="5" ry="3" fill="#fb7185" opacity="0.5" />
            {/* Big confident winking smile */}
            <path d="M138 72 Q144 68 148 72" stroke="#0f172a" strokeWidth="2" fill="none" />
            <circle cx="158" cy="72" r="3.5" fill="#0f172a" />
            <circle cx="157" cy="71" r="1" fill="#ffffff" />
            <path d="M144 84 Q150 90 156 84" stroke="#0f172a" strokeWidth="2.5" fill="none" />
            {/* Bangs */}
            <path d="M132 56 Q150 42 170 56 Q165 66 156 64 Q146 54 136 64 Z" fill="#0f172a" />
          </g>
        </motion.g>
      </svg>
    </motion.div>
  );
};
