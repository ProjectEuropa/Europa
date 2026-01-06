import Link from 'next/link';

export const QuickStart = () => {
    const steps = [
        {
            step: '01',
            title: 'チームを探す',
            desc: 'ランキングや条件で検索して、気になるチームを見つけます。',
            href: '/search/team',
            action: '検索する',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
        },
        {
            step: '02',
            title: 'データを取得',
            desc: 'OKEファイルをダウンロードして、カルネージハートエクサで読み込みます。',
            href: '/sumdownload/team',
            action: 'DLページへ',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            ),
        },
        {
            step: '03',
            title: 'アップロード',
            desc: '自慢のチームをアップロードして、世界中のユーザーと共有しましょう。',
            href: '/upload',
            action: '共有する',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            ),
        },
    ];

    return (
        <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
                <span className="w-1.5 h-8 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    QUICK START
                    <span className="ml-3 text-base md:text-lg font-bold text-cyan-500/80">
                        最初の5分で始める
                    </span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((item, index) => (
                    <Link
                        key={item.step}
                        href={item.href}
                        className="group relative bg-[#0d1124] border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/50 hover:bg-[#121830] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    >
                        {/* Step Number */}
                        <div className="absolute top-4 right-4 text-4xl font-black text-slate-800/50 group-hover:text-cyan-900/40 transition-colors select-none">
                            {item.step}
                        </div>

                        {/* Icon */}
                        <div className="w-12 h-12 bg-cyan-950/30 rounded-lg flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300 border border-cyan-500/10">
                            {item.icon}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                            {item.title}
                        </h3>

                        <p className="text-slate-400 text-sm leading-relaxed mb-6 h-12">
                            {item.desc}
                        </p>

                        <div className="flex items-center text-cyan-400 font-bold text-sm">
                            {item.action}
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
