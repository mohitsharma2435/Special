import React, { useState, useRef } from 'react';
import { birthdayConfig } from './data/config';
import { Memory } from './types';
import { MediaProvider, useMedia } from './context/MediaContext';

// Stages
import { Stage1Intro } from './components/Stage1Intro';
import { Stage2BirthdayReveal } from './components/Stage2BirthdayReveal';
import { Stage3EditorialHero } from './components/Stage3EditorialHero';
import { Stage4MemoryWall } from './components/Stage4MemoryWall';
import { Stage5Scrapbook } from './components/Stage5Scrapbook';
import { Stage6MemoryUniverse } from './components/Stage6MemoryUniverse';

// Controls & Modals
import { NavigationDots } from './components/NavigationDots';
import { MusicControl } from './components/MusicControl';
import { MemoryModal } from './components/MemoryModal';

function AppContent() {
  const { memories } = useMedia();
  const [currentStage, setCurrentStage] = useState(1);
  const [inspectedMemory, setInspectedMemory] = useState<Memory | null>(null);

  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage3Ref = useRef<HTMLDivElement>(null);
  const stage4Ref = useRef<HTMLDivElement>(null);
  const stage5Ref = useRef<HTMLDivElement>(null);
  const stage6Ref = useRef<HTMLDivElement>(null);

  const stageRefs = [stage1Ref, stage2Ref, stage3Ref, stage4Ref, stage5Ref, stage6Ref];

  const handleSelectStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    const targetRef = stageRefs[stageNum - 1];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative bg-black text-white min-h-screen font-sans selection:bg-amber-400 selection:text-black">
      {/* Fixed Ambient Audio Controller & Visualizer */}
      <MusicControl />

      {/* Fixed Right Navigation Dots */}
      <NavigationDots
        currentStage={currentStage}
        totalStages={6}
        onSelectStage={handleSelectStage}
      />

      {/* STAGE 01 — CINEMATIC INTRO */}
      <div ref={stage1Ref} id="stage-1">
        <Stage1Intro
          oldAge={birthdayConfig.oldAge}
          newAge={birthdayConfig.newAge}
          onComplete={() => {
            handleSelectStage(2);
          }}
        />
      </div>

      {/* STAGE 02 — BIRTHDAY REVEAL */}
      <div ref={stage2Ref} id="stage-2">
        <Stage2BirthdayReveal
          name={birthdayConfig.name}
          newAge={birthdayConfig.newAge}
          onComplete={() => handleSelectStage(3)}
        />
      </div>

      {/* STAGE 03 — EDITORIAL HERO & CURVED FILM STRIP */}
      <div ref={stage3Ref} id="stage-3">
        <Stage3EditorialHero
          name={birthdayConfig.name}
          dateLabel={birthdayConfig.dateLabel}
          subtitle={birthdayConfig.subtitle}
          footerText={birthdayConfig.footerText}
          memories={memories}
          onSelectMemory={(m) => setInspectedMemory(m)}
          onNextStage={() => handleSelectStage(4)}
        />
      </div>

      {/* STAGE 04 — POLAROID MEMORY WALL */}
      <div ref={stage4Ref} id="stage-4">
        <Stage4MemoryWall
          memories={memories}
          onSelectMemory={(m) => setInspectedMemory(m)}
          onNextStage={() => handleSelectStage(5)}
        />
      </div>

      {/* STAGE 05 — SCRAPBOOK / JOURNAL */}
      <div ref={stage5Ref} id="stage-5">
        <Stage5Scrapbook
          onNextStage={() => handleSelectStage(6)}
        />
      </div>

      {/* STAGE 06 — 3D FLOATING MEMORY UNIVERSE */}
      <div ref={stage6Ref} id="stage-6">
        <Stage6MemoryUniverse memories={memories} />
      </div>

      {/* Global Memory Detail Modal */}
      <MemoryModal
        memory={inspectedMemory}
        onClose={() => setInspectedMemory(null)}
      />
    </main>
  );
}

export default function App() {
  return (
    <MediaProvider>
      <AppContent />
    </MediaProvider>
  );
}
