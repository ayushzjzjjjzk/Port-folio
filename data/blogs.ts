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