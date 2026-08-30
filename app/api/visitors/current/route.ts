import { NextResponse } from 'next/server';
import { VIEWS_KEY, getRedis, getLocalViews } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
    const redis = getRedis();

    try {
        const views = redis
            ? ((await redis.get<number>(VIEWS_KEY)) ?? 0)
            : getLocalViews();

        return NextResponse.json(
            { views },
            { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } },
        );
    } catch {
        return NextResponse.json(
            { views: getLocalViews() },
            { headers: { 'Cache-Control': 'no-store' } },
        );
    }
}