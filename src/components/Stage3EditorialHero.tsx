import React from 'react';
import { motion } from 'motion/react';
import { CurvedFilmStrip } from './CurvedFilmStrip';
import { Memory } from '../types';

interface Stage3EditorialHeroProps {
  name: string;
  dateLabel: string;
  subtitle: string;
  footerText: string;
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onNextStage: () => void;
}

export const Stage3EditorialHero: React.FC<Stage3EditorialHeroProps> = ({
  name,
  dateLabel,
  subtitle,
  memories,
  onSelectMemory,
  onNextStage,
}) => {
  return (
    <section className="relative w-full min-h-[100dvh] h-screen bg-white text-neutral-900 flex flex-col justify-between overflow-hidden select-none">
      {/* Top Left Date Stamp */}
      <div className="absolute top-5 left-5 sm:top-12 sm:left-12 z-30 pointer-events-none">
        <span className="text-[10px] sm:text-sm font-mono tracking-[0.35em] sm:tracking-[0.4em] uppercase text-neutral-400 font-medium">
          {dateLabel || '14 SEPT'}
        </span>
      </div>

      {/* Responsive Continuous Curved Film Loop Track (Adapts between Mobile Cascade & Desktop Loop) */}
      <CurvedFilmStrip memories={memories} onSelectMemory={onSelectMemory} />

      {/* Left-Aligned Headline Block */}
      <div className="absolute left-5 xs:left-7 sm:left-14 md:left-20 top-[35%] xs:top-[38%] sm:top-1/2 -translate-y-1/2 z-30 max-w-[240px] xs:max-w-xs sm:max-w-md pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-0 select-none"
        >
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.04]">
            Happy
          </h1>
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.04]">
            Birthday
          </h1>
          <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#ff9000] leading-[1.04] drop-shadow-xs break-words">
            {name}
          </h2>

          {/* Accent Divider Line */}
          <div className="w-9 sm:w-14 h-[2px] sm:h-[2.5px] bg-[#ff9000] rounded-full my-2.5 sm:my-6 opacity-90" />

          {/* Subtitle in Bold Letters */}
          <p className="text-xs xs:text-sm sm:text-base font-bold text-neutral-900 leading-relaxed max-w-[240px] xs:max-w-xs sm:max-w-sm">
            May this 14th of september bring you endless reasons to smile, dream and conquer
          </p>
        </motion.div>
      </div>

      {/* Center Action Button to Next Stage */}
      <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <button
          onClick={onNextStage}
          id="view-polaroids-next-btn"
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-neutral-900 hover:bg-[#ff9000] text-white text-[11px] sm:text-xs font-mono tracking-widest uppercase rounded-full shadow-xl active:scale-95 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer pointer-events-auto"
        >
          POLAROIDS
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </section>
  );
};
