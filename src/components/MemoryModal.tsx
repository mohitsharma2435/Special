import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Memory } from '../types';
import { X, Heart, Calendar, Sparkles } from 'lucide-react';

interface MemoryModalProps {
  memory: Memory | null;
  onClose: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ memory, onClose }) => {
  if (!memory) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-xl md:max-w-2xl w-full max-h-[88vh] bg-neutral-900 border border-neutral-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl text-white flex flex-col md:flex-row overflow-y-auto my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            id="close-memory-modal-btn"
            className="absolute top-3 right-3 z-30 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-black text-neutral-300 hover:text-white transition-all border border-white/10 active:scale-90"
            aria-label="Close memory modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left / Top image display */}
          <div className="w-full md:w-1/2 h-52 xs:h-64 sm:h-72 md:h-auto min-h-[220px] bg-black relative overflow-hidden flex items-center justify-center shrink-0">
            <img
              src={memory.image}
              alt={memory.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (memory.fallbackImage && e.currentTarget.src !== memory.fallbackImage) {
                  e.currentTarget.src = memory.fallbackImage;
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-400 text-[11px] sm:text-xs font-mono flex items-center gap-1 border border-amber-400/20">
              <span>{memory.emoji}</span>
              <span>{memory.title}</span>
            </div>
            {memory.filename && (
              <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-neutral-300 text-[9px] font-mono border border-white/10">
                {memory.filename}
              </div>
            )}
          </div>

          {/* Right / Bottom memory details */}
          <div className="w-full md:w-1/2 p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col justify-between space-y-3 sm:space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-amber-400 uppercase tracking-widest mb-1.5">
                <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> MEMORY ARCHIVE
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-bold text-white">
                {memory.title}
              </h3>

              {memory.subtitle && (
                <p className="text-[11px] sm:text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                  {memory.subtitle}
                </p>
              )}

              <div className="w-10 sm:w-12 h-px bg-amber-500/60 my-3 sm:my-4" />

              <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                "{memory.note || 'A priceless moment stored forever in our memory universe.'}"
              </p>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-neutral-800 flex items-center justify-between text-[11px] sm:text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                {memory.date || 'AUGUST 2025'}
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <Heart className="w-3.5 h-3.5 fill-rose-400" /> FAVORITE
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
