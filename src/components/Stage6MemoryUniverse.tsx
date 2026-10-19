import React, { useRef, useState, useMemo, useEffect, Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Stars, Text, Image as DreiImage } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { Memory } from '../types';
import { MemoryModal } from './MemoryModal';

// Helper to test if WebGL is currently supported and unblocked
function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl && gl instanceof WebGLRenderingContext || (window.WebGL2RenderingContext && gl instanceof WebGL2RenderingContext));
  } catch {
    return false;
  }
}

// React Error Boundary for WebGL/Canvas failures
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
  onError?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('WebGL / 3D Canvas error caught, falling back to CSS 3D Universe:', error, errorInfo);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ================= R3F WebGL Components =================

interface MemoryCard3DProps {
  memory: Memory;
  position: [number, number, number];
  rotation: [number, number, number];
  onSelect: (memory: Memory) => void;
}

const FloatingPhotoCard: React.FC<MemoryCard3DProps> = ({
  memory,
  position,
  rotation,
  onSelect,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const safeImageUrl = memory.image || memory.fallbackImage || '';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.7 + position[0]) * 0.002;
      meshRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(memory);
      }}
    >
      <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.2, 2.9, 0.08]} />
          <meshStandardMaterial
            color={hovered ? '#1e293b' : '#090d16'}
            roughness={0.3}
            metalness={0.8}
            emissive={hovered ? '#f59e0b' : '#000000'}
            emissiveIntensity={hovered ? 0.4 : 0}
          />
        </mesh>

        {/* FRONT SIDE */}
        <group position={[0, 0, 0.045]}>
          <group position={[0, 0.22, 0]}>
            <DreiImage
              url={safeImageUrl}
              scale={[1.9, 1.9]}
              transparent
              radius={0.04}
            />
          </group>
          <Text
            position={[0, -1.05, 0.01]}
            fontSize={0.15}
            color={hovered ? '#fbbf24' : '#f8fafc'}
            anchorX="center"
            anchorY="middle"
          >
            {memory.title} {memory.emoji}
          </Text>
        </group>

        {/* BACK SIDE */}
        <group position={[0, 0, -0.045]} rotation={[0, Math.PI, 0]}>
          <group position={[0, 0.22, 0]}>
            <DreiImage
              url={safeImageUrl}
              scale={[1.9, 1.9]}
              transparent
              radius={0.04}
            />
          </group>
          <Text
            position={[0, -1.05, 0.01]}
            fontSize={0.15}
            color={hovered ? '#fbbf24' : '#f8fafc'}
            anchorX="center"
            anchorY="middle"
          >
            {memory.title} {memory.emoji}
          </Text>
        </group>
      </Float>
    </group>
  );
};

// ================= CSS 3D Orbital Universe Fallback =================

