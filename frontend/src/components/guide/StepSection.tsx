import type React from 'react';
import Image from 'next/image';

interface StepSectionProps {
    id: string;
    title: string;
    subtitle: string;
    description: React.ReactNode;
    imagePath?: string;
    reverse?: boolean; // If true, image is on the left (desktop)
    children?: React.ReactNode;
}

export const StepSection = ({
    id,
    title,
    subtitle,
    description,
    imagePath,
    reverse = false,
    children
}: StepSectionProps) => {
    return (
        <section id={id} className="scroll-mt-32 mb-24 md:mb-32">
            <div className="flex items-center gap-3 mb-6">
                <span className="w-1 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight leading-none">
                        {title}
                    </h2>
                    <span className="text-cyan-500 text-xs font-mono tracking-wider uppercase">
                        {subtitle}
                    </span>
                </div>
            </div>

            <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12`}>
                {/* Text Content */}
                <div className="flex-1 space-y-6">
                    <div className="text-slate-300 leading-loose text-base md:text-lg">
                        {description}
                    </div>
                    {children}
                </div>

                {/* Screenshot / Visual */}
                {imagePath && (
                    <div className="flex-1">
                        <div className="relative rounded-xl overflow-hidden border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] group">
                            {/* Image Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0818]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

                            <img
                                src={imagePath}
                                alt={`${title} screenshot`}
                                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Decorative Frame */}
                            <div className="absolute inset-0 border border-cyan-500/10 pointer-events-none" />
                            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-xl pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl pointer-events-none" />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
