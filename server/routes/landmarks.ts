import { Router, Request, Response } from 'express';

export const landmarksRouter = Router();

export interface LandmarkInfo {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  fov: number;
  highlightAction: string;
  modalTarget: 'profile' | 'projects' | 'about' | 'skills' | 'experiments' | 'contact';
  statsBadge: string;
  details: {
    title: string;
    items: string[];
  };
}

const landmarksData: LandmarkInfo[] = [
  {
    id: 'girl_me',
    name: 'devaroopa (Creator Profile)',
    category: 'About Me',
    tagline: 'Sitting atop the world on a suitcase, dreaming up spatial experiences.',
    description: 'Welcome to my world! Click me to zoom in and unveil my complete creative background, technical capabilities, experience timeline, and passions.',
    cameraPosition: [0, 4.0, 5.2],
    cameraTarget: [0, 3.0, 0],
    fov: 38,
    highlightAction: 'Open Profile Showcase',
    modalTarget: 'profile',
    statsBadge: 'Lead 3D Architect',
    details: {
      title: 'Quick Snapshot',
      items: [
        'Creative Technologist & Spatial Frontend Specialist',
        'Expert in Three.js, React 19, Framer Motion & Node.js',
        'Passionate about tactile animatics and spatial physics'
      ]
    }
  },
  {
    id: 'skyscrapers',
    name: 'Skyline Studios (Projects)',
    category: 'Works & Architecture',
    tagline: 'High-rise architectural blocks & commercial 3D installations.',
    description: 'Towering geometric architectural structures representing full-scale commercial builds, client productions, and enterprise spatial toolkits.',
    cameraPosition: [-5.4, 1.2, 4.4],
    cameraTarget: [-2.6, 0.4, 0],
    fov: 42,
    highlightAction: 'View All Projects',
    modalTarget: 'projects',
    statsBadge: '35+ Works Shipped',
    details: {
      title: 'Studio Highlights',
      items: [
        'Anti-Gravity Physics Sandbox (120 FPS Web Workers)',
        'Orbit City: Curvature Architectural Studio',
        'Pulsar 3D Spatial Design System & UI Kit'
      ]
    }
  },
  {
    id: 'cozy_house',
    name: 'The Creative Haven (Story & Life)',
    category: 'Philosophy & Story',
    tagline: 'A warm red-roofed sanctuary where curiosity and sketches begin.',
    description: 'Every great engineering breakthrough starts with a quiet sketch and an insatiable curiosity for how the physical and digital intersect.',
    cameraPosition: [5.0, -0.6, 4.2],
    cameraTarget: [2.5, -0.5, 0],
    fov: 42,
    highlightAction: 'Discover My Story',
    modalTarget: 'about',
    statsBadge: 'Personal Origins',
    details: {
      title: 'Creative Tenets',
      items: [
        'Tactile Delight: Digital experiences should feel physically rewarding',
        'Anti-Slop Discipline: Clean typographic hierarchy and intentional color palettes',
        'Performant Craft: 60 FPS minimum budget on every screen'
      ]
    }
  },
  {
    id: 'rocket',
    name: 'Orbital Propulsion (Tech Stack)',
    category: 'Speed & Tech Stack',
    tagline: 'Circumnavigating the globe with supersonic speeds and zero latency.',
    description: 'The rocket represents performance optimization, asset compression, shader compilation, and modern Node.js full-stack pipelines.',
    cameraPosition: [-3.8, 3.8, 6.0],
    cameraTarget: [-1.8, 2.0, 0],
    fov: 45,
    highlightAction: 'Inspect Tech Stack',
    modalTarget: 'skills',
    statsBadge: '60 FPS Guaranteed',
    details: {
      title: 'Performance Rigs',
      items: [
        'Custom WebGL asset streaming and geometry instancing',
        'Draco compression & binary buffer streaming',
        'Optimized Framer Motion animatic layout calculations'
      ]
    }
  },
  {
    id: 'crane',
    name: 'Harbor Dock & Crane (Lab Experiments)',
    category: 'WIP & Prototypes',
    tagline: 'Harbor dock with boat & crane — testing anti-gravity and experimental shaders.',
    description: 'The dock and crane keep building new ideas. Here lies the experimental sandbox of cutting-edge creative code and upcoming releases.',
    cameraPosition: [0.8, -5.2, 4.6],
    cameraTarget: [-0.3, -2.6, 0],
    fov: 42,
    highlightAction: 'Explore Lab Experiments',
    modalTarget: 'experiments',
    statsBadge: 'Active Prototypes',
    details: {
      title: 'Current Experiments',
      items: [
        'Anti-Gravity gesture physics with magnetic cursor pull',
        'Procedural atmospheric ray-marching shaders',
        'Generative audio synthesizers triggered by scroll dynamics'
      ]
    }
  },
  {
    id: 'hot_air_balloon',
    name: 'Aero Expeditions (Contact)',
    category: 'Collaboration',
    tagline: 'Drifting gently above the clouds — let’s build something extraordinary together.',
    description: 'Ready to collaborate on high-impact 3D experiences, spatial interfaces, or creative technology? Drop a message directly into the flight log.',
    cameraPosition: [4.4, 2.8, 5.0],
    cameraTarget: [2.2, 1.8, 0],
    fov: 42,
    highlightAction: 'Send a Message',
    modalTarget: 'contact',
    statsBadge: 'Open for Bookings',
    details: {
      title: 'Collaboration Modes',
      items: [
        'End-to-End 3D Interactive Web Experiences',
        'Creative Frontend Architecture & Next.js Consulting',
        'WebGL Performance Audits & Shader Optimization'
      ]
    }
  }
];

landmarksRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: landmarksData
  });
});

landmarksRouter.get('/:id', (req: Request, res: Response) => {
  const item = landmarksData.find((l) => l.id === req.params.id);
  if (!item) {
    res.status(404).json({ success: false, error: 'Landmark not found' });
    return;
  }
  res.json({ success: true, data: item });
});
