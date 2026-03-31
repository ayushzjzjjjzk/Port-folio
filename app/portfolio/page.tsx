'use client';

import AgeCounter from '@/components/AgeCounter';
import BlogCard from '@/components/BlogCard';
import CTAButtons from '@/components/CTAButtons';
import GitHubContributions from '@/components/GitHubContributions';
import ProjectCard from '@/components/ProjectCard';
import RotatingTitle from '@/components/RotatingTitle';
import SkillBadges from '@/components/SkillBadges';
import SmoothScroll from '@/components/SmoothScroll';
import ThemeToggle from '@/components/ThemeToggle';
import VisitorCounter from '@/components/VisitorCounter';
import { blogs } from '@/data/blogs';
import { projects } from '@/data/projects';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PortfolioPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const headingFont = { fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace", fontWeight: 600 };
    const geistMonoFont = { fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace" };

    return (
        <SmoothScroll>
            <div className="min-h-screen text-page-text overflow-y-auto overflow-x-hidden relative z-[2]" style={geistMonoFont}>
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
                        <div className="relative nav-avatar-wrapper group">
                            <Link 
                                href={scrolled ? "#" : "https://knightkun.codes"}
                                onClick={(e) => {
                                    if (scrolled) {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                            >
                                <img
                                    src="/images/avatar.jpg"
                                    alt="Avatar"
                                    className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-sm object-cover cursor-pointer shrink-0"
                                />
                            </Link>
                            {!scrolled && (
                                <div className="personal-space-tooltip hidden md:block absolute top-[90%] -translate-y-1/2 right-full z-[100]">
                                    <div className="pr-4">
                                        <Link
                                            href="https://knightkun.codes"
                                            className="flex items-center gap-1.5 whitespace-nowrap hover:text-theme-primary text-theme-secondary transition-colors"
                                        >
                                            <span className="flex flex-col items-center">
                                                <span
                                                    className="tooltip-text"
                                                    style={{
                                                        fontFamily: "var(--font-dancing), 'Dancing Script', cursive",
                                                        fontSize: '21px',
                                                        letterSpacing: '0.5px',
                                                    }}
                                                >
                                                    check out my personal space!
                                                </span>
                                                <span
                                                    className="text-theme-muted text-[11px] tracking-wider"
                                                    style={{ fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace" }}
                                                >
                                                    (under construction)
                                                </span>
                                            </span>
                                            <svg className="arrow-svg flex-shrink-0" width="55" height="30" viewBox="0 0 70 38" fill="none">
                                                <path
                                                    className="arrow-path"
                                                    d="M2 32 C 10 30, 18 26, 26 20 C 36 12, 46 5, 56 2"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    fill="none"
                                                />
                                                <polygon className="arrow-head" points="54,0 65,0 56,8" fill="currentColor" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
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


                    <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
                        <div className="mb-16">
                            <div className="relative mb-8 flex gap-4">
                                <div className="absolute top-0 right-0 z-10">
                                    <VisitorCounter />
                                </div>
                                <img
                                    src="/images/avatar.jpg"
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-sm object-cover shrink-0 mt-1"
                                    style={{ boxShadow: 'var(--theme-avatar-shadow)' }}
                                />
                                <div className="flex flex-col justify-start">
                                    <h1 className="text-2xl md:text-3xl text-theme-primary tracking-wide mb-1 pr-14 md:pr-0" style={headingFont}>
                                        Ayush Singh Ramola
                                    </h1>
                                    <RotatingTitle />
                                    <AgeCounter />
                                </div>
                            </div>

                            <div className="text-theme-secondary text-sm leading-relaxed mb-8">
                                <p className="mb-3">basically, i just like building things. a lot. currently learning golang and diving deep into backend systems and networking.</p>
                                <p>in my free time, i like to write blogs, read, solve algorithms and pretend to be good at chess.</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-theme-muted">
                                <a href="https://github.com/pranav718" target="_blank" rel="noopener noreferrer" className="hover:text-theme-icon-hover transition-colors" title="GitHub">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                                </a>
                                <a href="https://x.com/knightkun__" target="_blank" rel="noopener noreferrer" className="hover:text-theme-icon-hover transition-colors" title="X/Twitter">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>
                                <a href="https://www.linkedin.com/in/pranav-ray-9ab54133b/" target="_blank" rel="noopener noreferrer" className="hover:text-theme-icon-hover transition-colors" title="LinkedIn">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </a>
                                <a href="https://medium.com/@knightkun" target="_blank" rel="noopener noreferrer" className="hover:text-theme-icon-hover transition-colors" title="Medium">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" /></svg>
                                </a>
                                <a href="https://leetcode.com/pranav718" target="_blank" rel="noopener noreferrer" className="hover:text-theme-icon-hover transition-colors" title="LeetCode">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" /></svg>
                                </a>
                                <a href="https://codeforces.com/profile/knightkun__" target="_blank" rel="noopener noreferrer" className="hover:text-theme-icon-hover transition-colors" title="Codeforces">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" /></svg>
                                </a>
                                <a href="https://buymeacoffee.com/pranavray777" target="_blank" rel="noopener noreferrer" className="hover:text-theme-icon-hover transition-colors" title="Buy Me Coffee">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364z" /></svg>
                                </a>
                                <a href="https://www.chess.com/member/knightkun0_0" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="Chess.com">
                                    <img src="/images/chesscom-logo.png" alt="Chess.com" className="w-5 h-5 rounded-sm" style={{ filter: 'var(--theme-chess-filter)' }} />
                                </a>
                                <a href="https://discord.com/users/knightkun__" target="_blank" rel="noopener noreferrer" className="hover:text-theme-icon-hover transition-colors" title="Discord">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                                </a>
                            </div>

                            <CTAButtons />

                            <div className="mt-12 mb-8">
                                <h2 className="text-2xl mb-6 tracking-wider" style={headingFont}>Skills</h2>
                                <SkillBadges />
                            </div>
                        </div>

                        <section id="projects" className="mb-16">
                            <h2 className="text-2xl mb-6 tracking-wider" style={headingFont}>Projects</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {projects.slice(0, 2).map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>

                            <div className="flex justify-center mt-6">
                                <Link
                                    href="/portfolio/projects"
                                    className="group text-sm text-theme-muted hover:text-theme-primary px-4 py-2 rounded-lg border border-theme-divider hover:border-theme-card-hover-border hover:bg-theme-card transition-all flex items-center gap-2"
                                >
                                    <span className="animated-underline">View All</span>
                                    <svg className="w-4 h-4 view-all-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                                    </svg>
                                </Link>
                            </div>
                        </section>

                        <section className="mb-16">
                            <h2 className="text-2xl mb-6 tracking-wider" style={headingFont}>Stats</h2>
                            <GitHubContributions username="pranav718" />
                        </section>

                        <section id="blog" className="mb-16">
                            <h2 className="text-2xl mb-6 tracking-wider" style={headingFont}>Blogs</h2>

                            <div className="space-y-4">
                                {blogs.map((blog) => (
                                    <BlogCard key={blog.id} blog={blog} />
                                ))}
                            </div>

                            <div className="flex justify-center mt-6">
                                <Link
                                    href="/portfolio/blogs"
                                    className="group text-sm text-theme-muted hover:text-theme-primary px-4 py-2 rounded-lg border border-theme-divider hover:border-theme-card-hover-border hover:bg-theme-card transition-all flex items-center gap-2"
                                >
                                    <span className="animated-underline">View All</span>
                                    <svg className="w-4 h-4 view-all-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                                    </svg>
                                </Link>
                            </div>
                        </section>

                        <div className="mt-16 relative">
                            <div
                                className="absolute inset-0 pointer-events-none z-10"
                                style={{
                                    background: `linear-gradient(to bottom, var(--theme-gradient-overlay) 0%, transparent 30%, transparent 70%, var(--theme-gradient-overlay) 100%)`
                                }}
                            />
                            <img
                                src="/images/vagabond-mountains.jpg"
                                alt="Vagabond - Mountains"
                                className="w-full h-48 object-cover object-center opacity-60"
                            />
                            <p
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 text-theme-muted text-lg tracking-wider z-20"
                                style={{ fontFamily: "var(--font-dancing), 'Dancing Script', cursive" }}
                            >
                                "inside, i'm infinite"
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </SmoothScroll>
    );
}