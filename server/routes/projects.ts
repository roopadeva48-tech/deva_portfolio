import { Router, Request, Response } from 'express';

export const projectsRouter = Router();

export interface ProjectItem {
  id: string;
  title: string;
  category: '3D Spatial' | 'Animatic & Motion' | 'Full-Stack Web' | 'Creative Lab';
  year: string;
  tagline: string;
  description: string;
  technologies: string[];
  metrics?: string;
  role: string;
  coverGradient: string;
  interactiveDemoType?: 'orbit' | 'particles' | 'shader' | 'animatic';
  links: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  features: string[];
}

const projectsData: ProjectItem[] = [
  {
    id: 'anti-gravity-sandbox',
    title: 'Aetheria: Anti-Gravity Physics Engine',
    category: '3D Spatial',
    year: '2025',
    tagline: 'Real-time zero-G spatial sandbox with 10,000 instanced floating artifacts.',
    description: 'A WebGL and Three.js physics sandbox allowing users to manipulate gravitational fields, orbital velocity, and magnetic forces in real-time. Features custom vertex shaders simulating atmospheric drag and celestial collisions.',
    technologies: ['Three.js', 'GLSL', 'TypeScript', 'Web Audio API', 'React 19'],
    metrics: '120 FPS physics loop via Web Workers · 4.8M particle interactions',
    role: 'Lead Architect & Shader Artist',
    coverGradient: 'from-cyan-500 to-blue-600',
    interactiveDemoType: 'particles',
    links: {
      live: '#',
      github: 'https://github.com/roopadeva/aetheria-zero-g'
    },
    features: [
      'Custom spatial acceleration quadtrees for collision resolution',
      'Dynamic audio synthesis reacting to collision impact speeds',
      'Full touch and mouse gesture gravitational lensing effect'
    ]
  },
  {
    id: 'radial-urbanism',
    title: 'Orbit City: Curvature Architectural Studio',
    category: '3D Spatial',
    year: '2024',
    tagline: 'Procedural radial city generation on miniature planetary bodies.',
    description: 'Inspired by miniature Little Prince planets and architectural models, this application procedurally wraps high-rise towers, residential brownstones, and construction cranes around curved spherical coordinates.',
    technologies: ['Three.js', 'Framer Motion', 'Next.js', 'Tailwind CSS'],
    metrics: 'Under 1.2s First Contentful Paint · Zero external textures required',
    role: 'Creative Developer & 3D Designer',
    coverGradient: 'from-amber-400 to-orange-600',
    interactiveDemoType: 'orbit',
    links: {
      live: '#',
      github: 'https://github.com/roopadeva/orbit-city'
    },
    features: [
      'Spherical normal projection for accurate building radial alignment',
      'Atmospheric cloud ring system with volumetric depth simulation',
      'Smooth cinematic camera transitions between landmarks'
    ]
  },
  {
    id: 'kinetic-animatic-novel',
    title: 'Chronicles of Wanderlust: Interactive Animatic',
    category: 'Animatic & Motion',
    year: '2024',
    tagline: 'Hand-drawn linework meets real-time 3D camera pan storytelling.',
    description: 'An interactive graphic narrative blending hand-drawn rough ink animatics with 3D camera dollies. Explores the journey of a curious engineer traveling across miniature floating world islands.',
    technologies: ['Framer Motion', 'Three.js', 'SVG Morphing', 'Canvas API'],
    metrics: 'FWA of the Day Nominee · Over 180K global interactive reads',
    role: 'Animator & Frontend Engineer',
    coverGradient: 'from-teal-400 to-emerald-600',
    interactiveDemoType: 'animatic',
    links: {
      live: '#',
      github: 'https://github.com/roopadeva/animatic-chronicles'
    },
    features: [
      'Scrubbable timeline with seamless camera sync',
      'Dynamic ink bleeding shaders on canvas load',
      'Micro-sound effects synced to mouse pointer velocity'
    ]
  },
  {
    id: 'terra-miniature-engine',
    title: 'MicroCosm: Procedural Diorama Generator',
    category: 'Creative Lab',
    year: '2023',
    tagline: 'Turn geographic coordinates into stylized low-poly 3D pocket worlds.',
    description: 'A creative tool that ingests elevation map tiles and renders them as charming, low-poly isometric pocket globes complete with floating cloud rings, tiny lighthouses, and animated toy boats.',
    technologies: ['Three.js', 'Node.js', 'Mapbox API', 'GLTF Pipeline'],
    metrics: '99.4% automated mesh simplification ratio',
    role: 'Full-Stack Creative Engineer',
    coverGradient: 'from-indigo-500 to-purple-700',
    interactiveDemoType: 'orbit',
    links: {
      live: '#',
      github: 'https://github.com/roopadeva/microcosm'
    },
    features: [
      'Modular Node.js geometry processing backend with caching',
      'Real-time day/night sunlight cycle simulation',
      'One-click export to GLTF and USDZ for Apple AR QuickLook'
    ]
  },
  {
    id: 'pulsar-design-system',
    title: 'Pulsar: Spatial Design System & UI Kit',
    category: 'Full-Stack Web',
    year: '2024',
    tagline: 'A design token architecture for spatial & 2.5D web applications.',
    description: 'Comprehensive design system bridging standard web DOM components with 3D Three.js canvas HUD overlays. Includes accessibility helpers, focus trap management in 3D space, and spatial sound tokens.',
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Storybook', 'Express'],
    metrics: 'Used across 14 enterprise internal 3D tool suites',
    role: 'Design System Architect',
    coverGradient: 'from-rose-500 to-pink-600',
    interactiveDemoType: 'shader',
    links: {
      live: '#',
      github: 'https://github.com/roopadeva/pulsar-spatial-ui'
    },
    features: [
      'Mathematical nested radius and anti-slop typography tokens',
      'Projected 3D world-to-screen coordinate HUD positioning engine',
      'Zero layout shift guaranteed responsive canvas wrappers'
    ]
  }
];

projectsRouter.get('/', (req: Request, res: Response) => {
  const category = req.query.category as string;
  if (category && category !== 'all') {
    const filtered = projectsData.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    res.json({ success: true, data: filtered });
    return;
  }
  res.json({
    success: true,
    data: projectsData,
  });
});

projectsRouter.get('/:id', (req: Request, res: Response) => {
  const project = projectsData.find((p) => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ success: false, error: 'Project not found' });
    return;
  }
  res.json({ success: true, data: project });
});
