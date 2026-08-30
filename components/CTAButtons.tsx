'use client';

export default function CTAButtons() {
    return (
        <div className="flex items-center gap-5 mt-8">
            <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 px-5 py-2.5 text-theme-badge-text hover:text-theme-primary transition-all duration-300 border border-theme-card-border hover:border-theme-card-hover-border rounded-xl hover:bg-theme-card cursor-pointer"
            >
                <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                </svg>
                <span className="text-sm font-medium">Resume</span>
            </a>

            <a
                href="https://mail.google.com/mail/?view=cm&to=ayushsinghramola02@gmail.com&su=Let%27s+work+together%21"
                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03]"
                style={{
                    background: 'var(--theme-nav-bg)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid var(--theme-nav-border)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                }}
            >
                <div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                    style={{
                        background: 'linear-gradient(90deg, transparent, var(--theme-card-hover-bg), transparent)',
                    }}
                />

                <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        boxShadow: 'var(--theme-nav-shadow)',
                    }}
                />

                <svg
                    className="w-4 h-4 text-theme-primary relative z-10 transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>

                <span className="text-theme-primary font-medium text-sm relative z-10">Hire Me</span>
            </a>
        </div>
    );
}