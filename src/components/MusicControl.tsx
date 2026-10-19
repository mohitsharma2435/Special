import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';
import { useMedia } from '../context/MediaContext';

export const MusicControl: React.FC = () => {
  const {
    isPlaying,
    isMuted,
    volume,
    togglePlay,
    toggleMute,
    setVolume,
  } = useMedia();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  return (
    <aside
      aria-label="Audio Controls"
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-auto sm:right-6 z-50 flex items-center gap-2"
    >
      {/* Floating Pill Container */}
      <div className="flex items-center p-1 sm:p-1.5 rounded-full bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 text-neutral-300 text-xs shadow-2xl transition-all select-none">
        {/* Tap to Play / Pause Main Interactive Button */}
        <button
          onClick={togglePlay}
          id="music-play-toggle-btn"
          aria-label={isPlaying ? 'Pause birthday melody' : 'Tap to play birthday melody'}
          className="flex items-center gap-2 px-1 py-0.5 rounded-full hover:bg-neutral-800/80 cursor-pointer active:scale-95 transition-all group"
        >
          {/* Play/Pause Circle Icon */}
          <div
            className={`p-2 rounded-full transition-all flex items-center justify-center shrink-0 ${
              isPlaying
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30 group-hover:scale-105'
                : 'bg-amber-400 text-black shadow-lg shadow-amber-400/40 group-hover:scale-110 animate-pulse'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-black" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-black translate-x-0.5" />
            )}
          </div>

          {/* Status Label & Equalizer */}
          <div className="flex items-center gap-2 pr-1.5">
            {isPlaying ? (
              <>
                <div className="flex items-end gap-0.5 h-3.5 shrink-0" aria-hidden="true">
                  <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 h-4 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase">
                  Playing
                </span>
              </>
            ) : (
              <>
                <span className="font-medium text-xs text-amber-300 tracking-wide">
                  Tap to play
                </span>
                <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </>
            )}
          </div>
        </button>

        {/* Separator */}
        <div className="w-px h-4 bg-neutral-700/80 mx-0.5" />

        {/* Volume & Mute Controls */}
        <div
          className="relative flex items-center pr-1"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Expandable Volume Slider */}
          {showVolumeSlider && (
            <div
              className="absolute bottom-full mb-2 right-0 p-2 bg-neutral-900/95 backdrop-blur-md border border-neutral-700 rounded-lg shadow-xl flex flex-col items-center gap-1.5 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 accent-amber-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
              />
              <span className="text-[9px] font-mono text-neutral-400">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
