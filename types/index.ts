
export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    problem: string;
    solution: string;
    techStack: string[];
    images: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    category: string;
    date: string;
    challenges?: string[];
    learnings?: string[];
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    duration: string;
    startDate: string;
    endDate: string | 'Present';
    description: string;
    achievements: string[];
    technologies: string[];
}

export interface Skill {
    name: string;
    category: 'frontend' | 'backend' | 'tools' | 'other';
    proficiency: number; 
    icon?: string;
}

export interface ContactInfo {
    email: string;
    linkedin: string;
    github: string;
    twitter?: string;
    website?: string;
}

export interface AboutContent {
    intro: string;
    passion: string;
    currentFocus: string;
    interests: string[];
    photo: string;
}

export interface PageContent {
    id: string;
    type: 'cover' | 'toc' | 'about' | 'project' | 'experience' | 'skills' | 'contact';
    title: string;
    content?: Project | Experience | AboutContent | Skill[] | ContactInfo;
}

export interface SceneState {
    lampOn: boolean;
    notebookOpen: boolean;
    currentPage: number;
    totalPages: number;
    isPlaying: boolean;
    volume: number;
    isMuted: boolean;
}