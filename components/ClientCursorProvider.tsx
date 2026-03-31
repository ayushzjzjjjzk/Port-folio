'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import OrigamiCursor from './OrigamiCursor';

export default function ClientCursorProvider() {
    const pathname = usePathname();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const isPortfolioSubdomain = window.location.hostname.startsWith('portfolio.');
        const isPortfolioPath = pathname?.startsWith('/portfolio');
        setShouldRender(isPortfolioSubdomain || !!isPortfolioPath);
    }, [pathname]);

    if (!shouldRender) {
        return null;
    }

    return <OrigamiCursor />;
}