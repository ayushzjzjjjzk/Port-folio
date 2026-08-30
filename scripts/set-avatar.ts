import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

const PUBLIC_IMAGES = path.join(process.cwd(), 'public', 'images');
const NAVBAR_FILE = path.join(process.cwd(), 'components', 'Navbar.tsx');
const PORTFOLIO_FILE = path.join(process.cwd(), 'app', 'portfolio', 'page.tsx');
const NEXT_CACHE_IMAGES = path.join(process.cwd(), '.next', 'cache', 'images');

const AVATAR_SRC_REGEX = /\/images\/avatar[^"'` )]*\.jpg/g;
const AVATAR_FILE_REGEX = /^avatar.*\.jpg$/i;

function getTimestampedName(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `avatar-v${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(
        date.getHours(),
    )}${pad(date.getMinutes())}${pad(date.getSeconds())}.jpg`;
}

function updateSources(src: string): void {
    for (const file of [NAVBAR_FILE, PORTFOLIO_FILE]) {
        if (!fs.existsSync(file)) {
            console.error(`❌ Skipping missing file: ${file}`);
            continue;
        }
        const content = fs.readFileSync(file, 'utf-8');
        const updated = content.replace(AVATAR_SRC_REGEX, src);
        fs.writeFileSync(file, updated, 'utf-8');
    }
}

function clearImageCache(): void {
    if (fs.existsSync(NEXT_CACHE_IMAGES)) {
        fs.rmSync(NEXT_CACHE_IMAGES, { recursive: true, force: true });
        console.log('🧹 Cleared Next.js image cache (.next/cache/images)');
    }
}

function removeOldAvatars(): void {
    for (const entry of fs.readdirSync(PUBLIC_IMAGES)) {
        if (AVATAR_FILE_REGEX.test(entry)) {
            fs.unlinkSync(path.join(PUBLIC_IMAGES, entry));
            console.log(`🗑️  Removed old ${entry}`);
        }
    }
}

async function main() {
    console.log('\n🖼️  Update Avatar Photo 🖼️\n');

    if (!fs.existsSync(PUBLIC_IMAGES)) {
        console.error(`❌ Error: Images folder not found at ${PUBLIC_IMAGES}`);
        process.exit(1);
    }

    const answers = await inquirer.prompt<{ source: string }>([
        {
            type: 'input',
            name: 'source',
            message: '📁 Full path to your new photo (e.g. D:\\Ayush\\yt videos\\photo.jpg):',
            validate: (input: string) => {
                if (!input.trim()) return 'Path is required.';
                try {
                    if (!fs.statSync(input.trim()).isFile()) return 'Not a file.';
                } catch {
                    return 'File not found.';
                }
                return true;
            },
        },
    ]);

    const sourcePath = answers.source.trim();
    const newName = getTimestampedName(new Date());
    const destination = path.join(PUBLIC_IMAGES, newName);
    const publicSrc = `/images/${newName}`;

    removeOldAvatars();
    fs.copyFileSync(sourcePath, destination);
    updateSources(publicSrc);
    clearImageCache();

    console.log('\n✅ Avatar updated successfully!');
    console.log(`📂 Saved as: ${destination}`);
    console.log(`🖼️  Served at: ${publicSrc} (in Navbar + Portfolio)`);
    console.log('🔃 Reload http://localhost:3000 with Ctrl+Shift+R to see it.');
}

main().catch((err) => {
    console.error('\n❌ Unexpected error:', err);
    process.exit(1);
});