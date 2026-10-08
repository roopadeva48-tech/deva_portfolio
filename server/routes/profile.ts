import { Router, Request, Response } from 'express';

export const profileRouter = Router();

export interface ProfileData {
  name: string;
  pronouns: string;
  title: string;
  headline: string;
  bio: string;
  extendedBio: string[];
  location: string;
  status: string;
  avatar: string;
  stats: {
    label: string;
    value: string;
    description: string;
  }[];
  skills: {
    category: string;
    items: { name: string; level: number; highlight?: boolean }[];
  }[];
  experience: {
    role: string;
    company: string;
    period: string;
    description: string;
    highlights: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  socials: {
    platform: string;
    url: string;
    handle: string;
  }[];
  passions: string[];
}

const profileData: ProfileData = {
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
        'Reduced 3D asset initial bundle size by 68% using custom Draco, mesh instancing, and texture atlas pipelines.',
        'Mentored junior creative developers in Three.js math, matrix transformations, and Euler rotation techniques.'
      ]
    },
    {
      role: 'Senior Creative Technologist',
      company: 'Aura Interactive Labs',
      period: '2021 — 2023',
      description: 'Developed award-winning immersive marketing campaigns, generative art microsites, and interactive branding.',
      highlights: [
        'Built full-bleed WebGL portfolios and virtual showrooms viewed by over 1.2M visitors.',
        'Combined Framer Motion spring physics with Three.js camera rigs for seamless 2D/3D transitions.'
      ]
    },
    {
      role: 'Interactive Web Developer',
      company: 'Pixelform Digital',
      period: '2019 — 2021',
      description: 'Crafted modern React SPAs, experimental canvas demos, and responsive visual interfaces.',
      highlights: [
        'Built custom SVG and WebGL animation pipelines.',
        'Authored open-source utilities for smooth camera damping and orbit navigation.'
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
    'Architectural Clay Sculpting',
    'Coffee Roasting & Tea Ceremonies'
  ]
};

profileRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: profileData
  });
});
