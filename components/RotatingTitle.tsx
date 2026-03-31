'use client';

import { useEffect, useState } from 'react';

const titles = [
    'fullstack dev',
    'ios dev',
    'open source contributor',
    'pursuing cs (and greatness)',
];

export default function RotatingTitle() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const showDuration = 3000;
        const transitionDuration = 500;

        const cycle = () => {
            setIsVisible(false);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % titles.length);
                setIsVisible(true);
            }, transitionDuration);
        };

        const interval = setInterval(cycle, showDuration + transitionDuration);

        return () => clearInterval(interval);
    }, []);

    return (
        <p
            className="text-theme-muted text-sm mb-2 ml-[1px]"
            style={{
                minHeight: '20px',
                filter: isVisible ? 'blur(0px)' : 'blur(6px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.5s ease-in-out',
            }}
        >
            {titles[currentIndex]}
        </p>
    );
}