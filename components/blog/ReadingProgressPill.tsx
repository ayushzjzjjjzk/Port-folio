'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressPillProps {
    headings: { id: string; text: string }[];
}

export default function ReadingProgressPill({ headings }: ReadingProgressPillProps) {
    const [progress, setProgress] = useState(0);
    const [activeHeading, setActiveHeading] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const currentProgress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
                setProgress(currentProgress);
                setIsVisible(window.scrollY > 150);
            }

            // Find current active heading based on viewport position
            if (headings.length > 0) {
                let current = headings[0].text;
                for (const heading of headings) {
                    const el = document.getElementById(heading.id);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        if (rect.top <= 200) {
                            current = heading.text;
                        }
                    }
                }
                setActiveHeading(current);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [headings]);

    if (!isVisible) return null;

    // SVG circular progress calculation
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out pointer-events-auto"
            style={{
                filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))',
            }}
        >
            <div
                className="flex items-center gap-3 px-4 py-2 rounded-full border text-xs backdrop-blur-md cursor-default"
                style={{
                    background: 'var(--theme-card-bg, rgba(20, 20, 20, 0.85))',
                    borderColor: 'var(--theme-card-border, rgba(255, 255, 255, 0.15))',
                    color: 'var(--theme-page-text, #f5f5f5)',
                    backgroundColor: 'rgba(15, 15, 15, 0.88)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
            >
                {/* White active indicator dot */}
                <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />

                {/* Active heading text with ellipsis */}
                <span className="font-medium text-gray-200 truncate max-w-[200px] sm:max-w-[320px]">
                    {activeHeading || 'Reading...'}
                </span>

                {/* Circular reading progress spinner ring */}
                <div className="relative w-5 h-5 flex items-center justify-center shrink-0 ml-1">
                    <svg className="w-5 h-5 -rotate-90" viewBox="0 0 24 24">
                        {/* Background track circle */}
                        <circle
                            cx="12"
                            cy="12"
                            r={radius}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth="2.5"
                        />
                        {/* Animated progress circle */}
                        <circle
                            cx="12"
                            cy="12"
                            r={radius}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-150 ease-out"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
