export interface Blog {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    date: string;
    readTime: string;
    claps: number;
    tags: string[];
    image?: string;
    platform?: string; // 'Medium' | 'Dev.to' | 'Substack' | 'Internal'
    externalUrl?: string;
    published: boolean;
}

export const blogs: Blog[] = [
    {
        id: 'how-to-fuck-around-and-find-out',
        slug: 'how-to-fuck-around-and-find-out',
        title: 'How to Fuck Around and Find Out',
        description: 'A guide to the unconventional way of learning.',
        date: 'August 22, 2026',
        readTime: '6 min read',
        claps: 234,
        tags: ['Learning', 'Engineering', 'Philosophy'],
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
        platform: 'Internal',
        published: true,
        content: `
Hey, it's been a while since i wrote the last article. In this article i'm going to talk about "How to learn?" & "How to fuck around and find out"

It's not about just code or academia, it's the core problem i faced with learning and how i learned to learn in a very unconventional way.

But before talking about that i think its worth understanding the conventional way most people learn, so we have a little better understanding on why this unconventional way of learning might be good for you.

## The problem with conventional learning

Conventionally we are taught to learn in a linear way. for example

If you wanted to learn web-sockets, in order to learn web-socket you first need to learn about

\`TCP → HTTP → WebSocket upgrade handshake → web-sockets\`

this is how you would learn web-sockets. But there are couple of problems with this approach.

1. You might drop off in between because the WebSocket upgrade handshake doesn't make any sense
2. You skipped one topic in between
3. You didn't even know what a protocol is and yet you started from TCP

in short the problem is with understanding. you might have/had less context or you skipped or misunderstood a piece of information without knowing.

If you misunderstood something you will get to know the misunderstanding once you reach web-socket. you will realize how shallow your understanding was about http or maybe about TCP since the beginning and that wastes a lot of time relearning and enforcing new info in the brain.

## The asymmetric encryption

In my college around 2nd year i learned about asymmetric encryption and the concept of public and private key.

if you encrypt a message or information with private key then only private key can decrypt it

but i never understood how you send the keys over from server to client. if you send the private key over the internet to the client then what's the point.

It's a security flaw?

with this misunderstanding i graduated from my college (almost) and when i was having a convo with one of the senior devops engineer and i was understanding how website SSL certs work, asymmetric encryption was one of the key concepts being used there.

when he said we encrypt with private key and send the encrypted message + public key to the client and i was like how the client is going to decrypt it?

He smiled and understood the knowledge gap, explained the whole asymmetric encryption from scratch and then i understood how it works.

in short: you never send the private key over the internet. the server keeps the private key. the public key is meant to be public, you can send it freely.

## The Unconventional Way: Break Things First

This brings us to the core philosophy: **Fuck around and find out**.

Instead of following rigid tutorials from step 0 to step 100:
1. **Jump straight to building the end goal.**
2. **Break things early.** When it fails, work backwards to find *why* it broke.
3. **Connect dots organically.** Your curiosity drives the learning, not a dry curriculum.

When you learn by doing, knowledge sticks permanently.
        `,
    },
    {
        id: 'convex-terminaltype',
        slug: 'convex-terminaltype',
        title: 'Understanding Convex Through TerminalType: My Real-Time Typing App',
        description: 'How I built a real-time multiplayer typing app with Convex as the backend, and what I learned about reactive databases along the way.',
        date: 'Oct 24, 2025',
        readTime: '5 min read',
        claps: 151,
        tags: ['Convex', 'Realtime', 'Backend', 'TypeScript'],
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
        platform: 'Medium',
        externalUrl: 'https://medium.com/@ayushsinghramola02/ayush-singh-ramola-f597f5d7dff1',
        published: true,
        content: `
## The Problem with Traditional Real-Time Architectures

When building multiplayer real-time applications like **TerminalType** (a competitive typing speed test platform where multiple users race simultaneously in terminal-style rooms), the traditional tech stack usually looks like this:

1. **A relational database** (PostgreSQL / MySQL) for user profiles, rooms, and historical match stats.
2. **A Redis instance** for managing active websocket connections, pub/sub channels, and live room states.
3. **A dedicated Node.js websocket server** (Socket.io or ws) orchestrating connections, reconnections, and broadcasting deltas.

While this architecture is battle-tested, it introduces massive operational complexity:
- Cache invalidation and state synchronization between Redis and Postgres.
- Managing socket connection lifetimes, heartbeats, and room cleanups.
- Maintaining separate database schemas, migration pipelines, and API endpoints.

\`\`\`typescript
// Traditional approach: Synchronizing websocket broadcast with persistent database
io.on("connection", (socket) => {
  socket.on("progress_update", async (data) => {
    // 1. Update cache in Redis
    await redis.hset(\`room:\${data.roomId}\`, data.userId, data.wpm);
    // 2. Broadcast to all peers
    socket.to(data.roomId).emit("peer_progress", data);
    // 3. Queue persistence to PostgreSQL
    await queue.add("persist_progress", data);
  });
});
\`\`\`

---

## Why Convex Changed Everything

[Convex](https://www.convex.dev/) is an entirely reactive backend platform. Instead of manual pub/sub or socket multiplexing, **Convex functions are automatically reactive queries**. When a document changes in the Convex database, any client subscribed to that query automatically receives the latest state diff with sub-millisecond propagation over a persistent WebSocket connection.

Here is what the TerminalType game loop looks like in Convex:

\`\`\`typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Reactive Query: React components automatically re-render when room state changes
export const getRoomState = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const participants = await ctx.db
      .query("participants")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    return { room, participants };
  },
});

// Mutation: Atomic progress updates executed transactionally
export const updateProgress = mutation({
  args: {
    participantId: v.id("participants"),
    progress: v.number(),
    wpm: v.number(),
    accuracy: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.participantId, {
      progress: args.progress,
      wpm: args.wpm,
      accuracy: args.accuracy,
      lastActive: Date.now(),
    });
  },
});
\`\`\`

---

## Key Takeaways from Building TerminalType

### 1. Automatic Reactive Subscriptions
On the frontend, consuming the reactive query is as simple as calling a single React hook:

\`\`\`tsx
export function GameRoom({ roomId }: { roomId: Id<"rooms"> }) {
  // Automatically stays in sync via WebSocket!
  const gameState = useQuery(api.rooms.getRoomState, { roomId });

  if (!gameState) return <TerminalSpinner />;

  return (
    <div className="terminal-board">
      {gameState.participants.map((player) => (
        <PlayerProgressBar key={player._id} player={player} />
      ))}
    </div>
  );
}
\`\`\`

### 2. Optimistic UI Updates
For a typing app, latency is the ultimate metric. Convex provides built-in optimistic updates. When the user types a keystroke, the local state updates instantly while the mutation is confirmed in the background.

### 3. End-to-End Type Safety
Every table schema, query argument, and return type is strictly generated from TypeScript definitions. If you alter a table column or query parameter, TypeScript flags every single component and backend handler across the repository.

---

## Conclusion

Building TerminalType with Convex eliminated over 60% of the boilerplate code typically required for WebSockets and Redis pub/sub. If you are building collaborative tools, multiplayer games, or live dashboards, reactive databases represent the future of backend development.
        `,
    },
    {
        id: 'high-performance-backend',
        slug: 'high-performance-backend',
        title: 'Building High-Performance Backend Systems in Node.js & TypeScript',
        description: 'Deep dive into event loop mechanics, thread pools, memory leaks, streaming I/O, and clustering for high-concurrency Node.js services.',
        date: 'Jan 15, 2026',
        readTime: '7 min read',
        claps: 94,
        tags: ['Backend', 'Node.js', 'TypeScript', 'Performance', 'Networking'],
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
        platform: 'Internal',
        published: true,
        content: `
## The Node.js Concurrency Model: How It Really Works

Node.js is single-threaded at its JavaScript execution layer, but fully asynchronous and multi-threaded under the hood through **libuv**. Understanding how the event loop operates is essential to writing high-throughput backend services.

The event loop executes in distinct phases:
1. **Timers**: Executes callbacks scheduled by \`setTimeout\` and \`setInterval\`.
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration.
3. **Idle, Prepare**: Internal libuv housekeeping.
4. **Poll**: Retrieves new I/O events; executes I/O related callbacks.
5. **Check**: Executes \`setImmediate()\` callbacks.
6. **Close Callbacks**: Handles socket close events (\`socket.on('close')\`).

\`\`\`typescript
// Understanding microtask vs macrotask execution order:
console.log("1. Synchronous");

setTimeout(() => console.log("2. Timer (Macrotask)"), 0);

Promise.resolve().then(() => console.log("3. Microtask (Promise)"));

process.nextTick(() => console.log("4. nextTick (Highest microtask priority)"));

setImmediate(() => console.log("5. Immediate (Check phase)"));

// Output order: 1 -> 4 -> 3 -> 2 -> 5
\`\`\`

---

## Zero-Copy Streams and Backpressure Handling

One of the most common pitfalls in Node.js backends is buffering large payloads entirely into V8 memory. When handling file uploads, log aggregation, or large database dumps, always stream using pipeline to prevent memory exhaustion:

\`\`\`typescript
import { pipeline } from "stream/promises";
import { createReadStream, createWriteStream } from "fs";
import { createGzip } from "zlib";

export async function compressLargeFile(source: string, destination: string) {
  try {
    await pipeline(
      createReadStream(source),
      createGzip(),
      createWriteStream(destination)
    );
    console.log("Compression pipeline completed successfully without memory spikes.");
  } catch (err) {
    console.error("Pipeline failed:", err);
  }
}
\`\`\`

---

## Production Best Practices for Scale

- **Cluster Mode & Worker Threads**: Utilize all CPU cores using Node.js cluster module or PM2.
- **Connection Pooling**: Always configure max connection pools on PostgreSQL/MongoDB clients to avoid port exhaustion.
- **Circuit Breakers**: Wrap external downstream API calls in circuit breakers (e.g. Opossum) to fail fast during outages.
- **Garbage Collection Optimization**: Monitor V8 heap usage and avoid retaining circular references in global closures.
        `,
    },
    {
        id: 'nextjs-architecture-guide',
        slug: 'nextjs-architecture-guide',
        title: 'Mastering Modern Next.js: Server Components, Streaming & Caching Patterns',
        description: 'An architectural deep-dive into Server Components, boundary composition, streaming with Suspense, and edge caching strategies.',
        date: 'Feb 10, 2026',
        readTime: '6 min read',
        claps: 112,
        tags: ['Next.js', 'React', 'Frontend', 'Architecture'],
        image: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=1200&auto=format&fit=crop',
        platform: 'Internal',
        published: true,
        content: `
## The React Server Component (RSC) Mental Model

React Server Components represent a fundamental shift in web architecture. Instead of bundling your data fetching logic and heavyweight dependencies into the client JavaScript bundle, RSCs execute purely on the server and stream serialized UI directly to the browser.

### Key Benefits of RSCs:
- **Zero Client Bundle Impact**: Libraries used inside Server Components (like date formatting, markdown parsers, Prisma clients) add zero kilobytes to the client bundle.
- **Direct Database Access**: Query databases directly from your component tree without creating intermediate REST API routes.
- **Secure by Default**: Database credentials, API tokens, and private logic remain on the server.

\`\`\`tsx
// app/dashboard/page.tsx (Server Component)
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { AnalyticsChart } from '@/components/AnalyticsChart';
import { SkeletonLoader } from '@/components/SkeletonLoader';

export default async function DashboardPage() {
  // Direct database query on the server!
  const stats = await db.analytics.getSummary();

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Live Metrics</h1>
      
      {/* Streamed interactive client component */}
      <Suspense fallback={<SkeletonLoader />}>
        <AnalyticsChart initialData={stats} />
      </Suspense>
    </main>
  );
}
\`\`\`

---

## Composing Server and Client Components

The golden rule of Next.js App Router: **Push client boundaries to the leaves of your component tree**.

\`\`\`
┌──────────────────────────────────────────────┐
│  Server Component (Page Layout, Data Fetch)  │
│  ┌────────────────────────────────────────┐  │
│  │ Client Component (Interactive Button)  │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ Server Component (Static Content)      │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
\`\`\`

By maintaining Server Components as the root wrapper and passing server-rendered content as \`children\` to Client Components, you achieve instant loading speeds with minimal hydration cost.
        `,
    },
];

export function getAllBlogs(): Blog[] {
    return blogs.filter((b) => b.published);
}

export function getBlogBySlug(slug: string): Blog | undefined {
    const normalized = decodeURIComponent(slug).toLowerCase().trim();
    return blogs.find(
        (b) => b.slug.toLowerCase().trim() === normalized || b.id.toLowerCase().trim() === normalized
    );
}

export function getAllTags(): string[] {
    const tagSet = new Set<string>();
    blogs.forEach((b) => b.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
}