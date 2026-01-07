'use client';

export const TableOfContents = () => {
    const links = [
        { id: 'search', label: 'チームを探す', sub: 'Search Types' },
        { id: 'download', label: 'データをダウンロード', sub: 'How to Download' },
        { id: 'upload', label: 'アップロード手順', sub: 'Share Your Team' },
        { id: 'account', label: 'アカウント登録', sub: 'Registration' },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Header height adjustment
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav className="mb-20">
            <h3 className="text-sm font-bold text-cyan-500 mb-4 tracking-widest uppercase">
                CONTENTS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {links.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => scrollToSection(link.id)}
                        className="text-left bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/40 hover:bg-cyan-950/10 transition-all group"
                    >
                        <div className="text-xs text-slate-500 mb-1 group-hover:text-cyan-400/70 transition-colors">
                            {link.sub}
                        </div>
                        <div className="text-slate-200 font-bold text-sm group-hover:text-cyan-300 transition-colors">
                            {link.label}
                        </div>
                    </button>
                ))}
            </div>
        </nav>
    );
};
