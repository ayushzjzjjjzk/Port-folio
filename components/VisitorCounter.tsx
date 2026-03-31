'use client';

import { useEffect, useRef, useState } from 'react';

export default function VisitorCounter() {
    const [views, setViews] = useState<number | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const recordView = async () => {
            try {
                const hasVisited = sessionStorage.getItem('hasVisitedPortfolio');
                
                if (!hasVisited) {
                    const res = await fetch('/api/views', { method: 'POST' });
                    const data = await res.json();
                    
                    if (res.ok && data.views > 0) {
                        setViews(data.views);
                        sessionStorage.setItem('hasVisitedPortfolio', 'true');
                    }
                } else {
                    const res = await fetch('/api/views', { method: 'GET' });
                    const data = await res.json();
                    
                    if (res.ok && data.views > 0) {
                        setViews(data.views);
                    }
                }
            } catch (error) {
            }
        };

        recordView();
    }, []);

    const formatViews = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    if (views === null || views === 0) return null;

    return (
        <div className="flex items-center justify-center gap-1 md:gap-1.5 text-theme-muted font-mono bg-theme-card px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-theme-divider shadow-sm backdrop-blur-sm transition-all hover:bg-theme-card-hover hover:border-theme-card-hover-border group cursor-default">
            <svg 
                className="w-3.5 h-3.5 md:w-4 md:h-4 text-theme-secondary opacity-80 group-hover:text-theme-primary transition-colors duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-xs md:text-sm font-medium tracking-wide opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                {formatViews(views)}
            </span>
        </div>
    );
}