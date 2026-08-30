import { spawn, spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const CWD = process.cwd()
const BLOG_DIR = path.join(CWD, 'content', 'blog')
const IMAGE_DIR = path.join(CWD, 'public', 'blog')
const IMAGE_PREFIX = '/blog'
const REFRESH_MS = 2000

interface Frontmatter {
    title?: string
    description?: string
    date?: string
    image?: string
    isPublished?: boolean
    tags?: string[]
}

interface DraftItem {
    file: string
    title: string
    date?: string
    published: boolean
}

function resolveCommand(cmd: string): string | undefined {
    const runner = process.platform === 'win32' ? 'where.exe' : 'which'
    const res = spawnSync(runner, [cmd], { encoding: 'utf8' })
    if (res.status === 0 && res.stdout) {
        const lines = res.stdout
            .split(/\r?\n/)
            .map((s) => s.trim())
            .filter(Boolean)
        if (process.platform !== 'win32') return lines[0]
        const exe = lines.find((l) => /\.(exe|com)$/i.test(l))
        const script = lines.find((l) => /\.(cmd|bat|ps1)$/i.test(l))
        return exe ?? script ?? lines[0]
    }
    if (process.platform === 'win32') {
        return findInEnvPath(cmd)
    }
    return undefined
}

function commandExists(cmd: string): boolean {
    return resolveCommand(cmd) !== undefined
}

function findInEnvPath(cmd: string): string | undefined {
    const exts = (process.env.PATHEXT ?? '.COM;.EXE;.BAT;.CMD').split(';').filter(Boolean)
    const dirs: string[] = []
    for (const key of [
        'HKCU\\Environment',
        'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment',
    ]) {
        const res = spawnSync('reg', ['query', key, '/v', 'Path'], { encoding: 'utf8' })
        if (res.status !== 0 || !res.stdout) continue
        const match = res.stdout.match(/^\s*Path\s+REG_(?:EXPAND_)?SZ\s+(.*)$/mi)
        if (!match) continue
        dirs.push(match[1])
    }
    for (const raw of dirs) {
        const segments = raw
            .split(';')
            .map((s) => expandEnv(s).trim())
            .filter(Boolean)
        for (const dir of segments) {
            for (const name of exts) {
                const full = path.join(dir, cmd + name)
                try {
                    if (fs.statSync(full).isFile()) return full
                } catch {
                    /* keep scanning */
                }
            }
        }
    }
    return undefined
}

function expandEnv(str: string): string {
    return str.replace(/%([^%]+)%/g, (_, name: string) => process.env[name] ?? `%${name}%`)
}

interface EditorChoice {
    name: string
    path: string
    wait: boolean
}

function pickEditor(): EditorChoice | undefined {
    const chain: { cmd: unknown; wait: boolean }[] = [
        { cmd: process.env.BLOG_EDITOR, wait: false },
        { cmd: 'nvim', wait: false },
        { cmd: process.env.VISUAL, wait: false },
        { cmd: process.env.EDITOR, wait: false },
        { cmd: 'code', wait: true },
    ]
    for (const entry of chain) {
        const name = typeof entry.cmd === 'string' ? entry.cmd.trim().split(/\s+/)[0] : undefined
        if (!name) continue
        const resolved = resolveCommand(name)
        if (resolved) return { name, path: resolved, wait: entry.wait }
    }
    return undefined
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

function ensureDirs(): void {
    fs.mkdirSync(BLOG_DIR, { recursive: true })
    fs.mkdirSync(IMAGE_DIR, { recursive: true })
    const keep = path.join(IMAGE_DIR, '.gitkeep')
    if (!fs.existsSync(keep)) fs.writeFileSync(keep, '')
}

function nextDraftName(): string {
    for (let i = 1; i < 100; i++) {
        const name = i === 1 ? 'untitled.mdx' : `untitled-${i}.mdx`
        if (!fs.existsSync(path.join(BLOG_DIR, name))) return name
    }
    return `untitled-${Date.now()}.mdx`
}

function parseFrontmatter(content: string): Frontmatter {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
    if (!match) return {}
    const fm: Frontmatter = {}
    for (const line of match[1].split(/\r?\n/)) {
        const pair = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
        if (!pair) continue
        const key = pair[1]
        const raw = pair[2].trim()
        if (key === 'tags') {
            fm.tags = raw
                .replace(/^\[|\]$/g, '')
                .split(',')
                .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
                .filter(Boolean)
        } else if (key === 'title' || key === 'description' || key === 'date' || key === 'image') {
            fm[key] = raw.replace(/^['"]|['"]$/g, '')
        } else if (key === 'isPublished') {
            fm.isPublished = raw.toLowerCase() === 'true'
        }
    }
    return fm
}

function stripFrontmatter(content: string): string {
    return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

function firstHeading(body: string): string | undefined {
    for (const line of body.split(/\r?\n/)) {
        const match = line.match(/^#\s+(.+)$/)
        if (match && match[1].trim()) return match[1].trim()
    }
    return undefined
}

function firstParagraph(body: string): string {
    for (const raw of body.split(/\r?\n/)) {
        const line = raw.trim()
        if (!line) continue
        if (/^#{1,6}\s/.test(line)) continue
        if (/^(>|\* |\- |\+ |\d+\.\s)/.test(line)) continue
        if (line.startsWith('```')) continue
        if (/^[-*_]{3,}$/.test(line)) continue
        const clean = line
            .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\*|~/g, '')
            .trim()
        if (clean) return clean.slice(0, 160)
    }
    return ''
}

function yq(value: string): string {
    return `'${value.replace(/'/g, "''")}'`
}

function todayISO(): string {
    const d = new Date()
    const month = `${d.getMonth() + 1}`.padStart(2, '0')
    const day = `${d.getDate()}`.padStart(2, '0')
    return `${d.getFullYear()}-${month}-${day}`
}

function toFileName(arg: string): string {
    return path.basename(arg.replace(/[\\/]/g, path.sep))
}

function list(): DraftItem[] {
    if (!fs.existsSync(BLOG_DIR)) return []
    const items: DraftItem[] = []
    for (const file of fs.readdirSync(BLOG_DIR).sort()) {
        if (!/\.mdx?$/i.test(file)) continue
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
        const fm = parseFrontmatter(raw)
        const body = stripFrontmatter(raw)
        items.push({
            file,
            title: fm.title ?? firstHeading(body) ?? path.basename(file, path.extname(file)),
            date: fm.date,
            published: fm.isPublished === true || Boolean(fm.date),
        })
    }
    return items
}

function showList(): void {
    const items = list()
    if (items.length === 0) {
        console.log('\n  No posts yet. Start one: npm run blog:new')
        return
    }
    console.log('')
    for (const item of items) {
        const status = item.published ? 'published' : 'draft'
        console.log(`  [${status.padEnd(9)}] ${item.file}  ${item.title}${item.date ? '  (' + item.date + ')' : ''}`)
    }
    console.log('')
}

function pickFile(arg: string | undefined): string {
    if (arg && arg.trim()) return toFileName(arg.trim())
    const items = list()
    if (items.length === 1) return items[0].file
    showList()
    return ''
}

function openEditor(file: string): void {
    const choice = pickEditor()
    const abs = path.join(BLOG_DIR, file)

    if (!choice) {
        console.log('\n  Warning: no editor found. Install Neovim (winget install Neovim.Neovim)')
        console.log('  or set $env:BLOG_EDITOR to your editor of choice.')
        console.log(`  The draft is ready at: content/blog/${file}`)
        return
    }

    const args = choice.wait ? ['-w', abs] : [abs]
    console.log(`\n  Editing with ${choice.name}. Close it to continue...`)

    let res: { error?: NodeJS.ErrnoException; status: number | null }
    if (process.platform === 'win32' && /\.(cmd|bat)$/i.test(choice.path)) {
        const line = [choice.path, ...args].map((a) => `"${a}"`).join(' ')
        res = spawnSync(`cmd.exe /d /s /c ${line}`, { stdio: 'inherit', shell: true })
    } else {
        res = spawnSync(choice.path, args, { stdio: 'inherit' })
    }

    if (res.error) {
        console.log(`\n  Warning: editor failed to launch: ${res.error.message}`)
        console.log(`  The draft is ready at: content/blog/${file}`)
    }
}

function previewPane(relPath: string): void {
    if (process.env.BLOG_NO_PREVIEW) {
        console.log('\n  Preview pane disabled (BLOG_NO_PREVIEW is set).')
        return
    }

    const renderer = commandExists('glow') ? 'glow' : commandExists('mdcat') ? 'mdcat' : null

    if (process.platform === 'win32' && commandExists('wt')) {
        const paneCmd = ['split-pane', '-V', '-d', CWD, 'node', '--import', 'tsx', 'scripts/blog.ts', 'preview', relPath]
        const first = spawnSync('wt', ['-w', '0', ...paneCmd], { stdio: 'ignore' })
        if (first.status !== 0) {
            spawnSync('wt', paneCmd, { stdio: 'ignore' })
        }
        console.log('\n  Live preview pane opened in Windows Terminal.')
    } else if (commandExists('tmux') && process.env.TMUX) {
        spawn('tmux', ['split-window', '-h', '-d', `node --import tsx scripts/blog.ts preview ${relPath}`], {
            stdio: 'ignore',
        })
        console.log('\n  Live preview pane opened in tmux.')
    } else {
        console.log('\n  No split terminal detected. In another pane run:')
        console.log(`    npm run blog:preview -- ${relPath}`)
    }

    if (renderer) {
        console.log(`  Renderer: ${renderer} (refreshes as you save)`)
    } else {
        console.log('  Renderer: none, showing raw text. Install glow: winget install charmbracelet.glow')
    }
}

function runPreview(arg?: string): void {
    const relPath = arg ? toFileName(arg) : ''
    if (!relPath) {
        showList()
        console.log('\n  Specify a file: npm run blog:preview -- <file>')
        return
    }
    const abs = path.join(BLOG_DIR, relPath)
    const glow = commandExists('glow')
    const mdcat = commandExists('mdcat')

    console.log(`\n  Live preview: content/blog/${relPath}  (Ctrl+C to stop)`)
    if (!glow && !mdcat) {
        console.log('  No glow/mdcat installed — showing raw markdown. Try: winget install charmbracelet.glow')
    }

    let lastSig = ''
    const render = () => {
        let text = ''
        let sig = ''
        try {
            const stat = fs.statSync(abs)
            sig = `${stat.size}:${stat.mtimeMs}`
            if (sig === lastSig) return
            text = fs.readFileSync(abs, 'utf8')
        } catch {
            sig = `missing:${Date.now()}`
            if (sig === lastSig) return
            text = `\n  (draft not found yet: content/blog/${relPath})\n`
        }
        lastSig = sig
        process.stdout.write('\x1b[2J\x1b[H\x1b[0m')
        if (!text.trim()) {
            console.log('\n  (empty draft — start writing!)')
        } else if (glow) {
            spawnSync('glow', ['--pager', 'never', '--style', 'dark', '-'], {
                input: text,
                stdio: ['pipe', 'inherit', 'inherit'],
            })
        } else if (mdcat) {
            spawnSync('mdcat', ['-'], { input: text, stdio: ['pipe', 'inherit', 'inherit'] })
        } else {
            console.log(text)
        }
    }

    render()
    setInterval(render, REFRESH_MS)
}

function publish(arg?: string): void {
    if (!fs.existsSync(BLOG_DIR)) {
        console.log('\n  Nothing to publish yet — content/blog does not exist. Run: npm run blog:new')
        return
    }

    let file = arg ? toFileName(arg) : ''
    if (!file) {
        const drafts = list()
        const unposted = drafts.filter((d) => !d.published)
        if (unposted.length === 1) file = unposted[0].file
        else if (drafts.length === 1) file = drafts[0].file
        else {
            showList()
            console.log('\n  Specify one: npm run blog:publish -- <file>')
            return
        }
    }

    const abs = path.join(BLOG_DIR, file)
    if (!fs.existsSync(abs)) {
        console.log(`\n  No such file: content/blog/${file}`)
        return
    }

    const raw = fs.readFileSync(abs, 'utf8')
    const prev = parseFrontmatter(raw)
    const body = stripFrontmatter(raw)
    const title = prev.title ?? firstHeading(body) ?? path.basename(file, path.extname(file))
    const description = prev.description ?? firstParagraph(body)
    const date = prev.date ?? todayISO()
    const image = prev.image ?? ''
    const filenameSlug = path.basename(file, path.extname(file))
    const slug = /^(untitled|draft)(-\d+)?$/i.test(filenameSlug) ? slugify(title) : slugify(filenameSlug)
    const tags = prev.tags ?? []

    const frontmatter = [
        '---',
        `title: ${yq(title)}`,
        `description: ${yq(description)}`,
        `image: ${yq(image)}`,
        `tags: [${tags.map((t) => yq(t)).join(', ')}]`,
        `date: ${yq(date)}`,
        'isPublished: true',
        '---',
    ].join('\n')

    fs.writeFileSync(abs, `${frontmatter}\n\n${body.trim()}\n`, 'utf8')

    let finalName = file
    if (slug !== filenameSlug) {
        finalName = `${slug}.mdx`
        let target = path.join(BLOG_DIR, finalName)
        let i = 2
        while (fs.existsSync(target) && path.resolve(target) !== path.resolve(abs)) {
            finalName = `${slug}-${i++}.mdx`
            target = path.join(BLOG_DIR, finalName)
        }
        if (finalName !== file) fs.renameSync(abs, target)
    }

    console.log(`\n  Published: content/blog/${finalName}`)
    console.log(`  Title:  ${title}`)
    console.log(`  Slug:   ${slug}`)
    console.log(`  Date:   ${date}`)
    if (description) console.log(`  Description: ${description}`)
    console.log('\n  Done. The file is ready for your MDX blog (matches sleek-portfolio format).')
}

async function addImage(args: string[]): Promise<void> {
    const source = args[0]
    if (!source) {
        console.log('\n  Usage: npm run blog:img -- <image-file-or-url> [alt text]')
        console.log('  Copies the image into public/blog/ and prints the markdown to paste.')
        return
    }
    const alt = args.slice(1).join(' ').trim()
    ensureDirs()

    let base: string
    let buffer: Buffer

    if (/^https?:\/\//i.test(source)) {
        try {
            const res = await fetch(source)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            buffer = Buffer.from(await res.arrayBuffer())
            const urlPath = new URL(source).pathname
            base = decodeURIComponent(path.posix.basename(urlPath)) || 'image.png'
        } catch (err) {
            console.log(`\n  Failed to download image: ${err instanceof Error ? err.message : err}`)
            return
        }
    } else {
        const srcPath = path.resolve(CWD, source)
        if (!fs.existsSync(srcPath)) {
            console.log(`\n  File not found: ${source}`)
            return
        }
        buffer = fs.readFileSync(srcPath)
        base = path.basename(srcPath)
    }

    const ext = (path.extname(base) || '.png').toLowerCase()
    const stem = slugify(path.basename(base, path.extname(base))) || 'image'
    let name = `${stem}${ext}`
    if (fs.existsSync(path.join(IMAGE_DIR, name))) {
        name = `${stem}-${Date.now()}${ext}`
    }
    fs.writeFileSync(path.join(IMAGE_DIR, name), buffer)

    const markdown = `![${alt || stem}](${IMAGE_PREFIX}/${name})`
    console.log(`\n  Copied: ${path.posix.join('public', 'blog', name)}`)
    console.log(`  Paste this in your draft:\n\n    ${markdown}\n`)
}

function summarizeAfterEdit(file: string): void {
    const abs = path.join(BLOG_DIR, file)
    if (!fs.existsSync(abs)) return
    if (fs.statSync(abs).size === 0) {
        console.log('\n  The draft is still empty. It will just sit in content/blog until written.')
    }
    console.log('\n  Next steps:')
    console.log(`    npm run blog:publish -- ${file}    generate frontmatter from the file`)
    console.log(`    npm run blog:img -- <image> [alt]  copy an image into public/blog`)
    console.log('    npm run blog:list                  see all drafts and posts')
}

async function newPost(): Promise<void> {
    ensureDirs()
    const file = nextDraftName()
    fs.writeFileSync(path.join(BLOG_DIR, file), '', 'utf8')
    console.log(`\n  Blank draft: content/blog/${file}`)
    console.log('  Write freely in Markdown. Start with "# Title" on the first line.')
    console.log('  Images live in public/blog and are referenced as ![alt](/blog/name.png)')
    previewPane(file)
    openEditor(file)
    summarizeAfterEdit(file)
}

async function openPost(args: string[]): Promise<void> {
    ensureDirs()
    const file = pickFile(args[0])
    if (!file) return
    const abs = path.join(BLOG_DIR, file)
    if (!fs.existsSync(abs)) {
        console.log(`\n  No such file: content/blog/${file}`)
        return
    }
    console.log(`\n  Opening content/blog/${file}`)
    previewPane(file)
    openEditor(file)
    summarizeAfterEdit(file)
}

function help(): void {
    console.log(`
  Blog - terminal writing workspace (no setup, no prompts)

  Commands
    blog:new                    create a blank draft in content/blog and open your editor
    blog:open [file]            open an existing draft (omit file when only one exists)
    blog:publish [file]         generate YAML frontmatter from the file, rename to slug.mdx
    blog:preview [file]         live-render the draft in this terminal (needs glow or mdcat)
    blog:img <src> [alt]        copy an image into public/blog, print the markdown
    blog:list                   list drafts and published posts

  Layout
    content/blog/*.mdx          your drafts and posts (plain Markdown)
    public/blog/*               images, referenced as ![alt](/blog/name.png)

  Flow
    1. npm run blog:new         write freely, add ![alt](/blog/..) anywhere
    2. npm run blog:publish -- <file>
    3. done - file is ready for your Next.js MDX blog

  Notes
    Editor order: $env:BLOG_EDITOR -> nvim -> $env:VISUAL/$env:EDITOR -> VS Code
    Preview: splits in Windows Terminal or tmux; otherwise run blog:preview manually
    Install glow (winget install charmbracelet.glow) or mdcat for rendered preview
`)
}

async function main() {
    const cmd = process.argv[2] ?? 'help'
    const args = process.argv.slice(3).filter((a) => a !== '--')

    switch (cmd) {
        case 'new':
            return newPost()
        case 'open':
            return openPost(args)
        case 'publish':
            return publish(args[0])
        case 'preview':
            return runPreview(args[0])
        case 'img':
            return addImage(args)
        case 'list':
            return showList()
        case 'help':
        case '--help':
        case '-h':
            return help()
        default:
            console.log(`\n  Unknown command: ${cmd}`)
            return help()
    }
}

main().catch((err) => {
    console.error('\n  Unexpected error:', err)
    process.exit(1)
})