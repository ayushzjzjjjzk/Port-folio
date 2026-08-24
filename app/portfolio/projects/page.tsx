'use client';

import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import SmoothScroll from '@/components/SmoothScroll';
import { projects } from '@/data/projects';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProjectsPage() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const headingFont = { fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace", fontWeight: 600 };
    const geistMonoFont = { fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace" };

    return (
        <SmoothScroll>
            <div className="min-h-screen text-page-text overflow-y-auto overflow-x-hidden relative z-2" style={geistMonoFont}>
                <Navbar isLoaded={isLoaded} />

                <main
                    className="relative transition-all duration-700 ease-out"
                    style={{
                        filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
                        opacity: isLoaded ? 1 : 0,
                        transform: isLoaded ? 'scale(1)' : 'scale(1.02)',
                    }}
                >
                    <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                        <div className="mb-10">
                            <Link href="/portfolio#projects" className="text-theme-primary hover:text-theme-icon-hover transition-colors inline-flex items-center gap-2 group">
                                <svg className="w-4 h-4 back-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                                </svg>
                                <span className="text-2xl tracking-wider" style={headingFont}>Projects</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} compact />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </SmoothScroll>
    );
}