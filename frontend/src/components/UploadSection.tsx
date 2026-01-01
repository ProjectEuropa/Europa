import type React from 'react';
import { useState } from 'react';

const UploadSection: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // ファイルのドロップ処理をここに実装
    const _files = e.dataTransfer.files;
  };

  return (
    <section id="upload" className="py-20 md:py-32 relative overflow-hidden bg-[#0a0818]">
      <div className="container mx-auto px-4 max-w-7xl flex flex-wrap items-center gap-12 lg:gap-20">

        {/* Left Column: Text & Buttons */}
        <div className="flex-1 min-w-[300px] max-w-xl">
          <div className="mb-8">
            <h2 className="text-cyan-400 font-extrabold text-sm tracking-[3px] uppercase animate-pulse shadow-cyan-500/50 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] mb-4">
              UPLOAD YOUR OKE
            </h2>
            <h3 className="text-white font-black text-4xl md:text-5xl tracking-tight cyber-title drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              OKEを<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">アップロード</span>
            </h3>
          </div>

          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            あなたのカルネージハート エクサアルゴリズムをコミュニティと共有しましょう。シンプルなアップロードシステムにより、簡単に投稿してフィードバックを得ることができます。
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 14V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6" />
                <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4-4-4 4" />
                <line x1="12" y1="13" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
              アップロードする
            </a>
            <a
              href="/guide"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-cyan-500/50 text-cyan-400 font-bold rounded hover:bg-cyan-500/10 hover:border-cyan-400 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
              ガイドラインを見る
            </a>
          </div>
        </div>

        {/* Right Column: Dropzone Visual */}
        <div className="flex-1 min-w-[300px]">
          <div className="bg-[#0d1124] rounded-2xl p-8 border border-cyan-500/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

            <h3 className="text-white text-xl font-bold text-center mb-8 relative z-10">OKEアップロード</h3>

            <div
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all relative z-10 ${isDragging
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-500/5'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg className="w-12 h-12 text-cyan-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 14V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6" />
                <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 17l-4-4-4 4" />
                <line x1="12" y1="13" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
              </svg>
              <div className="text-cyan-400 font-bold mb-2">CHEファイルをドラッグ＆ドロップ</div>
              <div className="text-slate-400 text-sm">またはクリックしてファイルを選択</div>
            </div>

            <div className="flex justify-between mt-4 text-slate-500 text-sm relative z-10">
              <div>対応形式: .CHE</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
