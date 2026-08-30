import { Redis } from '@upstash/redis';

export const VIEWS_KEY = 'portfolio:views';

let client: Redis | null | undefined;

export function getRedis(): Redis | null {
    if (client !== undefined) return client;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    client = url && token ? new Redis({ url, token }) : null;
    return client;
}

let localViews = 0;

export function getLocalViews(): number {
    return localViews;
}

export function incrementLocalViews(): number {
    localViews += 1;
    return localViews;
}