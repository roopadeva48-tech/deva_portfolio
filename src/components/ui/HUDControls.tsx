import React from 'react';
import { Landmark, LandmarkId } from '../../types';
import { sound } from '../../utils/audio';

interface HUDControlsProps {
  landmarks: Landmark[];
  selectedLandmark: Landmark | null;
  onSelectLandmark: (landmark: Landmark) => void;
  onResetView: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  isAntiGravity: boolean;
  onToggleAntiGravity: () => void;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenProfile: () => void;
  onOpenContact: () => void;
  onShowTitleMatrix?: () => void;
}

export const HUDControls: React.FC<HUDControlsProps> = ({
  landmarks,
  selectedLandmark,
  onSelectLandmark,
  onResetView,
  onZoomIn,
  onZoomOut,
  isAntiGravity,
  onToggleAntiGravity,
  isAutoRotate,
  onToggleAutoRotate,
  isMuted,
  onToggleMute,
  onOpenProfile,
  onOpenContact,
  onShowTitleMatrix,
}) => {
  const getIconForLandmark = (id: LandmarkId) => {
    switch (id) {
      case 'girl_me':
        return '👩‍💻';
      case 'skyscrapers':
        return '🏢';
      case 'cozy_house':
        return '🏡';
      case 'rocket':
        return '🚀';
      case 'crane':
        return '🏗️';
      case 'hot_air_balloon':
        return '🎈';
      default:
        return '📍';
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        {/* Brand Kicker */}
        <div
          onClick={() => {
            sound.playChime();
            onOpenProfile();
          }}
          className="cursor-pointer group flex items-center gap-2.5 px-3.5 py-2 bg-white/90 hover:bg-white backdrop-blur-md rounded-xl border border-slate-900/10 shadow-sm transition-all"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-left">
            <div className="text-xs font-bold tracking-wider text-slate-900 group-hover:text-teal-800 transition-colors">
              ROOPA DEVA
            </div>
            <div className="text-[10px] text-slate-600 font-mono">
              Lead 3D Architect · Girl on Globe
            </div>
          </div>
        </div>

        {/* Global Action Utility Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Anti-Gravity Toggle Button */}
          <button
            onClick={() => {
              sound.playAntiGravity();
              onToggleAntiGravity();
            }}
            title="Toggle Anti-Gravity Zero-G Float Physics"
            className={`px-3 py-2 text-xs font-bold rounded-xl border shadow-sm transition-all flex items-center gap-1.5 ${
              isAntiGravity
                ? 'bg-amber-400 text-slate-950 border-amber-500 ring-2 ring-amber-300 animate-pulse'
                : 'bg-white/90 hover:bg-white text-slate-800 border-white/80'
            }`}
          >
            <span>🪐</span>
            <span className="hidden sm:inline">Anti-Gravity</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/10">
              {isAntiGravity ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleAutoRotate();
            }}
            title="Toggle Auto-Spin"
            className={`p-2 sm:px-3 text-xs font-medium rounded-xl border shadow-sm transition-all flex items-center gap-1.5 ${
              isAutoRotate
                ? 'bg-teal-50 text-teal-900 border-teal-300'
                : 'bg-white/90 hover:bg-white text-slate-700 border-white/80'
            }`}
          >
            <span className={isAutoRotate ? 'animate-spin' : ''}>🔄</span>
            <span className="hidden md:inline">Spin</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            className="p-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl border border-white/80 shadow-sm transition-all text-xs"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Zoom Out & Zoom In Controls */}
          <div className="flex items-center bg-white/90 rounded-xl border border-white/80 shadow-sm overflow-hidden">
            <button
              onClick={() => {
                sound.playClick();
                if (onZoomOut) onZoomOut();
              }}
              title="Zoom Out Globe (Wider View)"
              className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-800 transition-colors text-xs font-bold"
            >
              🔍−
            </button>
            <div className="w-[1px] h-3 bg-slate-200" />
            <button
              onClick={() => {
                sound.playClick();
                if (onZoomIn) onZoomIn();
              }}
              title="Zoom In Globe"
              className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-800 transition-colors text-xs font-bold"
            >
              🔍+
            </button>
          </div>

          {/* Reset View Button */}
          <button
            onClick={() => {
              sound.playClick();
              onResetView();
            }}
            title="Reset Camera to Overview"
            className="p-2 sm:px-3 bg-white/90 hover:bg-white text-slate-800 rounded-xl border border-white/80 shadow-sm transition-all text-xs font-medium"
          >
            Reset
          </button>

          {/* Direct Profile Button */}
          <button
            onClick={() => {
              sound.playChime();
              onOpenProfile();
            }}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-all text-xs font-semibold"
          >
            Profile
          </button>

          {/* 3x5 Matrix Title Button */}
          {onShowTitleMatrix && (
            <button
              onClick={() => {
                sound.playClick();
                onShowTitleMatrix();
              }}
              title="Show 3×5 Matrix Title Screen"
              className="px-2.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl border border-amber-500 shadow-sm transition-all text-xs font-bold"
            >
              3×5 Matrix
            </button>
          )}
        </div>
      </div>

      {/* Bottom Landmark Compass & Exploration Tray */}
      <div className="w-full flex flex-col items-center gap-2 pointer-events-auto">
        <div className="text-[11px] font-medium text-slate-800 bg-white/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-slate-900/10 shadow-sm">
          💡 Drag to rotate diorama · Scroll to zoom · Click Girl on suitcase to open profile
        </div>

        {/* Landmark Quick Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl max-w-full overflow-x-auto">
          {landmarks.map((landmark) => {
            const isSelected = selectedLandmark?.id === landmark.id;
            return (
              <button
                key={landmark.id}
                onClick={() => {
                  sound.playClick();
                  onSelectLandmark(landmark);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{getIconForLandmark(landmark.id)}</span>
                <span className="hidden sm:inline">
                  {landmark.id === 'girl_me' ? 'Roopa (Me)' : landmark.name.split(' ')[0]}
                </span>
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-white/20 mx-1 hidden sm:block" />

          <button
            onClick={() => {
              sound.playClick();
              onOpenContact();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 whitespace-nowrap transition-all shadow-sm"
          >
            ✉ Contact
          </button>
        </div>
      </div>
    </div>
  );
};
