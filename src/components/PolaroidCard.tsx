import React, { useRef, useState } from 'react';
import { motion, PanInfo } from 'motion/react';
import { Memory } from '../types';

interface PolaroidCardProps {
  memory: Memory;
  stackIndex: number;
  totalCards: number;
  initialRotation: number;
  initialOffset?: { x: number; y: number };
  onSelect: (memory: Memory) => void;
  dragConstraintsRef: React.RefObject<HTMLDivElement | null>;
  isStacked?: boolean;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({
  memory,
  stackIndex,
  totalCards,
  initialRotation,
  initialOffset = { x: 0, y: 0 },
  onSelect,
  dragConstraintsRef,
  isStacked = true,
}) => {
  const isDragging = useRef(false);
  // Base z-index: topmost card has highest z-index in stack
  const baseZIndex = (totalCards - stackIndex) * 5;
  const [currentZIndex, setCurrentZIndex] = useState(baseZIndex);
  const [hasBeenMoved, setHasBeenMoved] = useState(false);

  const handleDragStart = () => {
    isDragging.current = true;
    setCurrentZIndex(200); // Float above everything while dragging
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setTimeout(() => {
      isDragging.current = false;
    }, 100);

    // If card was moved significantly away from center, mark it as displaced
    if (Math.abs(info.offset.x) > 20 || Math.abs(info.offset.y) > 20) {
      setHasBeenMoved(true);
      setCurrentZIndex(100 + stackIndex); // Keep it above unmodified stack
    }
  };

  const handleClick = () => {
    if (!isDragging.current) {
      onSelect(memory);
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={dragConstraintsRef}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={{
        opacity: 0,
        y: 40,
        rotate: initialRotation * 1.6,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        x: initialOffset.x,
        y: initialOffset.y,
        rotate: initialRotation,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        delay: stackIndex * 0.05,
        type: 'spring',
        stiffness: 160,
        damping: 18,
      }}
      whileHover={{
        scale: 1.04,
        rotate: initialRotation * 0.4,
        boxShadow: '0 24px 50px -10px rgba(0, 0, 0, 0.28)',
      }}
      whileDrag={{
        scale: 1.08,
        rotate: initialRotation * 0.2,
        boxShadow: '0 35px 70px -15px rgba(0, 0, 0, 0.35)',
        cursor: 'grabbing',
      }}
      onClick={handleClick}
      style={{
        zIndex: currentZIndex,
        position: isStacked ? 'absolute' : 'relative',
      }}
      className={`cursor-grab active:cursor-grabbing bg-[#fffdfa] p-3 sm:p-4 pb-7 sm:pb-9 rounded-sm shadow-[0_10px_25px_rgba(0,0,0,0.12)] border border-neutral-300/85 select-none transform-gpu group w-64 xs:w-72 sm:w-80 md:w-84 max-w-[92vw] transition-shadow ${
        isStacked ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : ''
      }`}
    >
      {/* Pink Heart Sticker */}
      <div className="absolute -top-2.5 -right-2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] sm:text-xs shadow-md border-2 border-white transform rotate-12 group-hover:scale-110 transition-transform pointer-events-none">
        ❤️
      </div>

      {/* Top Washi Tape */}
      <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-3.5 sm:h-4 bg-amber-100/90 border border-amber-200/70 backdrop-blur-[1px] rotate-[-2deg] shadow-2xs z-10 pointer-events-none" />

      {/* Photo Frame */}
      <div className="w-full h-44 xs:h-52 sm:h-56 md:h-60 overflow-hidden rounded-xs bg-neutral-100 relative pointer-events-none shadow-inner">
        <img
          src={memory.image}
          alt={memory.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            if (memory.fallbackImage && e.currentTarget.src !== memory.fallbackImage) {
              e.currentTarget.src = memory.fallbackImage;
            }
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
        />
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] sm:text-xs font-mono shadow-xs">
          {memory.emoji}
        </div>

        {/* Stack Number Badge */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-neutral-300 text-[9px] font-mono">
          #{stackIndex + 1}
        </div>
      </div>

      {/* Caption & Date */}
      <div className="mt-3 flex items-center justify-between px-1 pointer-events-none">
        <span className="font-serif italic text-xs xs:text-sm sm:text-base text-neutral-800 font-semibold truncate">
          {memory.title}
        </span>
        <span className="text-[10px] sm:text-xs font-mono text-neutral-500 shrink-0 ml-2">
          {memory.date || '2025'}
        </span>
      </div>
    </motion.div>
  );
};
