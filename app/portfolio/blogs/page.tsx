'use client';

import BlogCard from '@/components/BlogCard';
import Navbar from '@/components/Navbar';
import SmoothScroll from '@/components/SmoothScroll';
import { blogs, getAllTags } from '@/data/blogs';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function BlogsPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const tags = useMemo(() => getAllTags(), []);

    const filteredBlogs = useMemo(() => {
        return blogs.filter((blog) => {
            const matchesTag = selectedTag
                ? blog.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
                : true;
            const matchesSearch = searchQuery.trim() === ''
                ? true
                : blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  blog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesTag && matchesSearch;
        });
    }, [selectedTag, searchQuery]);

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
                    <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
                        {/* Header */}
                        <div className="mb-8">
                            <Link href="/portfolio#blog" className="text-theme-primary hover:text-theme-icon-hover transition-colors inline-flex items-center gap-2 group mb-4">
                                <svg className="w-4 h-4 back-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                                </svg>
                                <span className="text-2xl tracking-wider" style={headingFont}>Blogs</span>
                            </Link>

                            <p className="text-theme-secondary text-sm leading-relaxed mt-2">
                                Thoughts, deep dives, and architectural breakdowns on systems, backend engineering, and web development.
                            </p>

                            {/* Search bar */}
                            <div className="relative mt-6 mb-4">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search articles by title, keyword, or topic..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-theme-card border border-theme-card-border rounded-xl text-sm text-theme-primary placeholder-theme-muted focus:outline-none focus:border-theme-card-hover-border transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-theme-muted hover:text-theme-primary"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Tag Filter Pills */}
                            <div className="flex items-center gap-2 flex-wrap mt-4">
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className={`px-3 py-1 text-xs rounded-lg transition-all cursor-pointer border ${
                                        selectedTag === null
                                            ? 'bg-theme-primary text-black font-semibold border-theme-primary'
                                            : 'bg-theme-card text-theme-muted hover:text-theme-primary border-theme-divider hover:border-theme-card-hover-border'
                                    }`}
                                >
                                    All ({blogs.length})
                                </button>
                                {tags.map((tag) => {
                                    const count = blogs.filter((b) => b.tags.includes(tag)).length;
                                    const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTag(isSelected ? null : tag)}
                                            className={`px-3 py-1 text-xs rounded-lg transition-all cursor-pointer border ${
                                                isSelected
                                                    ? 'bg-theme-primary text-black font-semibold border-theme-primary'
                                                    : 'bg-theme-card text-theme-muted hover:text-theme-primary border-theme-divider hover:border-theme-card-hover-border'
                                            }`}
                                        >
                                            #{tag} ({count})
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Stats bar */}
                            <div className="flex items-center gap-4 mt-6 text-xs text-theme-muted">
                                <span>Showing {filteredBlogs.length} of {blogs.length} article{blogs.length !== 1 ? 's' : ''}</span>
                                <span className="w-1 h-1 rounded-full bg-theme-divider" />
                                <span>{blogs.reduce((acc, b) => acc + (b.claps || 0), 0)} total claps</span>
                            </div>
                        </div>

                        {/* Blog Cards List */}
                        {filteredBlogs.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {filteredBlogs.map((blog) => (
                                    <BlogCard
                                        key={blog.id}
                                        blog={blog}
                                        onTagClick={(tag) => setSelectedTag(tag)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-theme-divider bg-theme-card/30">
                                <div className="text-4xl mb-3 opacity-40">🔍</div>
                                <p className="text-theme-primary font-medium text-sm mb-1">No articles found</p>
                                <p className="text-theme-muted text-xs mb-4">
                                    No posts match your current search or tag filter.
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedTag(null);
                                        setSearchQuery('');
                                    }}
                                    className="px-4 py-2 text-xs bg-theme-card hover:bg-theme-card-hover text-theme-primary rounded-lg border border-theme-divider transition-all"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}

                        {/* Footer note */}
                        <div className="mt-16 pt-8 border-t border-theme-divider text-center">
                            <p className="text-xs text-theme-muted">
                                Written by <span className="text-theme-primary font-medium">Ayush Singh Ramola</span> • Powered by Markdown & Next.js
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </SmoothScroll>
    );
}
