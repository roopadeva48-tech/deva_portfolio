import { Router, Request, Response } from 'express';

export const certificatesRouter = Router();

export interface CertificateItem {
  id: string;
  title: string;
  category: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  verificationUrl?: string;
  skills: string[];
  description: string;
  gradeScore?: string;
  badgeIcon?: string;
  doorNumber?: number;
  accentColor?: string;
  imageUrl?: string;
}

let certificatesData: CertificateItem[] = [
  {
    id: 'threejs-journey-mastery',
    title: 'Three.js & WebGL Spatial Computing Specialization',
    category: '3D Graphics & Spatial',
    issuer: 'Bruno Simon / Three.js Journey Academy',
    issueDate: 'October 2024',
    credentialId: 'CERT-TJ-89241-DV',
    verificationUrl: 'https://threejs-journey.com',
    skills: ['Three.js', 'Custom GLSL Shaders', 'Raymarching', 'Physics Engines', 'Performance Profiling'],
    description: 'Advanced mastery in mathematical vector projection, custom lighting models, PBR materials, procedural particle physics, and WebGL pipeline optimization.',
    gradeScore: 'Top 1% Distinction',
    badgeIcon: '🪐',
    doorNumber: 101,
    accentColor: '#38bdf8'
  },
  {
    id: 'meta-advanced-frontend',
    title: 'Meta Advanced Frontend & Spatial Architecture',
    category: 'Frontend Engineering',
    issuer: 'Meta Platforms & Coursera',
    issueDate: 'June 2024',
    credentialId: 'META-FE-90812-RD',
    verificationUrl: 'https://coursera.org/verify/META-FE-90812-RD',
    skills: ['React 19', 'Next.js 15', 'TypeScript', 'State Machines', 'Framer Motion'],
    description: 'Architecting scalable enterprise frontends, micro-frontends, high-performance DOM render cycles, and design token integration.',
    gradeScore: '100% Grade with Honors',
    badgeIcon: '⚛️',
    doorNumber: 102,
    accentColor: '#0ea5e9'
  },
  {
    id: 'aws-cloud-solutions',
    title: 'AWS Certified Solutions Architect — Spatial & Web',
    category: 'Cloud & Infrastructure',
    issuer: 'Amazon Web Services',
    issueDate: 'January 2024',
    expiryDate: 'January 2027',
    credentialId: 'AWS-PSA-44109-DEV',
    verificationUrl: 'https://aws.amazon.com/verification',
    skills: ['CloudFront CDN', 'Asset Streaming', 'Lambda@Edge', 'S3 Static Assets', 'Serverless APIs'],
    description: 'Design and deployment of highly available, fault-tolerant, and low-latency global delivery pipelines for real-time 3D web applications.',
    gradeScore: 'Score: 920 / 1000',
    badgeIcon: '☁️',
    doorNumber: 103,
    accentColor: '#f59e0b'
  },
  {
    id: 'google-ux-spatial',
    title: 'Google Spatial UI & Immersive Interaction Design',
    category: 'UI/UX & Design',
    issuer: 'Google Design Certification',
    issueDate: 'August 2023',
    credentialId: 'GOOG-UX-77312-RD',
    verificationUrl: 'https://grow.google/certificates',
    skills: ['Spatial UX', 'Accessibility Tokens', 'Micro-Interactions', 'Ergonomic HUDs', 'Design Systems'],
    description: 'Crafting intuitive 3D spatial user interfaces, tactile affordances, spatial sound design, and WCAG accessibility standards for immersive applications.',
    gradeScore: 'Distinction Capstone',
    badgeIcon: '🎨',
    doorNumber: 104,
    accentColor: '#ec4899'
  },
  {
    id: 'blender-procedural-modeling',
    title: 'Procedural 3D Modeling & Asset Optimization',
    category: '3D Art & Modeling',
    issuer: 'CG Cookie & Blender Artists Guild',
    issueDate: 'March 2023',
    credentialId: 'BLND-MDL-55201-DV',
    verificationUrl: 'https://cgcookie.com',
    skills: ['Geometry Nodes', 'Draco Mesh Compression', 'Texture Baking', 'UV Mapping', 'Low-Poly Dioramas'],
    description: 'Procedural generation of architectural structures, low-polygon miniature planet models, and Draco compression pipelines for instantaneous web loading.',
    gradeScore: 'Certified Master Practitioner',
    badgeIcon: '🏛️',
    doorNumber: 105,
    accentColor: '#10b981'
  }
];

// GET all certificates
certificatesRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: certificatesData,
    count: certificatesData.length
  });
});

// POST add a new certificate dynamically
certificatesRouter.post('/', (req: Request, res: Response) => {
  const { title, issuer, issueDate, category, credentialId, skills, description, verificationUrl, gradeScore } = req.body;

  if (!title || !issuer) {
    res.status(400).json({ success: false, error: 'Title and Issuer are required' });
    return;
  }

  const nextNumber = 101 + certificatesData.length;
  const newCertificate: CertificateItem = {
    id: `cert-${Date.now()}`,
    title,
    issuer,
    issueDate: issueDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    category: category || 'Spatial & Engineering',
    credentialId: credentialId || `CERT-${Math.floor(10000 + Math.random() * 90000)}-DV`,
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s: string) => s.trim()) : ['Spatial Computing', 'Web Development']),
    description: description || 'Professional verification of technical competencies and project execution.',
    verificationUrl: verificationUrl || '#',
    gradeScore: gradeScore || 'Verified Credential',
    badgeIcon: '🏅',
    doorNumber: nextNumber,
    accentColor: '#0284c7'
  };

  certificatesData.push(newCertificate);

  res.status(201).json({
    success: true,
    data: newCertificate,
    message: 'Certificate added and 3D door generated successfully!'
  });
});

// DELETE a certificate
certificatesRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = certificatesData.length;
  certificatesData = certificatesData.filter((c) => c.id !== id);

  if (certificatesData.length === initialLen) {
    res.status(404).json({ success: false, error: 'Certificate not found' });
    return;
  }

  res.json({ success: true, message: 'Certificate removed' });
});
