import type React from 'react';
import Link from 'next/link';

// 共通Props型定義
interface ChildrenProps {
    children: React.ReactNode;
}

interface FeatureCardProps {
    title: string;
    children: React.ReactNode;
}

interface TimelineItemProps {
    year: string;
    children: React.ReactNode;
}

interface FAQItemProps {
    question: string;
    children: React.ReactNode;
}

interface ActionButtonProps {
    href: string;
    children: React.ReactNode;
    external?: boolean;
}

interface InfoBoxProps {
    title: string;
    children: React.ReactNode;
}

// セクションタイトル（h2）
export function SectionTitle({ children }: ChildrenProps) {
    return (
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 mt-8 first:mt-0 flex items-center gap-3">
            <span className="w-1 h-6 md:h-7 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            {children}
        </h2>
    );
}

// 通常の段落
export function Paragraph({ children }: ChildrenProps) {
    return <p className="text-slate-300 leading-relaxed mb-4">{children}</p>;
}

// リスト
export function List({ children }: ChildrenProps) {
    return (
        <ul className="list-disc pl-5 text-slate-300 space-y-2 mb-4">
            {children}
        </ul>
    );
}

export function ListItem({ children }: ChildrenProps) {
    return <li>{children}</li>;
}

// カード（特色機能などを表示）
export function FeatureCard({ title, children }: FeatureCardProps) {
    return (
        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-xl p-5 md:p-6 hover:border-cyan-500/40 transition-colors">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">{title}</h3>
            <p className="text-slate-400 text-sm">{children}</p>
        </div>
    );
}

// アクセントボックス（引用、強調）
export function AccentBox({ children }: ChildrenProps) {
    return (
        <div className="bg-slate-900/50 border-l-4 border-cyan-500 rounded-lg p-5 my-6 text-center italic text-cyan-300/90 text-lg">
            {children}
        </div>
    );
}

// タイムラインアイテム（縦型）
export function TimelineItem({ year, children }: TimelineItemProps) {
    return (
        <div className="relative flex items-center gap-4 md:gap-6 pb-5 last:pb-0">
            {/* 左側：年 */}
            <time
                dateTime={year}
                className="text-lg md:text-xl font-bold text-cyan-400 font-mono w-14 md:w-16 text-right shrink-0"
            >
                {year}
            </time>

            {/* 中央：ドット */}
            <div className="relative flex items-center shrink-0">
                <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            </div>

            {/* 右側：説明 */}
            <div className="flex-1">
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">{children}</p>
            </div>
        </div>
    );
}

// FAQアイテム
export function FAQItem({ question, children }: FAQItemProps) {
    return (
        <div className="mb-6 last:mb-0">
            <h3 className="text-lg md:text-xl font-bold text-cyan-400 mb-3 flex items-start gap-2">
                <span className="text-cyan-500 font-mono">Q:</span>
                <span>{question}</span>
            </h3>
            <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4 md:p-5 text-slate-300">
                <span className="text-cyan-600 font-mono mr-2">A:</span>
                {children}
            </div>
        </div>
    );
}

// アクションボタン
export function ActionButton({ href, children, external = false }: ActionButtonProps) {
    const className =
        'inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold no-underline transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105';

    if (external) {
        return (
            <a
                href={href}
                className={className}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
}

// 情報ボックス（開発予定など）
export function InfoBox({ title, children }: InfoBoxProps) {
    return (
        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-xl p-5 md:p-6 mt-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">{title}</h3>
            {children}
        </div>
    );
}

// メタ情報（最終更新日など）
export function MetaInfo({ children }: ChildrenProps) {
    return <p className="mt-8 text-sm text-slate-500">{children}</p>;
}
