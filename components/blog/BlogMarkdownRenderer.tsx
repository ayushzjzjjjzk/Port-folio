'use client';

import React from 'react';
import CodeCopyButton from './CodeCopyButton';

interface BlogMarkdownRendererProps {
    content: string;
}

export function extractHeadings(content: string): { id: string; text: string }[] {
    const lines = content.trim().split('\n');
    const headings: { id: string; text: string }[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('## ')) {
            const text = trimmed.slice(3).trim();
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            headings.push({ id, text });
        } else if (trimmed.startsWith('### ')) {
            const text = trimmed.slice(4).trim();
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            headings.push({ id, text });
        }
    }
    return headings;
}

export default function BlogMarkdownRenderer({ content }: BlogMarkdownRendererProps) {
    const renderContent = () => {
        const lines = content.trim().split('\n');
        const elements: React.ReactNode[] = [];
        let inCodeBlock = false;
        let codeBuffer: string[] = [];
        let codeLanguage = '';
        let listBuffer: string[] = [];
        let keyCounter = 0;

        const flushList = () => {
            if (listBuffer.length > 0) {
                elements.push(
                    <ul key={`list-${keyCounter++}`} className="my-5 space-y-2.5 list-none pl-2">
                        {listBuffer.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-[15px] sm:text-base text-theme-secondary leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-theme-primary/70 mt-2.5 shrink-0" />
                                <div>{parseInline(item)}</div>
                            </li>
                        ))}
                    </ul>
                );
                listBuffer = [];
            }
        };

        const flushCodeBlock = () => {
            if (codeBuffer.length > 0) {
                const codeString = codeBuffer.join('\n');
                elements.push(
                    <div
                        key={`code-${keyCounter++}`}
                        className="my-6 rounded-xl overflow-hidden border border-theme-card-border bg-[#0d1117] text-gray-200 shadow-lg"
                    >
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03] text-xs">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                                </div>
                                <span className="font-mono text-gray-400 ml-2">{codeLanguage || 'text'}</span>
                            </div>
                            <CodeCopyButton code={codeString} />
                        </div>
                        <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-gray-300">
                            <code>{codeString}</code>
                        </pre>
                    </div>
                );
                codeBuffer = [];
                codeLanguage = '';
            }
        };

        for (let i = 0; i < lines.length; i++) {
            const rawLine = lines[i];
            const trimmed = rawLine.trim();

            if (trimmed.startsWith('```')) {
                if (!inCodeBlock) {
                    flushList();
                    inCodeBlock = true;
                    codeLanguage = trimmed.slice(3).trim();
                } else {
                    inCodeBlock = false;
                    flushCodeBlock();
                }
                continue;
            }

            if (inCodeBlock) {
                codeBuffer.push(rawLine);
                continue;
            }

            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                listBuffer.push(trimmed.slice(2));
                continue;
            }

            // Check ordered list (e.g. 1. )
            const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
            if (orderedMatch) {
                flushList();
                elements.push(
                    <div key={`ol-${keyCounter++}`} className="flex items-start gap-3.5 my-3 text-[15px] sm:text-base text-theme-secondary leading-relaxed pl-2">
                        <span className="text-theme-muted font-mono text-sm font-medium shrink-0 pt-0.5">
                            {orderedMatch[1]}.
                        </span>
                        <div>{parseInline(orderedMatch[2])}</div>
                    </div>
                );
                continue;
            }

            flushList();

            if (trimmed.startsWith('## ')) {
                const titleText = trimmed.slice(3).trim();
                const id = titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                elements.push(
                    <h2
                        id={id}
                        key={`h2-${keyCounter++}`}
                        className="text-2xl sm:text-3xl text-theme-primary font-serif font-normal mt-12 mb-4 scroll-mt-24 tracking-tight leading-snug"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        {titleText}
                    </h2>
                );
            } else if (trimmed.startsWith('### ')) {
                const titleText = trimmed.slice(4).trim();
                const id = titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                elements.push(
                    <h3
                        id={id}
                        key={`h3-${keyCounter++}`}
                        className="text-xl sm:text-2xl text-theme-primary font-serif font-normal mt-8 mb-3 scroll-mt-24 tracking-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        {titleText}
                    </h3>
                );
            } else if (trimmed.startsWith('> ')) {
                elements.push(
                    <blockquote
                        key={`quote-${keyCounter++}`}
                        className="my-6 pl-4 py-2 border-l-2 border-theme-primary/50 italic text-[15px] text-theme-secondary bg-theme-badge-bg/40 rounded-r-lg"
                    >
                        {parseInline(trimmed.slice(2))}
                    </blockquote>
                );
            } else if (trimmed === '---') {
                elements.push(<hr key={`hr-${keyCounter++}`} className="my-8 border-theme-divider" />);
            } else if (trimmed.length > 0) {
                elements.push(
                    <p key={`p-${keyCounter++}`} className="text-[15px] sm:text-base text-theme-secondary leading-relaxed mb-5">
                        {parseInline(trimmed)}
                    </p>
                );
            }
        }

        flushList();
        flushCodeBlock();

        return elements;
    };

    return <div className="blog-content max-w-none">{renderContent()}</div>;
}

function parseInline(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|`.*?`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        const token = match[0];
        if (token.startsWith('[') && token.includes('](')) {
            const linkText = token.substring(1, token.indexOf(']('));
            const linkUrl = token.substring(token.indexOf('](') + 2, token.length - 1);
            parts.push(
                <a
                    key={match.index}
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-theme-primary underline underline-offset-4 decoration-theme-primary/40 hover:decoration-theme-primary transition-all font-medium"
                >
                    {linkText}
                </a>
            );
        } else if (token.startsWith('**') && token.endsWith('**')) {
            parts.push(
                <strong key={match.index} className="text-theme-primary font-semibold">
                    {token.slice(2, -2)}
                </strong>
            );
        } else if (token.startsWith('`') && token.endsWith('`')) {
            parts.push(
                <code
                    key={match.index}
                    className="px-1.5 py-0.5 text-xs font-mono rounded border border-theme-divider bg-theme-badge-bg text-theme-badge-text font-medium"
                >
                    {token.slice(1, -1)}
                </code>
            );
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts;
}
