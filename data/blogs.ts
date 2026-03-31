export interface Blog {
    id: string;
    title: string;
    url: string;
    date: string;
    claps: number;
    tags: string[];
}

export const blogs: Blog[] = [
    {
        id: 'convex-terminaltype',
        title: 'Understanding Convex Through TerminalType: My Real-Time Typing App',
        url: 'https://medium.com/@knightkun/understanding-convex-through-terminaltype-my-real-time-typing-app-59af77041922',
        date: 'Oct 2025',
        claps: 151,
        tags: ['Convex', 'Realtime Applications', 'Backend Engineering'],
    },
];