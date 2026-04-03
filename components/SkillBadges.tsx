'use client';
import { FaJava } from 'react-icons/fa'; 


import {
    SiBun,
    SiCplusplus,
    SiDocker,
    SiExpress,
    SiFigma,
    SiFramer,
    SiGit,
    SiGithub,
    SiGreensock,
    SiJavascript,
    SiLeaflet,
    SiMongodb,
    SiMysql,
    SiNextdotjs,
    SiNodedotjs,
    SiPostgresql,
    SiPostman,
    SiPrisma,
    SiPython,
    SiReact,
    SiRedis,
    SiShadcnui,
    SiSwift,
    SiTailwindcss,
    SiTypescript,
    
} from 'react-icons/si';

const ZustandIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="7" cy="6" r="3" />
        <circle cx="17" cy="6" r="3" />
        <circle cx="12" cy="14" r="8" />
        <circle cx="9" cy="13" r="1.2" fill="white" />
        <circle cx="15" cy="13" r="1.2" fill="white" />
        <path d="M9 17q3 2 6 0" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" />
    </svg>
);

const ConvexIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.08 5.1 7.63 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z" />
    </svg>
);

const skills = [
    { name: 'React', icon: SiReact },
    { name: 'Next', icon: SiNextdotjs },
    { name: 'Express', icon: SiExpress },
    { name: 'Node', icon: SiNodedotjs },
    { name: 'Bun', icon: SiBun },
    { name: 'PostgreSQL', icon: SiPostgresql },
   
  
    { name: 'Postman', icon: SiPostman },
    { name: 'Tailwind', icon: SiTailwindcss },
    { name: 'shadcn', icon: SiShadcnui },
    { name: 'Motion', icon: SiFramer },
    { name: 'GSAP', icon: SiGreensock },
    { name: 'JavaScript', icon: SiJavascript },
    { name: 'TypeScript', icon: SiTypescript },
  
   
    { name: 'SQL', icon: SiMysql },
    { name: 'Git', icon: SiGit },
    { name: 'GitHub', icon: SiGithub },
    
    { name: 'Java', icon: FaJava },
    
];

export default function SkillBadges() {
    return (
        <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
                const Icon = skill.icon;
                return (
                    <span
                        key={skill.name}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-theme-badge-border bg-theme-badge-bg text-theme-badge-text text-xs hover:bg-theme-card-hover transition-colors"
                    >
                        <Icon className="w-3 h-3" />
                        {skill.name}
                    </span>
                );
            })}
        </div>
    );
}