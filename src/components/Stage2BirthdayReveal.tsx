import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface Stage2BirthdayRevealProps {
  name: string;
  newAge: number;
  onComplete: () => void;
}

export const Stage2BirthdayReveal: React.FC<Stage2BirthdayRevealProps> = ({ name, newAge, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle luxury gold & champagne stardust confetti on entry
    const count = 75;
    const defaults = {
      origin: { y: 0.88 },
      colors: ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff', '#e2e8f0', '#d97706']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.3, { spread: 45, startVelocity: 35 });
    fire(0.25, { spread: 65, decay: 0.92, scalar: 0.85 });
    fire(0.25, { spread: 110, startVelocity: 25, decay: 0.93, scalar: 1.0 });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] w-full bg-[#070709] flex flex-col items-center justify-between py-10 sm:py-14 px-4 sm:px-6 overflow-hidden select-none"
    >
      {/* Background subtle dark-gray age watermark 21 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04] overflow-hidden">
        <span className="text-[18rem] xs:text-[22rem] sm:text-[32rem] md:text-[40rem] lg:text-[48rem] font-extralight tracking-tighter text-white font-sans leading-none">
          {newAge}
        </span>
      </div>

      {/* Ambient glowing stardust & soft bokeh orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[550px] h-[300px] sm:h-[550px] bg-amber-500/10 rounded-full blur-[100px] sm:blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-rose-500/5 rounded-full blur-[90px] sm:blur-[120px]" />

        {/* Minimal floating golden particles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const size = 12 + (i % 3) * 10;
          const leftPos = (i * 12 + 4) % 94;
          const delay = (i * 0.6) % 4;
          const duration = 14 + (i % 3) * 3;

          return (
            <motion.div
              key={i}
              initial={{ y: '110vh', opacity: 0 }}
              animate={{
                y: '-20vh',
                opacity: [0, 0.35, 0.35, 0],
                x: [0, (i % 2 === 0 ? 15 : -15), 0]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: 'easeInOut'
              }}
              style={{ left: `${leftPos}%`, width: size, height: size }}
              className="absolute rounded-full border border-amber-300/25 bg-radial from-amber-200/10 via-transparent to-transparent backdrop-blur-[1px]"
            />
          );
        })}
      </div>

      {/* Top minimal subtle date */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center pt-2 sm:pt-0"
      >
        <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.35em] uppercase text-neutral-500">
          SEPTEMBER 14
        </span>
      </motion.div>

      {/* Center Luxury Minimal Birthday Typography */}
      <div className="z-10 my-auto text-center flex flex-col items-center max-w-4xl px-2 sm:px-4 w-full">
        {/* Delicate Serif Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm xs:text-base md:text-xl font-serif italic text-amber-200/80 tracking-wide font-light mb-3 sm:mb-4 px-2"
        >
          A toast to you & twenty-one years of pure radiance
        </motion.p>

        {/* Minimal Editorial Title */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="space-y-1 w-full"
        >
          <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-8xl font-light tracking-tight text-neutral-200 font-sans">
            HAPPY BIRTHDAY
          </h1>
          <h2 className="text-4xl xs:text-5xl sm:text-7xl md:text-9xl font-serif italic font-normal tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow-sm break-words">
            {name}
          </h2>
        </motion.div>

        {/* Refined Divider & Subtitle */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent my-4 sm:my-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-xs sm:text-sm text-neutral-400 font-sans max-w-md leading-relaxed tracking-wide px-2"
        >
          May your 21st year be filled with laughter, unforgettable horizons, big dreams, and all the happiness you give to the world.
        </motion.p>
      </div>

      {/* Bottom transition trigger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="z-10 text-center pb-2 sm:pb-0"
      >
        <button
          onClick={onComplete}
          id="enter-editorial-btn"
          className="px-7 sm:px-8 py-2.5 sm:py-3 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-300 font-mono text-xs uppercase tracking-widest hover:border-amber-400 hover:text-amber-300 active:scale-95 transition-all duration-300 shadow-xl flex items-center gap-3 group"
        >
          CONTINUE
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </motion.div>
    </section>
  );
};
