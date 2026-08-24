import { NextResponse } from 'next/server';

// Simple in-memory view count tracker (can be connected to a DB or KV store in production)
let viewCount = 142;

export async function GET() {
  return NextResponse.json({ views: viewCount });
}

export async function POST() {
  viewCount += 1;
  return NextResponse.json({ views: viewCount });
}
