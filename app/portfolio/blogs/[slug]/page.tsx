'use client';

import BlogCard from '@/components/BlogCard';
import BlogMarkdownRenderer, { extractHeadings } from '@/components/blog/BlogMarkdownRenderer';
import ReadingProgressPill from '@/components/blog/ReadingProgressPill';
import Navbar from '@/components/Navbar';
import SmoothScroll from '@/components/SmoothScroll';
import { blogs, getBlogBySlug } from '@/data/blogs';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use, useEffect, useMemo, useState } from 'react';

interface BlogDetailPageProps {
    params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { slug } = use(params);
    const blog = getBlogBySlug(slug);

    const [isLoaded, setIsLoaded] = useState(false);
    const [claps, setClaps] = useState(blog?.claps || 0);
    const [hasClapped, setHasClapped] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const headings = useMemo(() => {
        if (!blog) return [];
        return extractHeadings(blog.content);
    }, [blog]);

    if (!blog) {
        notFound();
    }

    const handleClap = () => {
        setClaps((prev) => prev + 1);
        setHasClapped(true);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch {}
    };

    const relatedBlogs = blogs
        .filter((b) => b.id !== blog.id)
        .slice(0, 2);

    return (
        <SmoothScroll>
            <div className="min-h-screen text-page-text overflow-y-auto overflow-x-hidden relative z-2">
                <Navbar isLoaded={isLoaded} />

                <main
                    className="relative transition-all duration-700 ease-out"
                    style={{
                        filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
                        opacity: isLoaded ? 1 : 0,
                        transform: isLoaded ? 'scale(1)' : 'scale(1.02)',
                    }}
                >
                    <div className="max-w-3xl mx-auto px-6 pt-32 pb-28">
                        {/* Back to Blog link */}
                        <div className="mb-8">
                            <Link
                                href="/portfolio/blogs"
                                className="text-theme-muted hover:text-theme-primary transition-colors inline-flex items-center gap-2 group text-sm font-medium"
                            >
                                <svg
                                    className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l6-6M3 10l6 6" />
                                </svg>
                                <span>Back to Blog</span>
                            </Link>
                        </div>

                        {/* Hero Image */}
                        {blog.image && (
                            <div className="relative rounded-2xl overflow-hidden border border-theme-card-border mb-10 bg-theme-card aspect-[16/9] shadow-2xl">
                                <Image
                                    src={blog.image}
                                    alt={blog.title}
                                    fill
                                    unoptimized={blog.image.startsWith('http')}
                                    sizes="(max-width: 768px) 100vw, 768px"
                                    className="object-cover object-center"
                                    priority
                                />
                            </div>
                        )}

                        {/* Title & Subtitle */}
                        <div className="mb-8">
                            <h1
                                className="text-3xl sm:text-4xl md:text-5xl text-theme-primary font-serif font-normal tracking-tight mb-3 leading-[1.15]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                {blog.title}
                            </h1>

                            {blog.description && (
                                <p className="text-theme-secondary text-base sm:text-lg leading-relaxed mb-6 font-normal">
                                    {blog.description}
                                </p>
                            )}

                            {/* Metadata Row: Date & Share Button */}
                            <div className="flex items-center justify-between py-4 border-y border-theme-divider/70 text-sm text-theme-muted">
                                <div className="flex items-center gap-2 text-theme-secondary font-medium">
                                    <svg className="w-4 h-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <span>{blog.date}</span>
                                    <span className="mx-1.5 opacity-40">•</span>
                                    <span className="text-theme-muted text-xs">{blog.readTime}</span>
                                </div>

                                <button
                                    onClick={handleCopyLink}
                                    className="px-4 py-1.5 rounded-lg border border-theme-card-border bg-theme-card hover:bg-theme-card-hover hover:border-theme-card-hover-border text-theme-primary transition-all text-xs font-medium cursor-pointer shadow-sm"
                                >
                                    {linkCopied ? 'Copied!' : 'Share'}
                                </button>
                            </div>
                        </div>

                        {/* Article Markdown Body */}
                        <div className="mb-16">
                            <BlogMarkdownRenderer content={blog.content} />
                        </div>

                        {/* Claps & Interaction Footer */}
                        <div className="p-6 rounded-2xl bg-theme-card border border-theme-card-border mb-16 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleClap}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer ${
                                        hasClapped
                                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 scale-105'
                                            : 'bg-theme-badge-bg border-theme-divider text-theme-secondary hover:text-theme-primary hover:border-theme-card-hover-border'
                                    }`}
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11.37 2a1 1 0 0 0-1 1v8l-1.43-2.47a1 1 0 0 0-1.74 1L9.49 14a5 5 0 1 0 9.51-2.19V8a1 1 0 1 0-2 0v2.5a1 1 0 0 0-1-1 1 1 0 0 0-1 1V8a1 1 0 0 0-2 0v2a1 1 0 0 0-1.63-.78V3a1 1 0 0 0-1-1z" />
                                    </svg>
                                    <span className="font-semibold text-xs">{claps} Claps</span>
                                </button>
                                <span className="text-xs text-theme-muted">Enjoyed this article? Give it a clap!</span>
                            </div>

                            {blog.externalUrl && (
                                <a
                                    href={blog.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-theme-muted hover:text-theme-primary flex items-center gap-1.5 transition-colors"
                                >
                                    <span>Read on {blog.platform}</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}
                        </div>

                        {/* More Articles */}
                        {relatedBlogs.length > 0 && (
                            <section className="pt-10 border-t border-theme-divider">
                                <h3
                                    className="text-2xl text-theme-primary font-serif font-normal mb-6"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                >
                                    More Articles
                                </h3>
                                <div className="space-y-4">
                                    {relatedBlogs.map((b) => (
                                        <BlogCard key={b.id} blog={b} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </main>

                {/* Floating Reading Progress Pill */}
                <ReadingProgressPill headings={headings} />
            </div>
        </SmoothScroll>
    );
}
