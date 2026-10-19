import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PolaroidCard } from './PolaroidCard';
import { Memory } from '../types';
import { RotateCcw, Shuffle, Layers } from 'lucide-react';

interface Stage4MemoryWallProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onNextStage: () => void;
}

export const Stage4MemoryWall: React.FC<Stage4MemoryWallProps> = ({
  memories,
  onSelectMemory,
  onNextStage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resetKey, setResetKey] = useState(0);
  const [orderedMemories, setOrderedMemories] = useState<Memory[]>(memories);

  // Pre-calculated organic rotational jitters and slight offset jitter for realistic photo stack
  const stackRotations = useMemo(() => [-4, 3.5, -2.5, 5, -3.5, 2, -5, 4, -1.5, 3], []);
  const stackOffsets = useMemo(
    () => [
      { x: 0, y: 0 },
      { x: 5, y: -4 },
      { x: -6, y: 5 },
      { x: 7, y: -6 },
      { x: -4, y: 6 },
      { x: 6, y: 4 },
      { x: -7, y: -5 },
      { x: 4, y: 7 },
      { x: -3, y: -3 },
    ],
    []
  );

  // Gather stack back to center
  const handleReset = () => {
    setResetKey((prev) => prev + 1);
    setOrderedMemories([...memories]);
  };

  // Shuffle order of cards
  const handleShuffle = () => {
    setResetKey((prev) => prev + 1);
    const shuffled = [...orderedMemories].sort(() => Math.random() - 0.5);
    setOrderedMemories(shuffled);
  };

  // Cycle the top card to the back of the stack
  const handleCycleTopToBack = () => {
    setOrderedMemories((prev) => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
    setResetKey((prev) => prev + 1);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] w-full bg-[#f4f0eb] text-neutral-900 py-8 sm:py-12 px-3 sm:px-6 flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Subtle paper grid texture background */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />

      {/* Header with interactive clues */}
      <div className="max-w-xl mx-auto text-center z-20 pt-1 sm:pt-0 space-y-1">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[9px] sm:text-[10px] font-mono tracking-[0.35em] text-neutral-400 uppercase"
        >
          POLAROID STACK
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xs sm:text-sm font-serif italic text-neutral-600 px-2"
        >
          Drag photos off the stack to reveal what's underneath • Tap to inspect
        </motion.p>

        {/* Stack interactive control buttons */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 pt-2 flex-wrap"
        >
          <button
            onClick={handleCycleTopToBack}
            id="cycle-polaroid-btn"
            className="px-3 py-1 rounded-full bg-neutral-900/10 hover:bg-neutral-900/20 text-neutral-800 text-[11px] font-mono flex items-center gap-1.5 active:scale-95 transition-all border border-neutral-300"
            title="Send top card to bottom"
          >
            <Layers className="w-3.5 h-3.5 text-neutral-600" /> Next Card
          </button>

          <button
            onClick={handleShuffle}
            id="shuffle-polaroids-btn"
            className="px-3 py-1 rounded-full bg-neutral-900/10 hover:bg-neutral-900/20 text-neutral-800 text-[11px] font-mono flex items-center gap-1.5 active:scale-95 transition-all border border-neutral-300"
            title="Shuffle polaroids"
          >
            <Shuffle className="w-3.5 h-3.5 text-neutral-600" /> Shuffle
          </button>

          <button
            onClick={handleReset}
            id="reset-polaroids-btn"
            className="px-3 py-1 rounded-full bg-neutral-900/10 hover:bg-neutral-900/20 text-neutral-800 text-[11px] font-mono flex items-center gap-1.5 active:scale-95 transition-all border border-neutral-300"
            title="Gather all cards back into pile"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-600" /> Re-stack
          </button>
        </motion.div>
      </div>

      {/* Stack Area: Cards stacked directly over each other in the center */}
      <div
        key={resetKey}
        className="relative w-full max-w-4xl mx-auto my-auto min-h-[380px] xs:min-h-[420px] sm:min-h-[480px] md:min-h-[520px] flex items-center justify-center z-10"
      >
        <AnimatePresence>
          {orderedMemories.map((mem, index) => {
            const rotation = stackRotations[index % stackRotations.length];
            const offset = stackOffsets[index % stackOffsets.length];

            return (
              <PolaroidCard
                key={`${mem.id}-${resetKey}`}
                memory={mem}
                stackIndex={index}
                totalCards={orderedMemories.length}
                initialRotation={rotation}
                initialOffset={offset}
                onSelect={onSelectMemory}
                dragConstraintsRef={containerRef}
                isStacked={true}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom transition button to Scrapbook */}
      <div className="mt-4 text-center relative z-20 pb-1 sm:pb-0">
        <button
          onClick={onNextStage}
          id="open-scrapbook-btn"
          className="px-7 sm:px-8 py-2.5 sm:py-3 rounded-full bg-neutral-950 text-white font-mono text-xs uppercase tracking-widest hover:bg-amber-600 hover:text-white active:scale-95 transition-all duration-300 shadow-xl inline-flex items-center gap-2 group cursor-pointer"
        >
          SCRAPBOOK
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </section>
  );
};
