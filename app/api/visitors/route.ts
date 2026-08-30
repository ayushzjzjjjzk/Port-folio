import { NextRequest, NextResponse } from 'next/server';
import {
    VIEWS_KEY,
    getRedis,
    getLocalViews,
    incrementLocalViews,
} from '@/lib/redis';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'portfolio_visited';

export async function GET(request: NextRequest) {
    const redis = getRedis();

    if (!redis) {
        const views = incrementLocalViews();
        return NextResponse.json(
            { views },
            { headers: { 'Cache-Control': 'no-store' } },
        );
    }

    try {
        const alreadyCounted = request.cookies.get(COOKIE_NAME)?.value === '1';

        const views = alreadyCounted
            ? ((await redis.get<number>(VIEWS_KEY)) ?? 0)
            : await redis.incr(VIEWS_KEY);

        const response = NextResponse.json(
            { views },
            { headers: { 'Cache-Control': 'no-store' } },
        );

        if (!alreadyCounted) {
            response.cookies.set(COOKIE_NAME, '1', {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24,
            });
        }

        return response;
    } catch {
        return NextResponse.json(
            { views: getLocalViews() },
            { headers: { 'Cache-Control': 'no-store' } },
        );
    }
}