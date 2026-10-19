import React from 'react';

interface NavigationDotsProps {
  currentStage: number;
  totalStages: number;
  onSelectStage: (stage: number) => void;
  stageLabels?: string[];
}

export const NavigationDots: React.FC<NavigationDotsProps> = ({
  currentStage,
  totalStages,
  onSelectStage,
  stageLabels = [
    "Intro",
    "Reveal",
    "Editorial",
    "Polaroids",
    "Scrapbook",
    "3D Universe"
  ]
}) => {
  return (
    <>
      {/* Desktop Vertical Navigation Dots */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 items-end">
        {Array.from({ length: totalStages }).map((_, idx) => {
          const stageNum = idx + 1;
          const isActive = currentStage === stageNum;
          return (
            <button
              key={stageNum}
              onClick={() => onSelectStage(stageNum)}
              id={`nav-dot-stage-${stageNum}`}
              className="group flex items-center gap-2.5 py-1 px-1 text-right focus:outline-none cursor-pointer"
            >
              <span
                className={`text-[10px] tracking-widest font-mono uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                  isActive ? 'text-amber-400 opacity-100 font-bold' : 'text-neutral-400'
                }`}
              >
                {stageLabels[idx]}
              </span>
              <div
                className={`rounded-full transition-all duration-500 ${
                  isActive
                    ? 'w-3 h-3 bg-amber-400 ring-4 ring-amber-400/20 shadow-lg shadow-amber-400/30'
                    : 'w-1.5 h-1.5 bg-neutral-600 hover:bg-neutral-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Mobile Top Minimal Progress Pill */}
      <div className="fixed top-4 right-4 z-40 flex md:hidden items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 shadow-lg">
        {Array.from({ length: totalStages }).map((_, idx) => {
          const stageNum = idx + 1;
          const isActive = currentStage === stageNum;
          return (
            <button
              key={`m-dot-${stageNum}`}
              onClick={() => onSelectStage(stageNum)}
              aria-label={`Go to stage ${stageNum}: ${stageLabels[idx]}`}
              className={`transition-all rounded-full ${
                isActive
                  ? 'w-3.5 h-1.5 bg-amber-400'
                  : 'w-1.5 h-1.5 bg-neutral-600'
              }`}
            />
          );
        })}
      </div>
    </>
  );
};
