import { ProfileData, ProjectItem, Landmark, CertificateItem } from '../types';

export const fallbackCertificates: CertificateItem[] = [
  {
    id: 'ksr-class-d-hackathon',
    title: 'Certificate of Participation — Class D Hackathon',
    category: 'Hackathons & Competitions',
    issuer: 'Department of CSE, K.S.R. College of Engineering',
    issueDate: 'August 18, 2026',
    credentialId: 'KSR-CSE-CDH-2026',
    skills: ['Competitive Programming', 'Team Problem Solving', 'Full Stack Development', 'Algorithmic Thinking'],
    description: 'Awarded to DEVAROOPA E for successfully participating in the "CLASS D HACKATHON" organized by the Department of Computer Science and Engineering, held on 18th August 2026.',
    gradeScore: 'Verified Participant',
    badgeIcon: '⚡',
    doorNumber: 101,
    accentColor: '#f59e0b',
    imageUrl: '/assets/certificates/class_d_hackathon.png'
  },
  {
    id: 'ieee-yhack-26',
    title: "Certificate of Participation — YHACK '26 (National Level 24-Hour Hackathon)",
    category: 'National Hackathons & Robotics',
    issuer: 'IEEE Robotics and Automation Society & IEEE KPRIET Student Branch',
    issueDate: 'September 11, 2026',
    credentialId: 'Certificate No. 562',
    skills: ['24-Hour Hackathon', 'Rapid Prototyping', 'Robotics & Automation', 'System Architecture', 'Embedded Logic'],
    description: "Certified that Devaroopa E of K.S.R. College of Engineering participated in the \"YHACK '26 – A National Level 24-Hour Hackathon\" organized by IEEE Robotics and Automation Society in association with IEEE KPRIET Student Branch on 10.09.2026 and 11.09.2026. Sponsored by Ausweg & RobotoAI.",
    gradeScore: 'National Participant #562',
    badgeIcon: '🤖',
    doorNumber: 102,
    accentColor: '#ef4444',
    imageUrl: '/assets/certificates/yhack_ieee_kpriet.jpg'
  },
  {
    id: 'touchmark-industry-internship',
    title: 'Certificate of Completion — Industry Learning Internship Program',
    category: 'Industry Internship',
    issuer: 'Touchmark Descience Pvt. Ltd. & Touchmark Concourse Centre',
    issueDate: 'July 6, 2026',
    credentialId: 'GLNT-74CFE-B702F-474C7-29CEE',
    skills: ['Industry-Oriented Projects', 'Production Engineering', 'Team Dynamics', 'Problem-Solving', 'Technical Delivery'],
    description: 'Presented to E Devaroopa (Reg. No. 73152413035), Department of CSE at K.S.R. College of Engineering, for successfully completing the Industry Learning Internship Program conducted by Touchmark Descience Pvt. Ltd. through Touchmark Concourse Centre.',
    gradeScore: 'Completed with Distinction (2 Weeks)',
    badgeIcon: '💼',
    doorNumber: 103,
    accentColor: '#0284c7',
    imageUrl: '/assets/certificates/touchmark_internship.png'
  },
  {
    id: 'anthropic-ai-fluency',
    title: 'Certificate of Completion — AI Fluency: Framework & Foundations',
    category: 'Artificial Intelligence & LLMs',
    issuer: 'Anthropic (with UCC, Ringling College, HEA & National Forum)',
    issueDate: '2026',
    credentialId: 'ANTHROPIC-AIF-2026-DEVA',
    skills: ['AI Fluency', 'LLM Foundations', 'Prompt Engineering', 'AI Alignment & Safety', 'Anthropic Claude Architectures'],
    description: 'Mastery certification completed by Devaroopa E in "AI Fluency: Framework & Foundations" by Anthropic, verifying core knowledge in artificial intelligence systems, large language model operations, safety guidelines, and real-world deployment frameworks.',
    gradeScore: 'Certified AI Practitioner',
    badgeIcon: '🧠',
    doorNumber: 104,
    accentColor: '#5b7055',
    imageUrl: '/assets/certificates/anthropic_ai_fluency.png'
  },
  {
    id: 'eduskills-python-fullstack',
    title: 'Certificate of Internship — Python Full Stack Development With Project',
    category: 'Full Stack Web & Python',
    issuer: 'EduSkills Academy (ISO 9001:2015 & IAO Certified)',
    issueDate: 'August 7, 2026',
    credentialId: '2026-6F525B0427',
    skills: ['Python Fundamentals', 'FastAPI Backend APIs', 'Pydantic & SQLAlchemy', 'React Frontend & State Management', 'Redux / Zustand', 'Testing & Deployment', 'Text Encryption Toolkit'],
    description: 'Awarded to Devaroopa E for successfully achieving the Internship Credential by completing an 8-week program in Python Full Stack Development With Project. Built production-ready APIs, reactive component architectures, and the Text Encryption Toolkit project.',
    gradeScore: '8-Week Credential (ISO Certified)',
    badgeIcon: '🐍',
    doorNumber: 105,
    accentColor: '#10b981',
    imageUrl: '/assets/certificates/eduskills_python_fullstack.png'
  }
];

