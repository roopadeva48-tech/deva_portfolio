import React, { useState, useEffect, useCallback } from 'react';
import { EarthGlobeScene } from './components/canvas/EarthGlobeScene';
import { CertificateGallery3D } from './components/canvas/CertificateGallery3D';
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
  fetchCertificates,
  fallbackLandmarks,
  fallbackCertificates,
} from './services/api';
import { Landmark, ProfileData, ProjectItem, CertificateItem } from './types';
import { sound } from './utils/audio';

// Helper to parse URL path into a typed route structure
function parsePath(pathname: string): {
  type: 'home' | 'profile' | 'certificates' | 'projects' | 'landmark' | 'contact';
  id?: string | null;
} {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '') return { type: 'home' };
  if (clean === '/profile' || clean === '/about' || clean === '/me') return { type: 'profile' };
  if (clean === '/certificates' || clean === '/certifications' || clean === '/gallery') {
    return { type: 'certificates', id: null };
  }
  if (clean.startsWith('/certificates/') || clean.startsWith('/certifications/')) {
    const parts = clean.split('/');
    return { type: 'certificates', id: parts[2] || null };
  }
  if (clean === '/projects' || clean === '/works' || clean === '/portfolio') {
    return { type: 'projects' };
  }
  if (clean === '/contact' || clean === '/message' || clean === '/transmission') {
    return { type: 'contact' };
  }
  if (clean.startsWith('/landmarks/')) {
    const lId = clean.split('/')[2];
    if (lId === 'girl_me') return { type: 'profile' };
    if (lId === 'cozy_house') return { type: 'certificates', id: null };
    if (lId === 'hot_air_balloon') return { type: 'contact' };
    if (lId === 'skyscrapers') return { type: 'projects' };
    return { type: 'landmark', id: lId };
  }
  return { type: 'home' };
}

