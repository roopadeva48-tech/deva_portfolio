import React, { useState, useEffect, useCallback } from 'react';
import { EarthGlobeScene } from './components/canvas/EarthGlobeScene';
import { AnimaticLoader } from './components/ui/AnimaticLoader';
import { IntroHeroOverlay } from './components/ui/IntroHeroOverlay';
import { ProfileShowcase } from './components/ui/ProfileShowcase';
import { LandmarkModal } from './components/ui/LandmarkModal';
import { ContactModal } from './components/ui/ContactModal';
import { HUDControls } from './components/ui/HUDControls';
import {
  fetchProfile,
  fetchProjects,
  fetchLandmarks,
  fallbackLandmarks,
} from './services/api';
import { Landmark, ProfileData, ProjectItem } from './types';
import { sound } from './utils/audio';

export default function App() {
  // Sequence Stages matching the video:
  // 1. 'loading' (hand-drawn envelope animatic loader)
  // 2. 'zooming_in' (globe zooms up from distance into center screen)
  // 3. 'ready' (intro title with "BEGIN" button appears)
  const [introPhase, setIntroPhase] = useState<'loading' | 'zooming_in' | 'ready'>('loading');
  const [showIntroHero, setShowIntroHero] = useState(false);

  // Data State
  const [landmarks, setLandmarks] = useState<Landmark[]>(fallbackLandmarks);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // 3D & UI Interaction State
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLandmarkModalOpen, setIsLandmarkModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Settings & Controls
  const [isAntiGravity, setIsAntiGravity] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [zoomFovOffset, setZoomFovOffset] = useState(0);

  // Load initial data from backend API
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [lData, pData, prjData] = await Promise.all([
          fetchLandmarks(),
          fetchProfile(),
          fetchProjects(),
        ]);
        if (isMounted) {
          if (lData && lData.length > 0) setLandmarks(lData);
          if (pData) setProfile(pData);
          if (prjData) setProjects(prjData);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // When Animatic Loader finishes
  const handleLoaderComplete = useCallback(() => {
    setIntroPhase('zooming_in');
  }, []);

  // When globe zoom-in animation finishes (from video 00:03 - 00:06)
  const handleIntroZoomComplete = useCallback(() => {
    setIntroPhase('ready');
    setShowIntroHero(true);
  }, []);

  // Fallback in case zoom event is delayed
  useEffect(() => {
    if (introPhase === 'zooming_in') {
      const timer = setTimeout(() => {
        setIntroPhase('ready');
        setShowIntroHero(true);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [introPhase]);

  // Handle clicking a landmark in the 3D scene or from the HUD
  const handleSelectLandmark = useCallback((landmark: Landmark) => {
    setSelectedLandmark(landmark);
    setShowIntroHero(false);

    if (landmark.id === 'girl_me') {
      // Zoom camera in to girl and reveal profile
      setTimeout(() => {
        setIsProfileOpen(true);
      }, 700);
    } else if (landmark.id === 'hot_air_balloon') {
      setTimeout(() => {
        setIsContactOpen(true);
      }, 700);
    } else {
      setTimeout(() => {
        setIsLandmarkModalOpen(true);
      }, 700);
    }
  }, []);

  // Zoom Handlers
  const handleZoomIn = useCallback(() => {
    setZoomFovOffset((prev) => Math.max(-14, prev - 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomFovOffset((prev) => Math.min(20, prev + 4));
  }, []);

  // Reset Camera View
  const handleResetView = useCallback(() => {
    setSelectedLandmark(null);
    setZoomFovOffset(0);
    setIsProfileOpen(false);
    setIsLandmarkModalOpen(false);
  }, []);

  // Open Girl's Profile directly
  const handleOpenGirlProfile = useCallback(() => {
    const girl = landmarks.find((l) => l.id === 'girl_me') || fallbackLandmarks[0];
    handleSelectLandmark(girl);
  }, [landmarks, handleSelectLandmark]);

  // Navigate to Projects from inside the profile modal
  const handleNavigateToProjects = useCallback(() => {
    const sky = landmarks.find((l) => l.id === 'skyscrapers');
    if (sky) {
      handleSelectLandmark(sky);
    }
  }, [landmarks, handleSelectLandmark]);

  // Toggle Sound FX
  const handleToggleMute = useCallback(() => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-sky-400">
      {/* 1. Animatic Hand-Drawn Loader matching the video reference (00:00 - 00:02) */}
      {introPhase === 'loading' && (
        <AnimaticLoader onComplete={handleLoaderComplete} />
      )}

      {/* 2. Three.js Realistic Earth Globe Scene matching the user's reference image */}
      <EarthGlobeScene
        landmarks={landmarks}
        selectedLandmark={selectedLandmark}
        onSelectLandmark={handleSelectLandmark}
        isAntiGravity={isAntiGravity}
        isAutoRotate={isAutoRotate}
        introPhase={introPhase}
        onIntroZoomComplete={handleIntroZoomComplete}
        onResetView={handleResetView}
        zoomFovOffset={zoomFovOffset}
      />

      {/* 3. Title / Hero Intro Overlay with the "BEGIN" button (from video 00:06) */}
      {introPhase === 'ready' && showIntroHero && (
        <IntroHeroOverlay
          isVisible={showIntroHero}
          onBegin={() => {
            setShowIntroHero(false);
          }}
          onExploreGirl={handleOpenGirlProfile}
        />
      )}

      {/* 4. Full HUD Controls */}
      {introPhase === 'ready' && !showIntroHero && (
        <HUDControls
          landmarks={landmarks}
          selectedLandmark={selectedLandmark}
          onSelectLandmark={handleSelectLandmark}
          onResetView={handleResetView}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          isAntiGravity={isAntiGravity}
          onToggleAntiGravity={() => setIsAntiGravity((prev) => !prev)}
          isAutoRotate={isAutoRotate}
          onToggleAutoRotate={() => setIsAutoRotate((prev) => !prev)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenProfile={handleOpenGirlProfile}
          onOpenContact={() => setIsContactOpen(true)}
          onShowTitleMatrix={() => setShowIntroHero(true)}
        />
      )}

      {/* 5. Profile Showcase for the Girl on the Suitcase */}
      <ProfileShowcase
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedLandmark(null);
        }}
        profile={profile}
        onNavigateToProjects={handleNavigateToProjects}
        onOpenContact={() => {
          setIsProfileOpen(false);
          setIsContactOpen(true);
        }}
      />

      {/* 6. Detail Modal for other landmarks (Skyscrapers, House, Rocket, Crane) */}
      <LandmarkModal
        landmark={selectedLandmark}
        isOpen={isLandmarkModalOpen}
        onClose={() => {
          setIsLandmarkModalOpen(false);
          setSelectedLandmark(null);
        }}
        projects={projects}
        onOpenContact={() => {
          setIsLandmarkModalOpen(false);
          setIsContactOpen(true);
        }}
        onSwitchLandmark={(id) => {
          const target = landmarks.find((l) => l.id === id);
          if (target) {
            setIsLandmarkModalOpen(false);
            handleSelectLandmark(target);
          }
        }}
        onToggleAntiGravity={() => setIsAntiGravity((prev) => !prev)}
        isAntiGravity={isAntiGravity}
      />

      {/* 7. Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
