import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs.ts');

interface BlogItem {
    id: string;
    slug: string;
    title: string;
    date: string;
}

function parseBlogs(content: string): BlogItem[] {
    const items: BlogItem[] = [];
    const blockRegex = /{\s*id:\s*['"`](.*?)['"`],\s*slug:\s*['"`](.*?)['"`],\s*title:\s*(?:['"`](.*?)['"`]|"(.*?)"),[\s\S]*?date:\s*['"`](.*?)['"`]/g;
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(content)) !== null) {
        items.push({
            id: match[1],
            slug: match[2],
            title: match[3] || match[4] || match[1],
            date: match[5],
        });
    }

    return items;
}

async function main() {
    console.log('\n🗑️  Delete a Blog Post 🗑️\n');

    if (!fs.existsSync(BLOGS_FILE)) {
        console.error(`❌ Error: File not found at ${BLOGS_FILE}`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(BLOGS_FILE, 'utf-8');
    const blogs = parseBlogs(fileContent);

    if (blogs.length === 0) {
        console.log('ℹ️  No blog posts found in data/blogs.ts.\n');
        return;
    }

    const { selectedSlug } = await inquirer.prompt([
        {
            type: 'select',
            name: 'selectedSlug',
            message: 'Select the blog post you want to delete:',
            choices: blogs.map((b) => ({
                name: `${b.title} (${b.date}) [/${b.slug}]`,
                value: b.slug,
            })),
        },
    ]);

    const { confirmDelete } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmDelete',
            message: `⚠️  Are you sure you want to permanently delete "${selectedSlug}"?`,
            default: false,
        },
    ]);

    if (!confirmDelete) {
        console.log('\n❌ Deletion cancelled.\n');
        return;
    }

    // Regex to match the complete blog entry object for the given slug
    const entryRegex = new RegExp(
        `\\s*{\\s*id:\\s*['"\`]${selectedSlug}['"\`][\\s\\S]*?published:\\s*(?:true|false),[\\s\\S]*?content:\\s*\`[\\s\\S]*?\`\\s*,?\\s*},?`,
        'i'
    );

    if (!entryRegex.test(fileContent)) {
        console.error(`❌ Error: Could not locate blog entry for "${selectedSlug}" in data/blogs.ts`);
        process.exit(1);
    }

    const updatedContent = fileContent.replace(entryRegex, '');
    fs.writeFileSync(BLOGS_FILE, updatedContent, 'utf-8');

    console.log(`\n✅ Successfully deleted blog post: "${selectedSlug}" from data/blogs.ts!\n`);
}

main().catch((err) => {
    console.error('\n❌ Unexpected error:', err);
    process.exit(1);
});
