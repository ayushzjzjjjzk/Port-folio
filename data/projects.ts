import {Project} from "@/components/ProjectCard"

export const projects: Project[ ] = [
        {
        id: 'logical and reasoning',
        title: 'Logical and Reasoning',
        description: 'a place where you can practice logical and reasoning questions for competitive exams like CAT, GRE, etc.',
        techStack: [ 'React', 'JavaScript', 'Tailwind', 'motion' ,'Framer Motion'],
        status: 'Live',
        githubUrl: 'https://github.com/ayushzjzjjjzk/logical-and-reasoning',
        liveUrl: 'https://logical-and-reasoning.vercel.app/',
        image: '/images/projects/logical-and-reasoning.png',
        postUrl: '',
        videoUrl: '',
    },
    {
        id: 'goatcast',
        title: 'goatcast',
        description: 'A podcast-like platform for curated YouTube videos. Browse hand-picked podcasts by genre, submit new content for review, and manage everything through a secure admin dashboard with automated YouTube metadata fetching.',
        techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma', 'MongoDB', 'YouTube API'],
        status: 'Live',
        githubUrl: 'https://github.com/pranav718/goatcast',
        liveUrl: 'https://goatcast.vercel.app',
        image: '/images/projects/goatcast.png',
        postUrl: 'https://x.com/knightkun__/status/1964361515999645724',
        videoUrl: '/videos/projects/goatcast.mp4',
    },  {
        id: 'atlas',
        title: 'atlas (uniway)',
        description: 'A campus navigation web app for MUJ featuring an interactive map with Leaflet, real-time predictive search, dynamic location markers, and live open/closed status. Built as a team project with plans for turn-by-turn and indoor navigation.',
        techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Leaflet'],
        status: 'Live',
        githubUrl: 'https://github.com/pranav718/Atlas',
        liveUrl: 'https://atlas-9m7h.vercel.app',
        image: '/images/projects/atlas.png',
    },

      {
        id: 'nanimo',
        title: 'Nanimo',
        description: 'A visually immersive web app for exploring trending anime and manga, featuring custom shader-based 3D effects and interactive canvas animations. Currently in development.',
        techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Three.js', 'Zustand'],
        status: 'In Progress',
        githubUrl: 'https://github.com/pranav718/nanimo',
        image: '/images/projects/in-progress.png',
    },



]