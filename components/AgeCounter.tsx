'use client';

import { useEffect, useState } from 'react';

const BIRTHDATE = new Date('2006-12-24T00:00:00+05:30');
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export default function AgeCounter() {
    const [age, setAge] = useState<number | null>(null);

    useEffect(() => {
        const updateAge = () => {
            const now = new Date();
            const ageInYears = (now.getTime() - BIRTHDATE.getTime()) / MS_PER_YEAR;
            setAge(ageInYears);
        };

        updateAge();
        const interval = setInterval(updateAge, 50);
        return () => clearInterval(interval);
    }, []);

    if (age === null) return null;

    return (
        <p className="text-theme-badge-text text-sm font-mono">
            <span className="text-theme-muted">~ </span>
            {age.toFixed(8)}
            <span className="text-theme-muted ml-1">years</span>
        </p>
    );
}