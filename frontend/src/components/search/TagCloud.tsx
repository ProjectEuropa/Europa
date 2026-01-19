import type React from 'react';

interface TagCloudProps {
    tags?: string[];
    onTagClick?: (tag: string) => void;
    className?: string;
}

// 人気のタグ（仮データ - 将来的にはAPIから取得）
const RECOMMENDED_TAGS = [
    'ACE',
    'Javelin',
    'Biped',
    '4Legs',
    'Tank',
    'Hover',
    'Flying',
    'Intercepter',
    'Jammer',
    'Sniper',
];

export const TagCloud: React.FC<TagCloudProps> = ({
    tags = RECOMMENDED_TAGS,
    onTagClick,
    className = '',
}) => {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {tags.map((tag) => (
                <button
                    key={tag}
                    onClick={() => onTagClick?.(tag)}
                    type="button"
                    className="
            px-3 py-1.5 
            text-sm text-cyan-400 
            bg-slate-900/80 
            border border-slate-700 
            rounded-full 
            transition-all duration-300
            hover:bg-cyan-900/30 hover:border-cyan-500 hover:text-cyan-300 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]
            focus:outline-none focus:ring-2 focus:ring-cyan-500/50
          "
                >
                    #{tag}
                </button>
            ))}
        </div>
    );
};