export default function App() {
  // Sequence Stages:
  // 1. 'loading' (hand-drawn envelope animatic loader)
  // 2. 'zooming_in' (globe zooms up from distance into center screen)
  // 3. 'ready' (intro title with "BEGIN" button appears)
  const [introPhase, setIntroPhase] = useState<'loading' | 'zooming_in' | 'ready'>('loading');
  const [showIntroHero, setShowIntroHero] = useState(false);

  // Data State
  const [landmarks, setLandmarks] = useState<Landmark[]>(fallbackLandmarks);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>(fallbackCertificates);

  // 3D & UI Interaction State
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCertGalleryOpen, setIsCertGalleryOpen] = useState(false);
  const [activeCertId, setActiveCertId] = useState<string | null>(null);
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
        const [lData, pData, prjData, cData] = await Promise.all([
          fetchLandmarks(),
          fetchProfile(),
          fetchProjects(),
          fetchCertificates(),
        ]);
        if (isMounted) {
          if (lData && lData.length > 0) setLandmarks(lData);
          if (pData) setProfile(pData);
          if (prjData) setProjects(prjData);
          if (cData && cData.length > 0) setCertificates(cData);
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

  // Update view state and page title based on URL route
  const applyRoute = useCallback(
    (pathname: string) => {
      const route = parsePath(pathname);

      // Dynamic Title
      switch (route.type) {
        case 'profile':
          document.title = 'Profile & Story — devaroopa';
          break;
        case 'certificates':
          document.title = route.id
            ? `Certificate: ${route.id} — devaroopa`
            : 'Interactive 3D Hallway & Certifications — devaroopa';
          break;
        case 'projects':
          document.title = 'Featured Projects & Systems — devaroopa';
          break;
        case 'landmark':
          document.title = `Landmark: ${route.id} — devaroopa`;
          break;
        case 'contact':
          document.title = 'Satellite Transmission / Contact — devaroopa';
          break;
        case 'home':
        default:
          document.title = 'devaroopa — 3D Spatial & Creative Engineering Portfolio';
          break;
      }

      if (route.type === 'home') {
        setIsProfileOpen(false);
        setIsCertGalleryOpen(false);
        setActiveCertId(null);
        setIsLandmarkModalOpen(false);
        setIsContactOpen(false);
        setSelectedLandmark(null);
      } else if (route.type === 'profile') {
        setIsProfileOpen(true);
        setIsCertGalleryOpen(false);
        setActiveCertId(null);
        setIsLandmarkModalOpen(false);
        setIsContactOpen(false);
        const girl = landmarks.find((l) => l.id === 'girl_me') || fallbackLandmarks[0];
        setSelectedLandmark(girl);
        setShowIntroHero(false);
      } else if (route.type === 'certificates') {
        setIsCertGalleryOpen(true);
        setActiveCertId(route.id || null);
        setIsProfileOpen(false);
        setIsLandmarkModalOpen(false);
        setIsContactOpen(false);
        const house = landmarks.find((l) => l.id === 'cozy_house') || fallbackLandmarks[1];
        setSelectedLandmark(house);
        setShowIntroHero(false);
      } else if (route.type === 'projects') {
        const sky = landmarks.find((l) => l.id === 'skyscrapers') || fallbackLandmarks[2];
        setSelectedLandmark(sky);
        setIsLandmarkModalOpen(true);
        setIsProfileOpen(false);
        setIsCertGalleryOpen(false);
        setActiveCertId(null);
        setIsContactOpen(false);
        setShowIntroHero(false);
      } else if (route.type === 'landmark') {
        const lmk = landmarks.find((l) => l.id === route.id) || null;
        setSelectedLandmark(lmk);
        setIsLandmarkModalOpen(true);
        setIsProfileOpen(false);
        setIsCertGalleryOpen(false);
        setActiveCertId(null);
        setIsContactOpen(false);
        setShowIntroHero(false);
      } else if (route.type === 'contact') {
        const balloon = landmarks.find((l) => l.id === 'hot_air_balloon') || null;
        setSelectedLandmark(balloon);
        setIsContactOpen(true);
        setIsProfileOpen(false);
        setIsCertGalleryOpen(false);
        setActiveCertId(null);
        setIsLandmarkModalOpen(false);
        setShowIntroHero(false);
      }
    },
    [landmarks]
  );

  // Seamless forward navigation updating URL and state
  const navigateTo = useCallback(
    (targetPath: string) => {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ path: targetPath }, '', targetPath);
      }
      applyRoute(targetPath);
    },
    [applyRoute]
  );

  // Navigate back to the previous stage without leaving the website
  const navigateBack = useCallback(() => {
    sound.playClick();
    if (window.location.pathname !== '/') {
      window.history.back();
    } else {
      applyRoute('/');
    }
  }, [applyRoute]);

  // URL routing synchronization and browser history stack protection
  useEffect(() => {
    const initialPath = window.location.pathname;

    // Guard history stack so back button moves to previous stage and does not exit the site
    if (initialPath !== '/') {
      // Seed root in history stack before current deep URL
      window.history.replaceState({ path: '/' }, '', '/');
      window.history.pushState({ path: initialPath }, '', initialPath);
      // Skip intro envelope loader if directly deep-linked to a specific page
      setIntroPhase('ready');
      setShowIntroHero(false);
      applyRoute(initialPath);
    } else {
      window.history.replaceState({ path: '/' }, '', '/');
    }

    // Listen to browser Back / Forward events
    const handlePopState = () => {
      const targetPath = window.location.pathname;
      applyRoute(targetPath);
      // Keep root securely inside website
      if (targetPath === '/') {
        window.history.replaceState({ path: '/' }, '', '/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [applyRoute]);

  // Handle certificate room change inside 3D hallway gallery
  const handleCertRoomChange = useCallback(
    (certId: string | null) => {
      if (certId) {
        const newPath = `/certificates/${certId}`;
        if (window.location.pathname !== newPath) {
          window.history.pushState({ path: newPath }, '', newPath);
          applyRoute(newPath);
        }
      } else {
        // Exiting room back to hallway
        if (window.location.pathname.startsWith('/certificates/')) {
          window.history.back();
        } else {
          const hallwayPath = '/certificates';
          if (window.location.pathname !== hallwayPath) {
            window.history.pushState({ path: hallwayPath }, '', hallwayPath);
            applyRoute(hallwayPath);
          }
        }
      }
    },
    [applyRoute]
  );

  // When Animatic Loader finishes
  const handleLoaderComplete = useCallback(() => {
    setIntroPhase('zooming_in');
  }, []);

  // When globe zoom-in animation finishes
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
  const handleSelectLandmark = useCallback(
    (landmark: Landmark) => {
      setSelectedLandmark(landmark);
      setShowIntroHero(false);

      if (landmark.id === 'girl_me') {
        setTimeout(() => {
          navigateTo('/profile');
        }, 700);
      } else if (landmark.id === 'cozy_house') {
        setTimeout(() => {
          navigateTo('/certificates');
        }, 700);
      } else if (landmark.id === 'hot_air_balloon') {
        setTimeout(() => {
          navigateTo('/contact');
        }, 700);
      } else if (landmark.id === 'skyscrapers') {
        setTimeout(() => {
          navigateTo('/projects');
        }, 700);
      } else {
        setTimeout(() => {
          navigateTo(`/landmarks/${landmark.id}`);
        }, 700);
      }
    },
    [navigateTo]
  );

  // Zoom Handlers
  const handleZoomIn = useCallback(() => {
    setZoomFovOffset((prev) => Math.max(-14, prev - 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomFovOffset((prev) => Math.min(20, prev + 4));
  }, []);

  // Reset Camera View to root
  const handleResetView = useCallback(() => {
    navigateTo('/');
    setZoomFovOffset(0);
  }, [navigateTo]);

  // Open Girl's Profile directly
  const handleOpenGirlProfile = useCallback(() => {
    navigateTo('/profile');
  }, [navigateTo]);

  // Navigate to Projects from inside the profile modal
  const handleNavigateToProjects = useCallback(() => {
    navigateTo('/projects');
  }, [navigateTo]);

  // Toggle Sound FX
  const handleToggleMute = useCallback(() => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-sky-400">
      {/* 1. Animatic Hand-Drawn Loader */}
      {introPhase === 'loading' && (
        <AnimaticLoader onComplete={handleLoaderComplete} />
      )}

      {/* 2. Three.js Realistic Earth Globe Scene */}
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
        isPaused={isProfileOpen || isCertGalleryOpen || isLandmarkModalOpen || isContactOpen}
      />

      {/* 3. Title / Hero Intro Overlay with the "BEGIN" button */}
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
          onOpenContact={() => navigateTo('/contact')}
          onShowTitleMatrix={() => setShowIntroHero(true)}
        />
      )}

      {/* 5. Profile Showcase for the Girl on the Suitcase */}
      <ProfileShowcase
        isOpen={isProfileOpen}
        onClose={navigateBack}
        profile={profile}
        onNavigateToProjects={handleNavigateToProjects}
        onOpenContact={() => navigateTo('/contact')}
      />

      {/* 6. Interactive 3D Hallway Certificate Gallery */}
      <CertificateGallery3D
        isOpen={isCertGalleryOpen}
        onClose={navigateBack}
        certificates={certificates}
        activeCertId={activeCertId}
        onRoomChange={handleCertRoomChange}
      />

      {/* 7. Detail Modal for other landmarks (Skyscrapers, Rocket, Crane) */}
      <LandmarkModal
        landmark={selectedLandmark}
        isOpen={isLandmarkModalOpen}
        onClose={navigateBack}
        projects={projects}
        onOpenContact={() => navigateTo('/contact')}
        onSwitchLandmark={(id) => {
          if (id === 'skyscrapers') {
            navigateTo('/projects');
          } else {
            navigateTo(`/landmarks/${id}`);
          }
        }}
        onToggleAntiGravity={() => setIsAntiGravity((prev) => !prev)}
        isAntiGravity={isAntiGravity}
      />

      {/* 8. Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={navigateBack}
      />
    </div>
  );
}
