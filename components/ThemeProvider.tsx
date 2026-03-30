'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: (x?: number, y?: number) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const animatingRef = useRef(false);

    useEffect(() => {
        const saved = localStorage.getItem('theme') as Theme | null;
        if (saved === 'light' || saved === 'dark') {
            setTheme(saved);
            document.documentElement.classList.toggle('light', saved === 'light');
        }
        setMounted(true);
    }, []);

    const toggleTheme = (x?: number, y?: number) => {
        if (animatingRef.current) return;
        animatingRef.current = true;

        const next = theme === 'dark' ? 'light' : 'dark';
        const overlay = overlayRef.current;

        if (!overlay || x === undefined || y === undefined) {
            setTheme(next);
            localStorage.setItem('theme', next);
            document.documentElement.classList.toggle('light', next === 'light');
            animatingRef.current = false;
            return;
        }

        overlay.getAnimations().forEach(a => a.cancel());

        const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        overlay.style.backgroundColor = next === 'light' ? '#fafafa' : '#000000';
        overlay.style.opacity = '1';
        overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
        overlay.style.display = 'block';
        overlay.offsetHeight;

        const expandAnim = overlay.animate(
            [
                { clipPath: `circle(0px at ${x}px ${y}px)` },
                { clipPath: `circle(${maxRadius}px at ${x}px ${y}px)` },
            ],
            { duration: 800, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' }
        );

        const switchTimer = setTimeout(() => {
            setTheme(next);
            localStorage.setItem('theme', next);
            document.documentElement.classList.toggle('light', next === 'light');
        }, 480);

        expandAnim.onfinish = () => {
            overlay.style.clipPath = `circle(${maxRadius}px at ${x}px ${y}px)`;

            const fadeAnim = overlay.animate(
                [{ opacity: '1' }, { opacity: '0' }],
                { duration: 200, easing: 'ease-out' }
            );

            fadeAnim.onfinish = () => {
                overlay.style.display = 'none';
                overlay.style.clipPath = '';
                overlay.style.opacity = '';
                animatingRef.current = false;
            };
        };

        expandAnim.oncancel = () => {
            clearTimeout(switchTimer);
            overlay.style.display = 'none';
            overlay.style.clipPath = '';
            overlay.style.opacity = '';
            animatingRef.current = false;
        };
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
            <div
                ref={overlayRef}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                    display: 'none',
                }}
            />
        </ThemeContext.Provider>
    );
}