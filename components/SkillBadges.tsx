'use client';

import { FaJava } from 'react-icons/fa'; 
import {
    SiBun,
    SiExpress,
    SiFramer,
    SiGit,
    SiGithub,
    SiGreensock,
    SiJavascript,
    SiMysql,
    SiNextdotjs,
    SiNodedotjs,
    SiPostgresql,
    SiPostman,
    SiReact,
    SiShadcnui,
    SiTailwindcss,
    SiTypescript,
} from 'react-icons/si';

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