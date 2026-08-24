'use client';

import { Blog } from "@/data/blogs";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
    blog: Blog;
    onTagClick?: (tag: string) => void;
}

const platformIcons: Record<string, React.ReactNode> = {
    Medium: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
        </svg>
    ),
    "Dev.to": (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
        </svg>
    ),
    Substack: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
        </svg>
    ),
};

export default function BlogCard({ blog, onTagClick }: BlogCardProps) {
    const icon = blog.platform ? platformIcons[blog.platform] : null;
    const destination = `/portfolio/blogs/${blog.slug || blog.id}`;

    return (
        <div className="group rounded-xl border border-theme-card-border bg-theme-card hover:bg-theme-card-hover hover:border-theme-card-hover-border transition-all duration-300 hover:scale-[1.01] overflow-hidden flex flex-col sm:flex-row">
            {/* Optional Cover Image */}
            {blog.image && (
                <Link
                    href={destination}
                    className="relative sm:w-48 h-36 sm:h-auto overflow-hidden shrink-0 block"
                >
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        unoptimized={blog.image?.startsWith('http')}
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 192px"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </Link>
            )}

            <div className="p-5 flex flex-col justify-between flex-1">
                {/* top metadata row */}
                <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            {icon && blog.platform && (
                                <span className="inline-flex items-center gap-1.5 text-xs text-theme-muted px-2 py-0.5 rounded-full border border-theme-divider bg-theme-badge-bg">
                                    {icon}
                                    {blog.platform}
                                </span>
                            )}
                            {blog.readTime && (
                                <span className="text-xs text-theme-muted flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
                                    </svg>
                                    {blog.readTime}
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-theme-muted">{blog.date}</span>
                    </div>

                    {/* Title */}
                    <Link href={destination} className="block">
                        <h3
                            className="text-theme-primary text-base font-semibold mb-2 group-hover:text-theme-icon-hover transition-colors leading-snug"
                            style={{ fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace" }}
                        >
                            {blog.title}
                        </h3>
                    </Link>

                    {/* Description */}
                    {blog.description && (
                        <p className="text-xs text-theme-secondary leading-relaxed mb-4 line-clamp-2">
                            {blog.description}
                        </p>
                    )}
                </div>

                {/* Bottom row: tags + read link */}
                <div className="flex items-center justify-between gap-3 flex-wrap pt-3 border-t border-theme-divider">
                    <div className="flex flex-wrap gap-1.5">
                        {blog.tags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={(e) => {
                                    if (onTagClick) {
                                        e.preventDefault();
                                        onTagClick(tag);
                                    }
                                }}
                                className="px-2 py-0.5 text-[11px] bg-theme-badge-bg text-theme-muted hover:text-theme-primary hover:border-theme-card-hover-border rounded-md border border-theme-divider transition-all cursor-pointer"
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>

                    <Link
                        href={destination}
                        className="inline-flex items-center gap-1 text-xs text-theme-muted group-hover:text-theme-primary transition-colors font-medium ml-auto"
                    >
                        <span>Read Article</span>
                        <svg
                            className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}