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
        id: 'who-is-ayush',
        slug: 'who-is-ayush',
        title: "WHO IS AYUSH ",
        description: "A personal story about my journey through college, coding, confusion, failures, and figuring out who I want to become.",
        date: 'August 30, 2026',
        readTime: '5 min read',
        claps: 0,
        tags: ["personal"],
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
        platform: 'Internal',
        externalUrl: '',
        published: true,
        content: `
A personal story about my journey through college, coding, confusion, failures, and figuring out who I want to become.

I'm Ayush.

I'm not a coding prodigy who built apps at age twelve. I didn't win hackathons in school or publish papers in college. I'm just a guy who showed up, got confused, broke things, and slowly — very slowly — started figuring out who I want to become.

This is that story, in the messiest order it actually happened.

## Where it all started

My first line of code wasn't a "Hello World". It was me desperately copy-pasting a C program in my first semester and praying the output would match whatever the lab manual said.

\`\`\`c
#include <stdio.h>

int main() {
    printf("Hello, I have no idea what I'm doing.\\n");
    return 0;
}
\`\`\`

It printed. I didn't understand a single byte of it. But that moment — seeing my machine literally do what I told it to — planted something. Not talent. Curiosity. And curiosity turned out to be the only thing that ever mattered.

## College and the learning trap

College introduced me to the biggest trap of self-taught development: the tutorial treadmill.

I'd finish a course, feel like a god, open a blank project, and freeze. The gap between what I consumed and what I could build was enormous. I kept collecting YouTube certificates like Pokémon cards while shipping absolutely nothing.

> Watching tutorials is the most comfortable way to feel like you're learning. Shipping ugly code is the only way you actually do.

## The failure that hurt

I built my first "real" project — a movie discovery app — and confidently put it on my resume before it even worked.

It didn't work. The deployment was embarrassing. The codebase was a monolith of copied Stack Overflow answers I didn't understand. I showed it to a senior dev, and he asked me one question I'll never forget: "Can you explain why this works?"

I couldn't.

That failure hurt more than any exam mark. But it taught me the difference between writing code and understanding code. I stopped hoarding knowledge and started building things badly on purpose — just to unblock the parts I was avoiding.

## Building anyway

I kept shipping, and each project taught me one concrete thing:

- **Logical and Reasoning** taught me that a "simple" project still has real edge cases — and that state management is where software goes to die.
- **MathX** taught me how to actually use a database, not just watch a diagram of one.
- **DSA-BUDDY** taught me to respect fundamentals. Everything clicked once I stopped skipping the boring parts.
- **Hatch** taught me how a real product thinks: users have jobs, and a platform just makes the handshake easier.
- **Samvidhan** taught me that accessibility and clarity are features, not afterthoughts.

None of them are perfect. Some of them I'd rebuild entirely today. But they're mine, and each one answers the question I'm now willing to ask myself honestly.

## The turning point

The turning point wasn't landing some job or a big browser tab count. It was a habit shift: I started writing down what I learned, even when nobody read it.

Whether it's a markdown file nobody opens or a blog post with zero claps, the act of explaining forces me to admit what I don't know. That's when the confusion turned from an enemy into a compass.

\`\`\`typescript
// Learning, reframed:
function learn(topic: string) {
  let confusion = 1;
  return confusion++; // You're doing it right.
}
\`\`\`

## Where I'm headed

I'm still figuring out the exact destination. But the direction is clear: build things that matter to people, understand my tools deeply, and keep writing it all down so the next version of me doesn't have to relearn it.

## Key Takeaways

- Confusion is the default state of learning — it's not a bug, it's the signal you're doing it right
- Building badly on purpose beats consuming tutorials perfectly
- Explaining what you built is how you actually learn it
- Ship things, even the embarrassing ones — each one makes the next one better
- Write things down for the future you

> I wrote this the way I actually think: messy, honest, and slightly unfinished. If any part of it resonates, reach out — the whole point of this blog is connecting with builders like you.
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