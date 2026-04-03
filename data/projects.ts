import {Project} from "@/components/ProjectCard"

export const projects: Project[ ] = [
        {
        id: 'logical-and-reasoning',
        title: 'Logical and Reasoning',
        description: 'a place where you can practice logical and reasoning questions for competitive exams like CAT, GRE, etc.',
        techStack: [ 'React', 'JavaScript', 'Tailwind', 'motion' ,'Framer Motion'],
        status: 'Live',
        githubUrl: 'https://github.com/ayushzjzjjjzk/logical-and-reasoning',
        liveUrl: 'https://logical-and-reasoning.vercel.app/',
        image: '/videos/projects/logical-and-reasoning.png',
        postUrl: '',
        videoUrl: "/videos/projects/logical-and-reasoning.mp4",
    },
    {
        id: 'mathx',
        title: 'MathX',
        description: 'A platform for interactive math learning with real-time problem solving and personalized feedback.',
        techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma', 'MongoDB'],
        status: 'Live',
        githubUrl: 'https://github.com/ayushzjzjjjzk/MathX',
        liveUrl: 'https://math-x-rouge.vercel.app/',
        image: '/videos/projects/mathx.png',
        postUrl: '', // ✅ FIXED (added missing postUrl)
        videoUrl: '/videos/projects/mathx.mp4',
    },  {
        id: 'movieVerse',
        title: 'MovieVerse',
        description: 'A movie discovery app that provides personalized recommendations, detailed information, and user reviews for a vast collection of films.',
        techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Leaflet'],
        status: 'Live',
        githubUrl: 'https://github.com/ayushzjzjjjzk/movie',
        liveUrl: 'https://movie-iota-inky.vercel.app/',
        image: '/videos/projects/movieverse.png',
        postUrl: '',
        videoUrl: '/videos/projects/movieverse.mp4',
    },

      



]