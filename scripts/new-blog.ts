import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs.ts');

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function calculateReadTime(content: string): string {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
}

function formatDate(d: Date): string {
    return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function escapeTemplateString(str: string): string {
    return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
}

async function main() {
    console.log('\n✨ Create a New Blog Post ✨\n');

    if (!fs.existsSync(BLOGS_FILE)) {
        console.error(`❌ Error: File not found at ${BLOGS_FILE}`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(BLOGS_FILE, 'utf-8');

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: '📝 Blog Title:',
            validate: (input: string) => (input.trim() ? true : 'Title is required.'),
        },
        {
            type: 'input',
            name: 'description',
            message: '📄 Short Description / Subtitle:',
            validate: (input: string) => (input.trim() ? true : 'Description is required.'),
        },
        {
            type: 'input',
            name: 'tags',
            message: '🏷️  Tags (comma-separated, e.g. TypeScript, Backend, WebDev):',
            default: 'WebDev, TypeScript',
            filter: (input: string) =>
                input
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
        },
        {
            type: 'list',
            name: 'platform',
            message: '🌐 Publishing Platform:',
            choices: ['Internal', 'Medium', 'Dev.to', 'Substack'],
            default: 'Internal',
        },
        {
            type: 'input',
            name: 'externalUrl',
            message: '🔗 External Article URL (optional, leave blank if none):',
            when: (ans) => ans.platform !== 'Internal',
            default: '',
        },
        {
            type: 'input',
            name: 'image',
            message: '🖼️  Cover Image URL (optional, press enter to use default):',
            default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
        },
        {
            type: 'editor',
            name: 'content',
            message: '✍️  Article Content (Markdown supported):',
            default: `
## Introduction

Write your introduction here...

## First Section

Explain your thoughts, architectural decisions, and learnings...

\`\`\`typescript
// Code blocks will automatically get syntax highlighting and copy buttons!
const greeting = "Hello, world!";
console.log(greeting);
\`\`\`

## Conclusion

Wrap up your key takeaways...
            `.trim(),
            validate: (input: string) => (input.trim() ? true : 'Content cannot be empty.'),
        },
    ]);

    const slug = slugify(answers.title);
    const id = slug;

    // Check for duplicate slug
    const slugRegex = new RegExp(`slug:\\s*['"\`]${slug}['"\`]`, 'i');
    const idRegex = new RegExp(`id:\\s*['"\`]${id}['"\`]`, 'i');
    if (slugRegex.test(fileContent) || idRegex.test(fileContent)) {
        console.error(`\n❌ Error: A blog post with slug "${slug}" already exists in data/blogs.ts!`);
        console.error('Please choose a different title or update the existing post.\n');
        process.exit(1);
    }

    const todayDate = formatDate(new Date());
    const readTime = calculateReadTime(answers.content);
    const escapedContent = escapeTemplateString(answers.content.trim());
    const tagsArrayStr = JSON.stringify(answers.tags);

    const newBlogEntry = `    {
        id: '${id}',
        slug: '${slug}',
        title: ${JSON.stringify(answers.title)},
        description: ${JSON.stringify(answers.description)},
        date: '${todayDate}',
        readTime: '${readTime}',
        claps: 0,
        tags: ${tagsArrayStr},
        image: '${answers.image || ''}',
        platform: '${answers.platform || 'Internal'}',
        externalUrl: '${answers.externalUrl || ''}',
        published: true,
        content: \`
${escapedContent}
        \`,
    },
`;

    // Find the array insertion point
    const arrayStartMatch = fileContent.match(/export\s+const\s+blogs\s*:\s*Blog\[\]\s*=\s*\[/);

    if (!arrayStartMatch || arrayStartMatch.index === undefined) {
        console.error('❌ Error: Could not find "export const blogs: Blog[] = [" in data/blogs.ts');
        process.exit(1);
    }

    const insertIndex = arrayStartMatch.index + arrayStartMatch[0].length;
    const updatedContent =
        fileContent.slice(0, insertIndex) + '\n' + newBlogEntry + fileContent.slice(insertIndex);

    fs.writeFileSync(BLOGS_FILE, updatedContent, 'utf-8');

    console.log('\n🎉 Successfully added new blog post!');
    console.log(`📌 Title:     ${answers.title}`);
    console.log(`🔗 Slug:      ${slug}`);
    console.log(`📅 Date:      ${todayDate}`);
    console.log(`⏱️  Read Time: ${readTime}`);
    console.log(`🌐 Live URL:  http://localhost:3000/portfolio/blogs/${slug}\n`);
}

main().catch((err) => {
    console.error('\n❌ Unexpected error:', err);
    process.exit(1);
});