export const fallbackLandmarks: Landmark[] = [
  {
    id: 'girl_me',
    name: 'devaroopa (Creator Profile)',
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
        'Spatial Physics Sandbox (120 FPS Web Workers)',
        'Orbit City: Curvature Architectural Studio',
        'Pulsar 3D Spatial Design System & UI Kit'
      ]
    }
  },
  {
    id: 'cozy_house',
    name: 'The 3D Certificate Hallway (Gallery & Awards)',
    category: '3D Hallway Gallery',
    tagline: 'Step into the interactive 3D Hallway with cinematic doors & rooms.',
    description: 'Walk through the 3D gallery corridor. Click on any door to enter exhibition rooms showcasing accredited certifications in spatial WebGL, frontend engineering, and cloud architecture.',
    cameraPosition: [5.0, -0.6, 4.2],
    cameraTarget: [2.5, -0.5, 0],
    fov: 42,
    highlightAction: 'Enter 3D Certificate Gallery',
    modalTarget: 'about',
    statsBadge: 'Interactive 3D Rooms',
    details: {
      title: 'Hallway Features',
      items: [
        'Cinematic door swing & camera glide transitions',
        'High-resolution certificate inspect & verification',
        'Dynamic real-time certificate addition with automatic door generation'
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
    tagline: 'Harbor dock with boat & crane — testing experimental shaders and physics.',
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
        'Procedural atmospheric ray-marching shaders',
        'Generative audio synthesizers triggered by scroll dynamics',
        'Spatial gesture particle physics engine'
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
      name: 'devaroopa',
      pronouns: 'she/her',
      title: 'Creative Technologist & 3D Interactive Engineer',
      headline: 'Sculpting immersive 3D digital worlds, tactile interactions & spatial web experiences.',
      bio: 'Hi, I am devaroopa! I sit at the intersection of creative design and high-performance engineering. I build real-time WebGL experiences, 3D miniature worlds, and fluid motion systems that spark curiosity and delight.',
      extendedBio: [
        'My journey began with a sketchbook and a fascination with miniature dioramas and spatial art. Translating that tactile charm into the browser became my obsession.',
        'Over the past 5+ years, I have architected interactive web apps, 3D visualization platforms, and animatic interfaces using Three.js, Next.js, and Framer Motion.',
        'Currently exploring spatial interactions, procedural world-building shaders, and micro-delights for the modern web.'
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
            { name: 'Physics & Spatial Systems', level: 88, highlight: true }
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

export const fallbackProjects: ProjectItem[] = [
  {
    id: 'anti-gravity-sandbox',
    title: 'Aetheria: Spatial Physics Engine',
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

export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Using local fallback projects data:', err);
    return fallbackProjects;
  }
}

export async function fetchCertificates(): Promise<CertificateItem[]> {
  try {
    const res = await fetch('/api/certificates');
    if (!res.ok) throw new Error('Failed to fetch certificates');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Using fallback certificates:', err);
    return fallbackCertificates;
  }
}

export async function createCertificate(payload: Partial<CertificateItem>): Promise<CertificateItem> {
  const res = await fetch('/api/certificates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to add certificate');
  }
  return data.data;
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
