'use client';

export interface Project{


     id: string;
     title: string;
     description: string;
     techStack: string[];
     status: 'Live' | 'In progress' | 'Open source';
     githubUrl: string;
     liveUrl?: string;
     imageUrl?: string;
     PostUrl?: string;

};


interface ProjectCardProps {
    project: Project;
    compact?: boolean;
}

const statusStyles = {
    'Live': {
        bg: 'bg-green-500/90',
        pulse: 'true',
    },

    'In progress': {
        bg: 'bg-blue-500/90',
        pulse: 'false',
  },

     'Open Source': {
        bg: 'bg-purple-500/90',
        pulse: false,
    },

    
};


export default function ProjectCard({ project, compact = false }: ProjectCardProps) {
    const statusStyle = statusStyles[project.status];
    const cardLink = `/portfolio/projects/${project.id}?from=${compact ? 'projects' : 'home'}`;

    return (
        <a href={cardLink} className="group block rounded-xl bg-theme-card border border-theme-card-border overflow-hidden hover:border-theme-card-hover-border hover:bg-theme-card-hover transition-all duration-300 hover:scale-[1.02] cursor-pointer">
            <div className={`relative ${compact ? 'h-36' : 'h-40'} overflow-hidden`}>
                {project.image ? (
                    <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="absolute inset-0 bg-theme-card flex items-center justify-center">
                        <span className="text-theme-faint text-sm">Preview</span>
                    </div>
                )}
                <span className={`absolute top-3 right-3 text-xs px-2 py-1 ${statusStyle.bg} text-white rounded font-medium flex items-center gap-1`}>
                    {statusStyle.pulse && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>}
                    {project.status}
                </span>
            </div>
            <div className="p-4">
                <div className="mb-2">
                    <p className="project-title font-medium text-theme-primary group-hover:text-theme-icon-hover">{project.title}</p>
                </div>
                <p className="text-sm text-theme-muted mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                        <span key={tech} className="text-xs px-2 py-1 bg-theme-badge-bg text-theme-badge-text rounded border border-theme-divider">{tech}</span>
                    ))}
                </div>
            </div>
        </a>
    );
}
    
