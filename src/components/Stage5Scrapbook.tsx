import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { scrapbookSpread } from '../data/config';
import { Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ScrapbookPageData } from '../types';

interface Stage5ScrapbookProps {
  onNextStage: () => void;
}

// Single Page Content Renderer (Left or Right)
const PageContent: React.FC<{
  spread: ScrapbookPageData;
  side: 'left' | 'right';
  onClick?: () => void;
}> = ({ spread, side, onClick }) => {
  const pageNumber = side === 'left' ? spread.id * 2 - 1 : spread.id * 2;
  const isLeft = side === 'left';

  return (
    <div
      onClick={onClick}
      className={`w-full h-full min-h-[300px] xs:min-h-[350px] sm:min-h-[440px] md:min-h-[520px] relative p-2.5 xs:p-3.5 sm:p-5 md:p-7 select-none overflow-hidden ${
        isLeft
          ? 'bg-[#faf6ef] shadow-[inset_-6px_0_12px_rgba(0,0,0,0.03)] sm:shadow-[inset_-14px_0_20px_rgba(0,0,0,0.04)]'
          : 'bg-[#fbf7f0] shadow-[inset_6px_0_12px_rgba(0,0,0,0.03)] sm:shadow-[inset_14px_0_20px_rgba(0,0,0,0.04)]'
      }`}
    >
      {/* Paper grain texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none" />

      {/* Subtle corner fold / dog-ear cue */}
      <div
        className={`absolute top-0 w-5 xs:w-6 sm:w-8 h-5 xs:h-6 sm:h-8 pointer-events-none transition-opacity duration-300 ${
          isLeft
            ? 'left-0 bg-gradient-to-br from-neutral-300/50 to-transparent'
            : 'right-0 bg-gradient-to-bl from-amber-200/50 to-transparent'
        }`}
      />

      {/* Page Header */}
      <div className={`flex items-center justify-between mb-2 xs:mb-3 sm:mb-5 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
        <span className="text-[7px] xs:text-[8px] sm:text-[9px] font-mono tracking-widest text-neutral-400 uppercase font-medium">
          PAGE {pageNumber.toString().padStart(2, '0')}
        </span>
        <span className="font-serif italic text-[9px] xs:text-[11px] sm:text-xs text-neutral-600 font-medium truncate max-w-[90px] xs:max-w-[120px] sm:max-w-none">
          {isLeft ? spread.title : 'Moments & Memories'}
        </span>
      </div>

      {/* Photos on the page */}
      {spread.photos.map((photo, i) => (
        <motion.div
          key={`p-${side}-${i}`}
          className="absolute bg-white p-1 xs:p-1.5 sm:p-2 md:p-2.5 pb-2.5 xs:pb-3.5 sm:pb-5 md:pb-6 shadow-md border border-neutral-200/90 rounded-xs pointer-events-auto group/photo"
          style={{
            top: photo.position.top,
            left: photo.position.left,
            width: photo.position.width,
            transform: `rotate(${photo.rotation}deg)`,
          }}
          whileHover={{ scale: 1.05, zIndex: 30, rotate: 0 }}
          whileTap={{ scale: 1.05, zIndex: 30 }}
        >
          {/* Decorative Washi Tape */}
          <div
            className="absolute -top-1.5 xs:-top-2 sm:-top-2.5 left-1/2 -translate-x-1/2 w-6 xs:w-8 sm:w-11 md:w-12 h-2 xs:h-2.5 sm:h-3.5 shadow-2xs z-10 opacity-90 backdrop-blur-xs border border-white/40"
            style={{ backgroundColor: photo.tapeColor || 'rgba(251, 191, 36, 0.7)' }}
          />
          <img
            src={photo.url}
            alt={photo.caption}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              if (photo.fallbackUrl && e.currentTarget.src !== photo.fallbackUrl) {
                e.currentTarget.src = photo.fallbackUrl;
              }
            }}
            className="w-full h-14 xs:h-18 sm:h-26 md:h-36 object-cover rounded-xs"
          />
          <p className="mt-0.5 sm:mt-1.5 text-center font-serif italic text-[8px] xs:text-[10px] sm:text-xs text-neutral-800 font-medium truncate px-0.5">
            {photo.caption}
          </p>
        </motion.div>
      ))}

      {/* Handwritten Notes */}
      {spread.notes.map((note, idx) => (
        <div
          key={`n-${side}-${idx}`}
          className={`absolute max-w-[85px] xs:max-w-[110px] sm:max-w-[150px] md:max-w-[190px] p-1 xs:p-1.5 sm:p-2.5 rounded-xs sm:rounded-sm shadow-xs font-serif text-[8px] xs:text-[10px] sm:text-xs italic pointer-events-none ${
            isLeft
              ? 'bg-amber-50/90 border border-amber-200/80'
              : 'bg-rose-50/90 border border-rose-200/80'
          }`}
          style={{
            top: note.position.top,
            left: note.position.left,
            color: note.color || '#1e293b',
          }}
        >
          "{note.text}"
        </div>
      ))}

      {/* Stickers */}
      {spread.stickers.map((stk, sIdx) => (
        <div
          key={`s-${side}-${sIdx}`}
          className="absolute text-sm xs:text-base sm:text-2xl md:text-3xl select-none drop-shadow-xs pointer-events-none"
          style={{
            top: stk.position.top,
            left: stk.position.left,
            transform: `scale(${stk.scale || 1}) rotate(${stk.rotation || 0}deg)`,
          }}
        >
          {stk.emoji}
        </div>
      ))}

      {/* Vintage Stamp / Postmark Decoration */}
      {isLeft ? (
        <div className="absolute bottom-2 left-2 xs:left-3 w-8 xs:w-10 sm:w-12 md:w-14 h-6 xs:h-8 sm:h-9 md:h-10 border-2 border-dashed border-neutral-400/50 bg-neutral-100/70 p-0.5 flex flex-col items-center justify-center rotate-[-5deg] opacity-60 pointer-events-none">
          <span className="text-[5px] xs:text-[6px] sm:text-[7px] font-mono text-neutral-500 font-bold uppercase">21</span>
          <Heart className="w-1.5 xs:w-2 sm:w-2.5 h-1.5 xs:h-2 sm:h-2.5 text-rose-500 fill-rose-500" />
        </div>
      ) : (
        <div className="absolute bottom-2 right-2 xs:right-3 w-8 xs:w-10 sm:w-12 md:w-16 h-8 xs:h-10 sm:h-12 md:h-16 rounded-full border border-dashed border-rose-300/70 flex flex-col items-center justify-center rotate-12 opacity-50 pointer-events-none">
          <span className="text-[5px] xs:text-[6px] sm:text-[7px] font-mono text-rose-600 font-bold">14 SEPT</span>
          <span className="text-[4px] xs:text-[5px] sm:text-[6px] font-mono text-rose-400">★ ★ ★</span>
        </div>
      )}
    </div>
  );
};

export const Stage5Scrapbook: React.FC<Stage5ScrapbookProps> = ({ onNextStage }) => {
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [flipState, setFlipState] = useState<{
    isFlipping: boolean;
    direction: 'next' | 'prev';
    fromSpread: number;
    toSpread: number;
  }>({
    isFlipping: false,
    direction: 'next',
    fromSpread: 0,
    toSpread: 0,
  });

  const totalSpreads = scrapbookSpread.length;
  const currentSpread = scrapbookSpread[currentSpreadIndex];

  const handleNextPage = () => {
    if (flipState.isFlipping) return;
    const nextIndex = (currentSpreadIndex + 1) % totalSpreads;

    setFlipState({
      isFlipping: true,
      direction: 'next',
      fromSpread: currentSpreadIndex,
      toSpread: nextIndex,
    });

    setTimeout(() => {
      setCurrentSpreadIndex(nextIndex);
      setFlipState((prev) => ({ ...prev, isFlipping: false }));
    }, 650);
  };

  const handlePrevPage = () => {
    if (flipState.isFlipping) return;
    const prevIndex = (currentSpreadIndex - 1 + totalSpreads) % totalSpreads;

    setFlipState({
      isFlipping: true,
      direction: 'prev',
      fromSpread: currentSpreadIndex,
      toSpread: prevIndex,
    });

    setTimeout(() => {
      setCurrentSpreadIndex(prevIndex);
      setFlipState((prev) => ({ ...prev, isFlipping: false }));
    }, 650);
  };

  return (
    <section className="relative min-h-[100dvh] w-full bg-[#09090b] text-white py-6 sm:py-10 px-2 sm:px-4 md:px-8 flex flex-col items-center justify-between overflow-hidden select-none">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.04)_0%,transparent_75%)] pointer-events-none" />

      {/* Top Header */}
      <div className="z-10 text-center mb-1.5 sm:mb-3 pt-1 sm:pt-0">
        <p className="text-[10px] xs:text-[11px] sm:text-xs font-serif italic text-neutral-400">
          Tap either page or use arrows to flip • Spread {currentSpreadIndex + 1} of {totalSpreads}
        </p>
      </div>

      {/* 3D Realistic Physical Scrapbook Container - Dual Page on ALL Devices */}
      <div className="relative z-10 w-full max-w-5xl my-auto [perspective:2000px] px-0.5 sm:px-2">
        {/* Leather/Cardboard Scrapbook Binder */}
        <div className="relative bg-[#1c1815] p-1.5 xs:p-2 sm:p-3 md:p-5 rounded-lg sm:rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] sm:shadow-[0_30px_90px_rgba(0,0,0,0.9)] border border-[#2e2621]">
          {/* Golden Corner Accents */}
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-3 sm:w-5 h-3 sm:h-5 border-t-2 border-l-2 border-amber-400/60 rounded-tl-xs sm:rounded-tl-sm pointer-events-none" />
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3 sm:w-5 h-3 sm:h-5 border-t-2 border-r-2 border-amber-400/60 rounded-tr-xs sm:rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-3 sm:w-5 h-3 sm:h-5 border-b-2 border-l-2 border-amber-400/60 rounded-bl-xs sm:rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-3 sm:w-5 h-3 sm:h-5 border-b-2 border-r-2 border-amber-400/60 rounded-br-xs sm:rounded-br-sm pointer-events-none" />

          {/* Central Spiral Wire Binder Rings (Visible on mobile & desktop) */}
          <div className="absolute left-1/2 top-2.5 bottom-2.5 sm:top-4 sm:bottom-4 -translate-x-1/2 z-40 flex flex-col justify-between pointer-events-none py-1 sm:py-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`spiral-${i}`} className="flex items-center justify-center">
                <div className="w-3.5 xs:w-4 sm:w-6 md:w-7 h-1.5 xs:h-2 sm:h-2.5 md:h-3 rounded-full bg-gradient-to-r from-neutral-800 via-neutral-300 to-neutral-900 shadow-sm sm:shadow-md border border-neutral-600 transform -rotate-6" />
              </div>
            ))}
          </div>

          {/* ================= DUAL-PAGE SPREAD (MOBILE & DESKTOP) ================= */}
          <div className="flex relative w-full rounded-sm sm:rounded-md overflow-hidden bg-[#f7f2e9] text-neutral-900 shadow-inner flex-row [transform-style:preserve-3d]">
            {/* Left Page */}
            <div className="w-1/2 relative cursor-pointer group/left" onClick={handlePrevPage}>
              <PageContent
                spread={
                  flipState.isFlipping && flipState.direction === 'prev'
                    ? scrapbookSpread[flipState.toSpread]
                    : currentSpread
                }
                side="left"
              />
            </div>

            {/* Right Page */}
            <div className="w-1/2 relative cursor-pointer group/right" onClick={handleNextPage}>
              <PageContent
                spread={
                  flipState.isFlipping && flipState.direction === 'next'
                    ? scrapbookSpread[flipState.toSpread]
                    : currentSpread
                }
                side="right"
              />
            </div>

            {/* 3D Page Turn Animation Leaf */}
            <AnimatePresence>
              {flipState.isFlipping && flipState.direction === 'next' && (
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: -180 }}
                  exit={{ rotateY: -180 }}
                  transition={{
                    duration: 0.65,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  className="absolute right-0 top-0 w-1/2 h-full z-30 origin-left [transform-style:preserve-3d] pointer-events-none shadow-2xl"
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                    <PageContent spread={scrapbookSpread[flipState.fromSpread]} side="right" />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.4, 0.9] }}
                      transition={{ duration: 0.65 }}
                      className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/10 pointer-events-none"
                    />
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <PageContent spread={scrapbookSpread[flipState.toSpread]} side="left" />
                    <motion.div
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.65 }}
                      className="absolute inset-0 bg-gradient-to-l from-white/50 to-transparent pointer-events-none"
                    />
                  </div>
                </motion.div>
              )}

              {flipState.isFlipping && flipState.direction === 'prev' && (
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 180 }}
                  exit={{ rotateY: 180 }}
                  transition={{
                    duration: 0.65,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  className="absolute left-0 top-0 w-1/2 h-full z-30 origin-right [transform-style:preserve-3d] pointer-events-none shadow-2xl"
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                    <PageContent spread={scrapbookSpread[flipState.fromSpread]} side="left" />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.4, 0.9] }}
                      transition={{ duration: 0.65 }}
                      className="absolute inset-0 bg-gradient-to-l from-black/40 to-black/10 pointer-events-none"
                    />
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <PageContent spread={scrapbookSpread[flipState.toSpread]} side="right" />
                    <motion.div
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.65 }}
                      className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent pointer-events-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Spread Navigation Controls Bar */}
        <div className="flex items-center justify-between mt-2.5 sm:mt-3 px-2">
          <button
            onClick={handlePrevPage}
            id="scrapbook-prev-spread-btn"
            className="px-2.5 sm:px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 hover:border-amber-400 text-neutral-300 hover:text-white text-[10px] sm:text-xs font-mono flex items-center gap-1 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>

          {/* Dots for Spreads */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSpreads }).map((_, i) => (
              <button
                key={`spread-dot-${i}`}
                onClick={() => {
                  if (i !== currentSpreadIndex && !flipState.isFlipping) {
                    if (i > currentSpreadIndex) {
                      setFlipState({
                        isFlipping: true,
                        direction: 'next',
                        fromSpread: currentSpreadIndex,
                        toSpread: i,
                      });
                    } else {
                      setFlipState({
                        isFlipping: true,
                        direction: 'prev',
                        fromSpread: currentSpreadIndex,
                        toSpread: i,
                      });
                    }
                    setTimeout(() => {
                      setCurrentSpreadIndex(i);
                      setFlipState((prev) => ({ ...prev, isFlipping: false }));
                    }, 650);
                  }
                }}
                className={`transition-all rounded-full ${
                  currentSpreadIndex === i
                    ? 'w-5 h-1.5 bg-amber-400'
                    : 'w-1.5 h-1.5 bg-neutral-700 hover:bg-neutral-500'
                }`}
                aria-label={`Go to spread ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNextPage}
            id="scrapbook-next-spread-btn"
            className="px-2.5 sm:px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 hover:border-amber-400 text-neutral-300 hover:text-white text-[10px] sm:text-xs font-mono flex items-center gap-1 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Launch Button to 3D Universe */}
      <div className="z-10 mt-2 sm:mt-3 text-center pb-1 sm:pb-0">
        <button
          onClick={onNextStage}
          id="enter-3d-universe-btn"
          className="px-7 sm:px-8 py-2.5 sm:py-3 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-200 font-mono text-xs uppercase tracking-widest hover:border-amber-400 hover:text-amber-300 active:scale-95 transition-all duration-300 shadow-xl inline-flex items-center gap-2 group cursor-pointer"
        >
          3D UNIVERSE
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </section>
  );
};
