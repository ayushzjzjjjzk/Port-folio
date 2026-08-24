'use client';

import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import OrigamiCursor from './OrigamiCursor';

const emptySubscribe = () => () => {};

export default function ClientCursorProvider() {
    const pathname = usePathname();
    const isClient = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    if (!isClient) {
        return null;
    }

    const isPortfolioSubdomain = typeof window !== 'undefined' && window.location.hostname.startsWith('portfolio.');
    const isPortfolioPath = pathname?.startsWith('/portfolio');

    if (!isPortfolioSubdomain && !isPortfolioPath) {
        return null;
    }

    return <OrigamiCursor />;
}