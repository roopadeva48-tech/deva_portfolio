import { ProfileData, ProjectItem, Landmark } from '../types';

export const fallbackLandmarks: Landmark[] = [
  {
    id: 'girl_me',
    name: 'Roopa Deva (Creator Profile)',
    category: 'About Me',
    tagline: 'Sitting atop the world on a suitcase, dreaming up spatial experiences.',
    description: 'Welcome to my world! Click me to zoom in and unveil my complete creative background, technical capabilities, experience timeline, and passions.',
    cameraPosition: [0, 3.8, 5.2],
    cameraTarget: [0, 2.8, 0],
    fov: 38,
    highlightAction: 'Open Profile Showcase',
    modalTarget: 'profile',
    statsBadge: 'Lead 3D Architect',
    details: {
      title: 'Quick Snapshot',
      items: [
        'Creative Technologist & Spatial Frontend Specialist',
        'Expert in Three.js, React 19, Framer Motion & Node.js',
        'Passionate about tactile animatics and anti-gravity physics'
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

export async function fetchProfile(): Promise<ProfileData> {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Failed to fetch profile');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Using local fallback profile data:', err);
    return {
      name: 'Roopa Deva',
      pronouns: 'she/her',
      title: 'Creative Technologist & 3D Interactive Engineer',
      headline: 'Sculpting immersive 3D digital worlds, tactile interactions & anti-gravity web experiences.',
      bio: 'Hi, I am Roopa! I sit at the intersection of creative design and high-performance engineering. I build real-time WebGL experiences, 3D miniature worlds, and fluid motion systems that spark curiosity and delight.',
      extendedBio: [
        'My journey began with a sketchbook and a fascination with miniature dioramas and spatial art. Translating that tactile charm into the browser became my obsession.',
        'Over the past 5+ years, I have architected interactive web apps, 3D visualization platforms, and animatic interfaces using Three.js, Next.js, and Framer Motion.',
        'Currently exploring anti-gravity spatial interactions, procedural world-building shaders, and micro-delights for the modern web.'
      ],
      location: 'Bangalore / Open to Global Remote',
      status: 'Open for Select Creative Engagements & Senior Roles',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      stats: [
        { label: 'Years Experience', value: '5+', description: 'Crafting WebGL & frontend ecosystems' },
        { label: 'Interactive Works', value: '35+', description: '3D spatial scenes & web apps shipped' },
        { label: 'Awards & Honors', value: '8x', description: 'Awwwards, FWA & Dev community nods' },
        { label: 'Frame Budget', value: '60 FPS', description: 'Silky smooth mobile & desktop performance' }
      ],
      skills: [
        {
          category: '3D & Spatial Computing',
          items: [
            { name: 'Three.js / WebGL', level: 95, highlight: true },
            { name: 'Shader Development (GLSL)', level: 85 },
            { name: 'Blender & Procedural Modeling', level: 90, highlight: true },
            { name: 'Spline & Asset Optimization', level: 92 },
            { name: 'Physics & Anti-Gravity Systems', level: 88, highlight: true }
          ]
        },
        {
          category: 'Frontend Engineering',
          items: [
            { name: 'Next.js & React 19', level: 96, highlight: true },
            { name: 'TypeScript', level: 94 },
            { name: 'Framer Motion / Animatic Systems', level: 95, highlight: true },
            { name: 'Tailwind CSS', level: 92 },
            { name: 'Canvas & SVG Animation', level: 88 }
          ]
        },
        {
          category: 'Backend & Architecture',
          items: [
            { name: 'Node.js & Express API', level: 90, highlight: true },
            { name: 'Modular Microservice Design', level: 86 },
            { name: 'Asset Streaming & LOD Pipelines', level: 92, highlight: true },
            { name: 'WebSockets & Multi-user', level: 84 }
          ]
        }
      ],
      experience: [
        {
          role: 'Lead 3D Frontend Architect',
          company: 'Studio Kinetic Spatial',
          period: '2023 — Present',
          description: 'Pioneered browser-based 3D dioramas, animatic interactive storytelling, and spatial UI engines for global clients.',
          highlights: [
            'Engineered procedural miniature planet engines running at locked 60 FPS on mobile and low-power hardware.',
            'Reduced 3D asset initial bundle size by 68% using custom Draco, mesh instancing, and texture atlas pipelines.'
          ]
        },
        {
          role: 'Senior Creative Technologist',
          company: 'Aura Interactive Labs',
          period: '2021 — 2023',
          description: 'Developed award-winning immersive marketing campaigns, generative art microsites, and interactive branding.',
          highlights: [
            'Built full-bleed WebGL portfolios and virtual showrooms viewed by over 1.2M visitors.'
          ]
        }
      ],
      education: [
        {
          degree: 'B.Tech in Computer Science & Interactive Multimedia',
          institution: 'National Institute of Technology',
          year: '2015 — 2019'
        }
      ],
      socials: [
        { platform: 'GitHub', url: 'https://github.com', handle: '@roopadeva' },
        { platform: 'LinkedIn', url: 'https://linkedin.com', handle: 'in/roopadeva' },
        { platform: 'Twitter / X', url: 'https://twitter.com', handle: '@roopa_3d' },
        { platform: 'Email', url: 'mailto:roopadeva48@gmail.com', handle: 'roopadeva48@gmail.com' }
      ],
      passions: [
        'Miniature Diorama Building',
        'Analog Synths & Generative Audio',
        'Astronomy & Orbital Dynamics',
        'Architectural Clay Sculpting'
      ]
    };
  }
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Using local fallback projects data:', err);
    return [
      {
        id: 'anti-gravity-sandbox',
        title: 'Aetheria: Anti-Gravity Physics Engine',
        category: '3D Spatial',
        year: '2025',
        tagline: 'Real-time zero-G spatial sandbox with 10,000 instanced floating artifacts.',
        description: 'A WebGL and Three.js physics sandbox allowing users to manipulate gravitational fields, orbital velocity, and magnetic forces in real-time.',
        technologies: ['Three.js', 'GLSL', 'TypeScript', 'Web Audio API', 'React 19'],
        metrics: '120 FPS physics loop via Web Workers · 4.8M particle interactions',
        role: 'Lead Architect & Shader Artist',
        coverGradient: 'from-cyan-500 to-blue-600',
        interactiveDemoType: 'particles',
        links: { live: '#', github: 'https://github.com/roopadeva/aetheria-zero-g' },
        features: [
          'Custom spatial acceleration quadtrees for collision resolution',
          'Dynamic audio synthesis reacting to collision impact speeds'
        ]
      },
      {
        id: 'radial-urbanism',
        title: 'Orbit City: Curvature Architectural Studio',
        category: '3D Spatial',
        year: '2024',
        tagline: 'Procedural radial city generation on miniature planetary bodies.',
        description: 'Inspired by miniature Little Prince planets and architectural models, wrapping high-rise towers around curved spherical coordinates.',
        technologies: ['Three.js', 'Framer Motion', 'Next.js', 'Tailwind CSS'],
        metrics: 'Under 1.2s First Contentful Paint',
        role: 'Creative Developer & 3D Designer',
        coverGradient: 'from-amber-400 to-orange-600',
        interactiveDemoType: 'orbit',
        links: { live: '#', github: 'https://github.com/roopadeva/orbit-city' },
        features: [
          'Spherical normal projection for accurate building radial alignment',
          'Atmospheric cloud ring system with volumetric depth simulation'
        ]
      },
      {
        id: 'kinetic-animatic-novel',
        title: 'Chronicles of Wanderlust: Interactive Animatic',
        category: 'Animatic & Motion',
        year: '2024',
        tagline: 'Hand-drawn linework meets real-time 3D camera pan storytelling.',
        description: 'An interactive graphic narrative blending hand-drawn rough ink animatics with 3D camera dollies.',
        technologies: ['Framer Motion', 'Three.js', 'SVG Morphing', 'Canvas API'],
        metrics: 'FWA of the Day Nominee',
        role: 'Animator & Frontend Engineer',
        coverGradient: 'from-teal-400 to-emerald-600',
        interactiveDemoType: 'animatic',
        links: { live: '#', github: 'https://github.com/roopadeva/animatic-chronicles' },
        features: [
          'Scrubbable timeline with seamless camera sync',
          'Dynamic ink bleeding shaders on canvas load'
        ]
      }
    ];
  }
}

export async function fetchLandmarks(): Promise<Landmark[]> {
  try {
    const res = await fetch('/api/landmarks');
    if (!res.ok) throw new Error('Failed to fetch landmarks');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Using fallback landmarks:', err);
    return fallbackLandmarks;
  }
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send message');
  }
  return data;
}
