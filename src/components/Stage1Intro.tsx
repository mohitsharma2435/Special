import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Stage1IntroProps {
  oldAge: number;
  newAge: number;
  onComplete: () => void;
}

export const Stage1Intro: React.FC<Stage1IntroProps> = ({ oldAge, newAge, onComplete }) => {
  const [isTransitioned, setIsTransitioned] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const triggerTransition = () => {
    if (isTransitioned) {
      return;
    }
    setHasInteracted(true);
    setIsTransitioned(true);
  };

  useEffect(() => {
    // Elegant automatic transition after initial cinematic pause
    const timer = setTimeout(() => {
      if (!isTransitioned) {
        setIsTransitioned(true);
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [isTransitioned]);

  const tensDigit = Math.floor(newAge / 10);
  const oldUnitDigit = oldAge % 10;
  const newUnitDigit = newAge % 10;

  return (
    <section
      onClick={triggerTransition}
      className="relative min-h-[100dvh] w-full bg-[#050507] text-white flex flex-col items-center justify-between py-8 sm:py-12 px-4 sm:px-6 overflow-hidden cursor-pointer select-none"
    >
      {/* Subtle deep ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05)_0%,transparent_65%)] pointer-events-none" />

      {/* Top minimal clean spacer */}
      <div className="z-10 h-6" aria-hidden="true" />

      {/* Center Cinematic 20 -> 21 Number Rollover */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center w-full px-2">
        <div className="flex items-center justify-center font-sans select-none drop-shadow-2xl">
          {/* Static Tens Digit (2) - subtle breath */}
          <motion.span
            animate={{
              color: isTransitioned ? '#f4f4f5' : '#71717a',
              textShadow: isTransitioned
                ? '0 0 40px rgba(251, 191, 36, 0.25)'
                : '0 0 0px rgba(0,0,0,0)',
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[7.5rem] xs:text-[9rem] sm:text-[13rem] md:text-[18rem] lg:text-[22rem] font-extralight tracking-tighter leading-none"
          >
            {tensDigit}
          </motion.span>

          {/* Dynamic Units Digit (0 -> 1) Rolling Wheel with Motion Blur */}
          <div className="relative h-[7.5rem] xs:h-[9rem] sm:h-[13rem] md:h-[18rem] lg:h-[22rem] overflow-hidden flex items-center justify-center w-[4.8rem] xs:w-[5.8rem] sm:w-[8.5rem] md:w-[12rem] lg:w-[14rem]">
            <AnimatePresence mode="popLayout">
              {!isTransitioned ? (
                <motion.span
                  key="digit-0"
                  initial={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{
                    y: '-110%',
                    opacity: 0,
                    filter: 'blur(12px)',
                    scale: 0.9,
                  }}
                  transition={{
                    duration: 1.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute text-[7.5rem] xs:text-[9rem] sm:text-[13rem] md:text-[18rem] lg:text-[22rem] font-extralight tracking-tighter text-neutral-500 leading-none"
                >
                  {oldUnitDigit}
                </motion.span>
              ) : (
                <motion.span
                  key="digit-1"
                  initial={{
                    y: '110%',
                    opacity: 0,
                    filter: 'blur(16px)',
                    scale: 1.15,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    scale: 1,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute text-[7.5rem] xs:text-[9rem] sm:text-[13rem] md:text-[18rem] lg:text-[22rem] font-extralight tracking-tighter text-amber-300 leading-none"
                  style={{
                    textShadow: '0 0 50px rgba(251, 191, 36, 0.45), 0 0 100px rgba(245, 158, 11, 0.2)',
                  }}
                >
                  {newUnitDigit}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Glowing vertical light streak upon roll */}
            {isTransitioned && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 0.8, 0], scaleY: [0.2, 1.2, 0.2] }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute inset-x-0 h-full bg-gradient-to-b from-transparent via-amber-400/30 to-transparent pointer-events-none"
              />
            )}
          </div>
        </div>

        {/* Status Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 sm:mt-6 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase text-neutral-400 text-center">
            {isTransitioned ? 'CHAPTER 21 UNLOCKED' : 'TAP TO ROLL TO 21'}
          </span>
        </motion.div>
      </div>

      {/* Bottom minimalist action */}
      <div className="z-10 text-center flex flex-col items-center pb-2 sm:pb-0">
        {isTransitioned ? (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
            id="proceed-to-reveal-btn"
            className="px-7 sm:px-8 py-2.5 sm:py-3 rounded-full border border-neutral-700 bg-neutral-900/90 text-xs text-neutral-200 font-mono tracking-[0.25em] uppercase hover:border-amber-400 hover:text-amber-300 active:scale-95 transition-all duration-300 flex items-center gap-2.5 group shadow-lg"
          >
            ENTER
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </motion.button>
        ) : (
          <span className="text-[9px] sm:text-[10px] tracking-[0.3em] font-mono text-neutral-600 uppercase">
            {hasInteracted ? 'TRANSITIONING...' : 'TAP SCREEN'}
          </span>
        )}
      </div>
    </section>
  );
};
