export type LandmarkId =
  | 'girl_me'
  | 'skyscrapers'
  | 'cozy_house'
  | 'rocket'
  | 'crane'
  | 'hot_air_balloon';

export type SceneStyle = 'option_b_stylized' | 'option_a_earth';

export interface CameraViewConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface Landmark {
  id: LandmarkId;
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
