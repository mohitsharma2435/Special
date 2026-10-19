import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { birthdayConfig, memories as initialMemories } from '../data/config';
import { Memory } from '../types';

interface MediaContextType {
  memories: Memory[];
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  musicTitle: string;
  togglePlay: () => void;
  startPlaying: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
}

const MediaContext = createContext<MediaContextType | null>(null);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  // Default to 1.0 (100% full volume) for maximum audibility
  const [volume, setVolumeState] = useState(1.0);

  const musicTitle = birthdayConfig.musicTitle || "Endhayya Saami • Shreya's Birthday Melody";

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const isMutedRef = useRef(false);
  const volumeRef = useRef(1.0);

  // Sync refs with state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) {
      audioRef.current.volume = isMutedRef.current ? 0 : volume;
    }
  }, [volume]);

  // Handle play/pause events on the DOM audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMutedRef.current ? 0 : volumeRef.current;
    audio.muted = isMutedRef.current;

    const onPlay = () => {
      setIsPlaying(true);
      isPlayingRef.current = true;
    };

    const onPause = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  // Direct user-invoked startPlaying method
  const startPlaying = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMutedRef.current ? 0 : volumeRef.current;
    audio.muted = isMutedRef.current;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        })
        .catch((err) => {
          console.warn('Playback request error:', err);
        });
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      audio.volume = isMutedRef.current ? 0 : volumeRef.current;
      audio.muted = isMutedRef.current;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            isPlayingRef.current = true;
          })
          .catch((e) => {
            console.warn('Direct toggle play error:', e);
          });
      }
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      if (audioRef.current) {
        audioRef.current.muted = next;
        audioRef.current.volume = next ? 0 : volumeRef.current;
      }
      return next;
    });
  }, []);

  const setVolume = useCallback((v: number) => {
    const val = Math.max(0, Math.min(1, v));
    setVolumeState(val);
    volumeRef.current = val;
    if (audioRef.current) {
      audioRef.current.volume = isMutedRef.current ? 0 : val;
    }
  }, []);

  return (
    <MediaContext.Provider
      value={{
        memories: initialMemories,
        isPlaying,
        isMuted,
        volume,
        musicTitle,
        togglePlay,
        startPlaying,
        toggleMute,
        setVolume,
      }}
    >
      {/* Persistent DOM Audio Element with Multiple Audio Fallback Sources */}
      <audio
        ref={audioRef}
        id="birthday-background-music"
        src={birthdayConfig.musicUrl || '/music.mp3'}
        preload="auto"
        loop
        playsInline
      >
        <source src={birthdayConfig.musicUrl || '/music.mp3'} type="audio/mpeg" />
        <source src="/music.mp3" type="audio/mpeg" />
        <source src="/music.m4a" type="audio/mp4" />
        <source
          src="/assets/aistudio/Endhayya_Saami_Audio_Song___Ranabaali___Vijay_Deverakonda_Rashmika___Ajay-Atul___Rahul_Sankrityan_fb6d6c4c.m4a"
          type="audio/mp4"
        />
      </audio>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const ctx = useContext(MediaContext);
  if (!ctx) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return ctx;
};