const CSS3DMemoryUniverse: React.FC<{
  memories: Memory[];
  onSelectMemory: (m: Memory) => void;
}> = ({ memories, onSelectMemory }) => {
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(-10);
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startRot = useRef({ x: -10, y: 0 });
  const autoRotateRef = useRef<number | null>(null);

  // Smooth CSS 3D auto rotation
  useEffect(() => {
    let lastT = performance.now();
    const animate = (t: number) => {
      const delta = (t - lastT) / 1000;
      lastT = t;
      if (!isDragging) {
        setRotY((prev) => (prev + delta * 12) % 360);
      }
      autoRotateRef.current = requestAnimationFrame(animate);
    };
    autoRotateRef.current = requestAnimationFrame(animate);

    return () => {
      if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
    };
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    startRot.current = { x: rotX, y: rotY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    setRotY(startRot.current.y + deltaX * 0.4);
    setRotX(Math.max(-45, Math.min(45, startRot.current.x - deltaY * 0.3)));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Pre-calculated star background
  const stars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: (i * 17) % 100,
      y: (i * 23) % 100,
      size: (i % 3) + 1,
      opacity: 0.2 + ((i % 5) * 0.15),
      delay: (i * 0.1) % 3,
    }));
  }, []);

  const total = memories.length;

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing bg-[#030305] select-none touch-none"
    >
      {/* Background Starfield */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient center glow */}
      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-amber-500/10 blur-[100px] sm:blur-[120px] pointer-events-none" />

      {/* 3D Perspective Stage */}
      <div
        className="relative w-full h-full flex items-center justify-center [perspective:1200px] sm:[perspective:1400px]"
        style={{ perspectiveOrigin: '50% 50%' }}
      >
        <div
          className="relative w-0 h-0 [transform-style:preserve-3d] transition-transform duration-75 ease-out"
          style={{
            transform: `translateZ(-80px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {/* Orbital Grid Ring */}
          <div
            className="absolute -top-[280px] -left-[280px] sm:-top-[360px] sm:-left-[360px] w-[560px] h-[560px] sm:w-[720px] sm:h-[720px] rounded-full border border-neutral-800/60 pointer-events-none [transform:rotateX(90deg)]"
          />

          {/* Floating Memory Cards */}
          {memories.map((mem, idx) => {
            const angle = (idx / total) * 360;
            const yOffset = (idx % 2 === 0 ? 1 : -1) * (15 + (idx % 3) * 20);
            const radius = typeof window !== 'undefined' && window.innerWidth < 640 ? 250 : 340;

            return (
              <div
                key={mem.id}
                className="absolute [transform-style:preserve-3d] origin-center -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${yOffset}px)`,
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, zIndex: 50 }}
                  whileTap={{ scale: 1.05 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMemory(mem);
                  }}
                  className="w-36 xs:w-44 sm:w-52 bg-[#0d0f17]/95 border border-neutral-800 hover:border-amber-400 p-2 sm:p-2.5 rounded-lg shadow-2xl backdrop-blur-md cursor-pointer group transition-all duration-300 [transform-style:preserve-3d]"
                >
                  {/* Photo Image */}
                  <div className="relative w-full h-36 xs:h-44 sm:h-48 rounded-md overflow-hidden bg-black">
                    <img
                      src={mem.image}
                      alt={mem.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (mem.fallbackImage && e.currentTarget.src !== mem.fallbackImage) {
                          e.currentTarget.src = mem.fallbackImage;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-xs sm:text-sm">{mem.emoji}</span>
                  </div>

                  {/* Title */}
                  <div className="mt-1.5 sm:mt-2 text-center">
                    <p className="text-[11px] sm:text-xs font-mono text-neutral-200 group-hover:text-amber-300 transition-colors font-medium truncate">
                      {mem.title}
                    </p>
                    <span className="text-[8px] sm:text-[9px] font-mono text-neutral-500 block">
                      {mem.date || '14 SEPT'}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ================= Main Stage 6 Component =================

interface Stage6MemoryUniverseProps {
  memories: Memory[];
}

export const Stage6MemoryUniverse: React.FC<Stage6MemoryUniverseProps> = ({ memories }) => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const supported = checkWebGLSupport();
    if (!supported) {
      setUseFallback(true);
    }
  }, []);

  // Generate 3D coordinates in a surrounding sphere field for Three.js
  const cardPositions = useMemo(() => {
    return memories.map((_, idx) => {
      const radius = 6.2 + (idx % 3) * 2.0;
      const phi = Math.acos(-1 + (2 * idx) / memories.length);
      const theta = Math.sqrt(memories.length * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = (idx % 2 === 0 ? 1 : -1) * (1.1 + (idx % 4) * 0.6);
      const z = radius * Math.sin(theta) * Math.sin(phi);

      const rotX = (Math.random() - 0.5) * 0.3;
      const rotY = (Math.random() - 0.5) * 0.5;
      const rotZ = (Math.random() - 0.5) * 0.2;

      return {
        pos: [x, y, z] as [number, number, number],
        rot: [rotX, rotY, rotZ] as [number, number, number],
      };
    });
  }, [memories]);

  return (
    <section className="relative w-full h-[100dvh] min-h-[500px] bg-[#030305] text-white overflow-hidden select-none">
      {useFallback ? (
        <CSS3DMemoryUniverse
          memories={memories}
          onSelectMemory={(m) => setSelectedMemory(m)}
        />
      ) : (
        <WebGLErrorBoundary
          onError={() => setUseFallback(true)}
          fallback={
            <CSS3DMemoryUniverse
              memories={memories}
              onSelectMemory={(m) => setSelectedMemory(m)}
            />
          }
        >
          <Canvas
            camera={{ position: [0, 0, 12], fov: 62 }}
            gl={{
              antialias: true,
              powerPreference: 'default',
              failIfMajorPerformanceCaveat: false,
            }}
            onCreated={({ gl }) => {
              gl.setClearColor('#030305', 1);
            }}
            className="w-full h-full"
          >
            <color attach="background" args={['#030305']} />
            <fog attach="fog" args={['#030305', 8, 30]} />

            {/* Ambient & Point Lighting */}
            <ambientLight intensity={0.7} />
            <pointLight position={[12, 12, 12]} intensity={1.8} color="#fbbf24" />
            <pointLight position={[-12, -12, -12]} intensity={1.2} color="#38bdf8" />

            {/* Floating Stars Field */}
            <Stars radius={50} depth={50} count={1800} factor={4} saturation={0} fade speed={1} />

            {/* Faint Background Grid */}
            <gridHelper args={[60, 60, '#1e293b', '#090d16']} position={[0, -6, 0]} />

            {/* Floating 3D Double-Sided Memory Cards */}
            <Suspense fallback={null}>
              {memories.map((mem, idx) => {
                const config = cardPositions[idx];
                return (
                  <FloatingPhotoCard
                    key={mem.id}
                    memory={mem}
                    position={config.pos}
                    rotation={config.rot}
                    onSelect={(m) => setSelectedMemory(m)}
                  />
                );
              })}
            </Suspense>

            {/* Interactive Camera Controls */}
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              rotateSpeed={0.5}
              autoRotate
              autoRotateSpeed={0.35}
              maxDistance={22}
              minDistance={4}
            />
          </Canvas>
        </WebGLErrorBoundary>
      )}

      {/* Subtle Floating UI Hints */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 pointer-events-none z-20">
        <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] sm:tracking-[0.35em] text-neutral-400 uppercase bg-black/50 border border-white/10 px-2.5 sm:px-3 py-1 rounded-full backdrop-blur-md">
          360° ORBIT
        </span>
      </div>

      <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-20 text-center px-4 w-full max-w-sm">
        <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-neutral-400 uppercase bg-neutral-950/80 px-3 sm:px-3.5 py-1.5 rounded-full border border-neutral-800 backdrop-blur-md inline-block">
          DRAG TO ORBIT • TAP TO INSPECT
        </span>
      </div>

      {/* Memory Detail Inspection Modal */}
      <MemoryModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
    </section>
  );
};
