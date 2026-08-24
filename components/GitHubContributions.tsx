'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from './ThemeProvider';

interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

interface ContributionWeek {
    days: ContributionDay[];
}

interface GitHubContributionsProps {
    username: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function GitHubContributions({ username }: GitHubContributionsProps) {
    const [contributions, setContributions] = useState<ContributionWeek[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalContributions, setTotalContributions] = useState(0);
    const [hoveredDay, setHoveredDay] = useState<{ day: ContributionDay; x: number; y: number } | null>(null);
    const [mounted, setMounted] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (!loading && scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
    }, [loading]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        async function fetchContributions() {
            try {
                const response = await fetch(
                    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
                );
                const data = await response.json();

                if (data.contributions) {
                    const weeks: ContributionWeek[] = [];
                    let currentWeek: ContributionDay[] = [];
                    let calculatedTotal = 0;

                    data.contributions.forEach((day: { date: string; count: number; level: number }) => {
                        calculatedTotal += day.count;
                        currentWeek.push({
                            date: day.date,
                            count: day.count,
                            level: day.level
                        });

                        if (currentWeek.length === 7) {
                            weeks.push({ days: currentWeek });
                            currentWeek = [];
                        }
                    });

                    if (currentWeek.length > 0) {
                        weeks.push({ days: currentWeek });
                    }

                    setContributions(weeks);
                    const currentYearStr = new Date().getFullYear().toString();
                    const lastYearStr = (new Date().getFullYear() - 1).toString();
                    const apiTotal = data.total?.[currentYearStr] || data.total?.[lastYearStr] || data.total?.lastYear || calculatedTotal;
                    setTotalContributions(apiTotal);

                    if (data.contributions.length > 0) {
                        setYear(new Date(data.contributions[data.contributions.length - 1].date).getFullYear());
                    }
                }
            } catch (error) {
                console.error('Failed to fetch GitHub contributions:', error);
                generateMockData();
            } finally {
                setLoading(false);
            }
        }

        function generateMockData() {
            const weeks: ContributionWeek[] = [];
            const today = new Date();
            for (let w = 0; w < 52; w++) {
                const days: ContributionDay[] = [];
                for (let d = 0; d < 7; d++) {
                    const rand = Math.random();
                    let level = 0;
                    let count = 0;
                    if (rand > 0.7) { level = 4; count = 10 + Math.floor(Math.random() * 10); }
                    else if (rand > 0.5) { level = 3; count = 5 + Math.floor(Math.random() * 5); }
                    else if (rand > 0.3) { level = 2; count = 2 + Math.floor(Math.random() * 3); }
                    else if (rand > 0.15) { level = 1; count = 1; }

                    const date = new Date(today);
                    date.setDate(date.getDate() - ((51 - w) * 7 + (6 - d)));
                    days.push({
                        date: date.toISOString().split('T')[0],
                        count,
                        level
                    });
                }
                weeks.push({ days });
            }
            setContributions(weeks);
            setTotalContributions(847);
        }

        fetchContributions();
    }, [username]);

    const monthLabels = useMemo(() => {
        if (contributions.length === 0) return [];

        const labels: { month: string; position: number }[] = [];
        let lastMonth = -1;

        contributions.forEach((week, weekIndex) => {
            if (week.days.length > 0 && week.days[0].date) {
                const date = new Date(week.days[0].date);
                const month = date.getMonth();

                if (month !== lastMonth) {
                    labels.push({
                        month: MONTHS[month],
                        position: weekIndex
                    });
                    lastMonth = month;
                }
            }
        });

        return labels;
    }, [contributions]);

    const getLevelColor = (level: number) => {
        if (theme === 'light') {
            switch (level) {
                case 0: return 'bg-[#ebedf0]';
                case 1: return 'bg-[#c0c0c0]';
                case 2: return 'bg-[#8a8a8a]';
                case 3: return 'bg-[#505050]';
                case 4: return 'bg-[#1a1a1a]';
                default: return 'bg-[#ebedf0]';
            }
        }
        switch (level) {
            case 0: return 'bg-[#1a1a1a]';
            case 1: return 'bg-[#3d3d3d] shadow-[inset_0_0_4px_rgba(255,255,255,0.05)]';
            case 2: return 'bg-[#5a5a5a] shadow-[inset_0_0_6px_rgba(255,255,255,0.1)]';
            case 3: return 'bg-[#8a8a8a] shadow-[inset_0_0_8px_rgba(255,255,255,0.15)]';
            case 4: return 'bg-[#e8e8e8] shadow-[0_0_8px_rgba(255,255,255,0.4),inset_0_0_4px_rgba(255,255,255,0.3)]';
            default: return 'bg-[#1a1a1a]';
        }
    };

    const totalWeeks = contributions.length;

    const handleMouseEnter = (day: ContributionDay, e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredDay({
            day,
            x: rect.left + rect.width / 2,
            y: rect.top - 8
        });
    };

    const handleMouseLeave = () => {
        setHoveredDay(null);
    };

    if (loading) {
        return (
            <div className="p-4 rounded-lg bg-theme-card border border-theme-divider">
                <div className="animate-pulse">
                    <div className="h-4 bg-theme-card-hover rounded w-1/4 mb-4"></div>
                    <div className="h-24 bg-theme-card rounded"></div>
                </div>
            </div>
        );
    }

    const tooltip = hoveredDay && hoveredDay.day.date && mounted ? createPortal(
        <div
            className="fixed z-[9999] px-3 py-1.5 rounded-md text-xs whitespace-nowrap pointer-events-none shadow-lg"
            style={{
                left: hoveredDay.x,
                top: hoveredDay.y,
                transform: 'translate(-50%, -100%)',
                background: theme === 'light' ? '#1a1a1a' : '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.9)',
            }}
        >
            {hoveredDay.day.count} contribution{hoveredDay.day.count !== 1 ? 's' : ''} on {hoveredDay.day.date}
        </div>,
        document.body
    ) : null;

    const tileSize = 10;
    const tileGap = 2;

    return (
        <>
            <div className="w-full">
                <div
                    ref={scrollContainerRef}
                    className="overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <div className="flex flex-col items-start min-w-max">
                        <div className="flex mb-2 text-[11px] text-theme-muted" style={{ gap: `${tileGap}px` }}>
                            {monthLabels.map((label, index) => {
                                const nextLabelPos = monthLabels[index + 1]?.position ?? totalWeeks;
                                const weekSpan = nextLabelPos - label.position;
                                const width = weekSpan * tileSize + (weekSpan - 1) * tileGap;
                                const showLabel = index > 0 || width >= 30;
                                return (
                                    <div
                                        key={`${label.month}-${label.position}`}
                                        style={{ width: `${width}px`, minWidth: `${width}px` }}
                                        className="text-left"
                                    >
                                        {showLabel ? label.month : ''}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex" style={{ gap: `${tileGap}px` }}>
                            {contributions.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col" style={{ gap: `${tileGap}px` }}>
                                    {week.days.map((day, dayIndex) => (
                                        <div
                                            key={dayIndex}
                                            style={{ width: `${tileSize}px`, height: `${tileSize}px` }}
                                            className={`rounded-[2px] ${getLevelColor(day.level)} transition-all duration-150 hover:scale-125 hover:ring-1 hover:ring-theme-card-hover-border cursor-pointer`}
                                            onMouseEnter={(e) => handleMouseEnter(day, e)}
                                            onMouseLeave={handleMouseLeave}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-theme-muted">
                        {totalContributions.toLocaleString()} activities in {year}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-theme-muted">
                        <span>Less</span>
                        <div style={{ width: `${tileSize}px`, height: `${tileSize}px` }} className={`rounded-[2px] ${getLevelColor(0)}`} />
                        <div style={{ width: `${tileSize}px`, height: `${tileSize}px` }} className={`rounded-[2px] ${getLevelColor(1)}`} />
                        <div style={{ width: `${tileSize}px`, height: `${tileSize}px` }} className={`rounded-[2px] ${getLevelColor(2)}`} />
                        <div style={{ width: `${tileSize}px`, height: `${tileSize}px` }} className={`rounded-[2px] ${getLevelColor(3)}`} />
                        <div style={{ width: `${tileSize}px`, height: `${tileSize}px` }} className={`rounded-[2px] ${getLevelColor(4)}`} />
                        <span>More</span>
                    </div>
                </div>
            </div>
            {tooltip}
        </>
    );
}