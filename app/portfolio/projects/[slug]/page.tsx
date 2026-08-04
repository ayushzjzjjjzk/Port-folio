'use client';

import ThemeToggle from '@/components/ThemeToggle';
import { projects } from '@/data/projects';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import {
    SiFramer,
    SiGreensock,
    SiLeaflet,
    SiMongodb,
    SiNextdotjs,
    SiPrisma,
    SiReact,
    SiTailwindcss,
    SiThreedotjs,
    SiTypescript,
    SiYoutube
} from 'react-icons/si';
import { TbBrandFramerMotion } from 'react-icons/tb';

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

const techIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'Next.js': SiNextdotjs,
    'React': SiReact,
    'TypeScript': SiTypescript,
    'Tailwind': SiTailwindcss,
    'Convex': ConvexIcon,
    'Framer Motion': TbBrandFramerMotion,
    'Prisma': SiPrisma,
    'MongoDB': SiMongodb,
    'YouTube API': SiYoutube,
    'Leaflet': SiLeaflet,
    'Three.js': SiThreedotjs,
    'Zustand': ZustandIcon,
    'GSAP': SiGreensock,
    'Motion': SiFramer,
};

interface ProjectDetailPageProps {
    params: Promise<{ slug: string }>;
}

const statusStyles = {
    'Live': {
        dotColor: 'bg-emerald-400',
        textColor: 'text-theme-muted',
        text: 'Live',
        pulse: true,
    },
    'In Progress': {
        dotColor: 'bg-amber-400',
        textColor: 'text-theme-muted',
        text: 'In Progress',
        pulse: true,
    },
    'Open Source': {
        dotColor: 'bg-violet-400',
        textColor: 'text-theme-muted',
        text: 'Open Source',
        pulse: false,
    },
};

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { slug } = use(params);
    const project = projects.find((p) => p.id === slug);
    const searchParams = useSearchParams();
    const from = searchParams.get('from');
    const backLink = from === 'home' ? '/portfolio#projects' : '/portfolio/projects';
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!project) {
        notFound();
    }

    const statusStyle = statusStyles[project.status];
    const geistMonoFont = { fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace" };
    const headingFont = { fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace", fontWeight: 600 };

    return (
        <div className="min-h-screen text-page-text overflow-y-auto overflow-x-hidden relative z-2" style={geistMonoFont}>
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-out" style={{ filter: isLoaded ? 'none' : 'blur(20px)', opacity: isLoaded ? 1 : 0 }}>
                <div
                    className="flex items-center gap-8 px-6 py-3 rounded-xl"
                    style={{
                        background: 'var(--theme-nav-bg)',
                        backdropFilter: 'blur(32px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(32px) saturate(150%)',
                        border: '1px solid var(--theme-nav-border)',
                        boxShadow: 'var(--theme-nav-shadow)',
                    }}
                >
                    <Link href="/portfolio" className="hover:scale-105 transition-transform shrink-0">
                        <Image src="/images/avatar.jpg" alt="Avatar" width={32} height={32} className="w-8 h-8 min-w-8 min-h-8 rounded-sm object-cover cursor-pointer" />
                    </Link>
                    <Link href="/portfolio/projects" className="text-sm text-theme-secondary hover:text-theme-primary transition-colors">
                        projects
                    </Link>
                    <Link href="/portfolio/blogs" className="text-sm text-theme-secondary hover:text-theme-primary transition-colors">
                        blog
                    </Link>
                    <ThemeToggle />
                </div>
            </nav>
            <main
                className="relative transition-all duration-700 ease-out"
                style={{
                    filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'scale(1)' : 'scale(1.02)',
                }}
            >

                <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
                    <div className="mb-8">
                        <Link
                            href={backLink}
                            className="text-theme-primary hover:text-theme-icon-hover transition-colors inline-flex items-center gap-2 group"
                        >
                            <svg className="w-4 h-4 back-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                            </svg>
                            <span className="text-2xl tracking-wider" style={headingFont}>Projects</span>
                        </Link>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-theme-divider mb-6 bg-theme-card">
                        {project.videoUrl ? (
                            <video
                                src={project.videoUrl}
                                controls
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                className="w-full aspect-video object-cover"
                                poster={project.image}
                            />
                        ) : project.image ? (
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="w-full aspect-video object-cover object-top"
                            />
                        ) : (
                            <div className="w-full aspect-video bg-theme-card flex items-center justify-center">
                                <span className="text-theme-faint">No preview available</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-8 py-4">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-theme-badge-text hover:text-theme-primary transition-colors text-sm group"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                <span className="animated-underline">Github</span>
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-theme-badge-text hover:text-theme-primary transition-colors text-sm group"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                                </svg>
                                <span className="animated-underline">Website</span>
                            </a>
                        )}
                        {project.status === 'Live' && (
                            project.postUrl ? (
                                <a
                                    href={project.postUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-theme-badge-text hover:text-theme-primary transition-colors text-sm group"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    <span className="animated-underline">Post</span>
                                </a>
                            ) : (
                                <span className="flex items-center gap-2 text-theme-faint text-sm cursor-not-allowed">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                    Post
                                </span>
                            )
                        )}
                    </div>

                    <div className="border-t border-theme-divider mb-8"></div>

                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl text-theme-primary" style={headingFont}>{project.title}</h1>
                        <span className={`text-xs ${statusStyle.textColor} flex items-center gap-1.5`}>
                            <span className={`w-1.5 h-1.5 ${statusStyle.dotColor} rounded-full ${statusStyle.pulse ? 'animate-pulse' : ''}`}></span>
                            {statusStyle.text}
                        </span>
                    </div>

                    <div className="text-theme-muted text-sm leading-relaxed mb-12">
                        <p>{project.description}</p>
                    </div>
                    <div className="mb-12">
                        <h3 className="text-sm text-theme-muted uppercase tracking-wider mb-4" style={headingFont}>Stack</h3>
                        <div className="flex flex-wrap gap-3">
                            {project.techStack.map((tech) => {
                                const Icon = techIcons[tech];
                                return (
                                    <span
                                        key={tech}
                                        className="text-sm px-4 py-2 bg-theme-card text-theme-badge-text rounded-lg border border-theme-divider flex items-center gap-2"
                                    >
                                        {Icon ? <Icon className="w-4 h-4 text-theme-secondary" /> : <span className="text-theme-muted">⚙</span>}
                                        {tech}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}