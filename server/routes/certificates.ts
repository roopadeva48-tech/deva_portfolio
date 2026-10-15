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
