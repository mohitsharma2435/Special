import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Memory } from '../types';

interface CurvedFilmStripProps {
  memories: Memory[];
  onSelectMemory?: (memory: Memory) => void;
}

interface PathPoint {
  x: number;
  y: number;
  angle: number;
}

export const CurvedFilmStrip: React.FC<CurvedFilmStripProps> = ({ memories, onSelectMemory }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeMemoryId, setActiveMemoryId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const pathRef = useRef<SVGPathElement>(null);
  const lookupTableRef = useRef<PathPoint[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  // Keep ref in sync to avoid effect teardowns
  isPausedRef.current = isPaused;

  // Detect Mobile Viewport
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop Curve: Precision widescreen loop-the-loop (ViewBox: 0 0 1600 900)
  const desktopPathD =
    "M -120,830 C 120,845 320,830 480,785 C 570,755 645,695 680,590 C 720,480 725,320 670,220 C 615,125 520,135 465,225 C 410,315 425,460 485,595 C 540,710 635,770 750,775 C 910,775 1060,715 1210,620 C 1370,520 1500,410 1720,240";

  // Mobile Curve: Optimized vertical portrait ribbon (ViewBox: 0 0 420 840)
  // Flows smoothly down the right quadrant and loops elegantly behind/below typography
  const mobilePathD =
    "M 300,-70 C 390,50 410,180 350,290 C 300,380 210,370 195,280 C 180,180 290,160 350,230 C 410,310 400,480 330,600 C 260,700 140,750 -30,810";

  const currentPathD = isMobile ? mobilePathD : desktopPathD;
  const viewBoxWidth = isMobile ? 420 : 1600;
  const viewBoxHeight = isMobile ? 840 : 900;
  const totalFramesOnTrack = isMobile ? 12 : 24;

  // Re-sample path whenever path changes (desktop vs mobile)
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      const samples = 1200;
      const points: PathPoint[] = [];

      for (let i = 0; i <= samples; i++) {
        const d = (i / samples) * length;
        const pt = pathRef.current.getPointAtLength(d);
        const nextD = Math.min(d + 2, length);
        const nextPt = pathRef.current.getPointAtLength(nextD);
        const angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI);
        points.push({ x: pt.x, y: pt.y, angle });
      }

      lookupTableRef.current = points;
    }
  }, [currentPathD, isMobile]);

  // Continuous smooth requestAnimationFrame loop
  useEffect(() => {
    let prevTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = Math.min((currentTime - prevTime) / 1000, 0.1); // Clamp spikes
      prevTime = currentTime;

      // Only advance position when NOT paused on an individual card
      if (!isPausedRef.current) {
        setScrollProgress((prev) => {
          const speed = isMobile ? 1 / 30 : 1 / 34;
          return (prev + delta * speed) % 1;
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isMobile]);

  const displayItems = useMemo(() => {
    if (memories.length === 0) return [];
    const list: { memory: Memory; globalIndex: number }[] = [];
    for (let i = 0; i < totalFramesOnTrack; i++) {
      const mem = memories[i % memories.length];
      list.push({ memory: mem, globalIndex: i });
    }
    return list;
  }, [memories, totalFramesOnTrack]);

  // Fast O(1) point interpolation from pre-sampled path table
  const getPointOnPath = (itemIndex: number, totalItems: number): PathPoint => {
    const table = lookupTableRef.current;
    if (!table || table.length === 0) {
      return { x: 0, y: 0, angle: 0 };
    }

    const step = 1 / totalItems;
    const normalizedPos = (scrollProgress + itemIndex * step) % 1;
    const indexFloat = normalizedPos * (table.length - 1);
    const index = Math.floor(indexFloat);

    return table[index] || table[0];
  };

  const handleCardClick = (memory: Memory, idKey: string) => {
    setActiveMemoryId(idKey);
    onSelectMemory?.(memory);
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
      {/* Hidden Path for length/point calculation */}
      <svg
        key={isMobile ? 'mobile-svg' : 'desktop-svg'}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="none"
      >
        <path ref={pathRef} d={currentPathD} fill="none" />
      </svg>

      {/* Photo Stream Container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {lookupTableRef.current.length > 0 &&
          displayItems.map(({ memory, globalIndex }, idx) => {
            const pt = getPointOnPath(idx, displayItems.length);
            const idKey = `${memory.id}-${globalIndex}`;
            const isActive = activeMemoryId === idKey;

            // Layering logic: apex cards in loop have appropriate depth
            const isLoopApex = isMobile ? pt.y < 320 && pt.x < 280 : pt.y < 350;
            const zIndex = isActive ? 70 : isLoopApex ? 30 : 20;

            // Gentle responsive angle dampening on mobile for clean viewing
            const appliedAngle = isMobile ? pt.angle * 0.7 : pt.angle;

            return (
              <div
                key={idKey}
                className="absolute pointer-events-auto cursor-pointer origin-center transform-gpu will-change-transform transition-shadow duration-200"
                style={{
                  left: `${(pt.x / viewBoxWidth) * 100}%`,
                  top: `${(pt.y / viewBoxHeight) * 100}%`,
                  /* Position & Rotation stay 100% exact without realignment on hover */
                  transform: `translate3d(-50%, -50%, 0) rotate(${appliedAngle}deg)`,
                  zIndex,
                }}
                /* Movement pauses ONLY when hovering/touching this specific card */
                onMouseEnter={() => {
                  setIsPaused(true);
                  setActiveMemoryId(idKey);
                }}
                onMouseLeave={() => {
                  setIsPaused(false);
                  setActiveMemoryId(null);
                }}
                onTouchStart={() => {
                  setIsPaused(true);
                  setActiveMemoryId(idKey);
                }}
                onTouchEnd={() => {
                  setTimeout(() => {
                    setIsPaused(false);
                    setActiveMemoryId(null);
                  }, 1800);
                }}
                onClick={() => handleCardClick(memory, idKey)}
              >
                {/* Photo Card: maintains fixed alignment and geometry, subtle highlight on active/hover */}
                <div
                  className={`w-18 h-22 xs:w-20 xs:h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 bg-white p-1 sm:p-1.5 rounded-[2px] shadow-[0_4px_14px_rgba(0,0,0,0.15)] sm:shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-all duration-200 ${
                    isActive
                      ? 'ring-2 ring-amber-400 shadow-[0_8px_25px_rgba(251,191,36,0.35)]'
                      : 'border border-neutral-200/70 hover:border-neutral-400'
                  }`}
                >
                  <div className="w-full h-full overflow-hidden bg-neutral-100 relative rounded-xs">
                    <img
                      src={memory.image}
                      alt={memory.title}
                      referrerPolicy="no-referrer"
                      loading="eager"
                      onError={(e) => {
                        if (memory.fallbackImage && e.currentTarget.src !== memory.fallbackImage) {
                          e.currentTarget.src = memory.fallbackImage;
                        }
                      }}
                      className={`w-full h-full object-cover transition-all duration-300 pointer-events-none ${
                        isActive
                          ? 'grayscale-0 contrast-105 brightness-100'
                          : 'grayscale contrast-110 brightness-95'
                      }`}
                    />

                    {/* Active memory title pill overlay */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none flex items-end justify-center pb-1">
                        <span className="text-[8px] sm:text-[9px] font-sans font-semibold text-white truncate px-1 drop-shadow-sm">
                          {memory.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
