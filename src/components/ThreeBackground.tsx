'use client';

import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface Shard {
  ref: React.RefObject<THREE.Mesh>;
  baseX: number;
  baseY: number;
  baseZ: number;
  speed: number;
  rotationSpeed: THREE.Vector3;
  scale: number;
}

function FloatingElements() {
  const count = 35;
  const shards = useMemo(() => {
    const arr: Shard[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        ref: React.createRef<THREE.Mesh>(),
        baseX: (Math.random() - 0.5) * 16,
        baseY: (Math.random() - 0.5) * 12,
        baseZ: (Math.random() - 0.5) * 6 - 2,
        speed: 0.12 + Math.random() * 0.25,
        rotationSpeed: new THREE.Vector3(
          Math.random() * 0.015,
          Math.random() * 0.015,
          Math.random() * 0.015
        ),
        scale: 0.12 + Math.random() * 0.28,
      });
    }
    return arr;
  }, []);

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const targetMouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { width, height } = state.viewport;

    shards.forEach((shard, index) => {
      if (!shard.ref.current) return;

      const mesh = shard.ref.current;

      // Antigravity drift
      const scrollFactor = scrollY * 0.008;
      const currentSpeed = shard.speed * (1 + scrollFactor * 0.6);
      
      const yOffset = (time * currentSpeed) % 18;
      let targetY = shard.baseY + yOffset;
      if (targetY > 9) targetY -= 18;

      const wobbleX = Math.sin(time * 0.8 + index) * 0.25;
      const wobbleZ = Math.cos(time * 0.8 + index) * 0.25;
      
      const currentBaseX = shard.baseX + wobbleX;
      const currentBaseY = targetY;
      const currentBaseZ = shard.baseZ + wobbleZ;

      // Mouse repulsion
      const mouse3D = new THREE.Vector3(
        targetMouse.current.x * width * 0.5,
        targetMouse.current.y * height * 0.5,
        0
      );

      const currentPos = new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z);
      const distance = currentPos.distanceTo(mouse3D);

      let forceX = 0;
      let forceY = 0;

      if (distance < 3.5) {
        const pushDir = new THREE.Vector3().subVectors(currentPos, mouse3D).normalize();
        const pushStrength = (3.5 - distance) * 0.7;
        forceX = pushDir.x * pushStrength;
        forceY = pushDir.y * pushStrength;
      }

      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, currentBaseX + forceX, 0.08);
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, currentBaseY + forceY, 0.08);
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, currentBaseZ, 0.08);

      mesh.rotation.x += shard.rotationSpeed.x;
      mesh.rotation.y += shard.rotationSpeed.y;
      mesh.rotation.z += shard.rotationSpeed.z;
    });
  });

  return (
    <>
      {shards.map((shard, idx) => {
        const geomType = idx % 3;
        return (
          <mesh
            key={idx}
            ref={shard.ref}
            position={[shard.baseX, shard.baseY, shard.baseZ]}
            scale={shard.scale}
          >
            {geomType === 0 && <octahedronGeometry args={[1, 0]} />}
            {geomType === 1 && <dodecahedronGeometry args={[0.8, 0]} />}
            {geomType === 2 && <tetrahedronGeometry args={[0.9, 0]} />}
            <meshPhysicalMaterial
              color={idx % 2 === 0 ? '#D4AF37' : '#6366F1'}
              emissive={idx % 2 === 0 ? '#302403' : '#11062c'}
              roughness={0.1}
              metalness={0.9}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              transmission={0.5}
              thickness={0.8}
            />
          </mesh>
        );
      })}
    </>
  );
}

function CentralOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!orbRef.current) return;
    orbRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    orbRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.8} floatIntensity={1.5}>
      <mesh ref={orbRef} position={[0, 0, -2.5]}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshPhysicalMaterial
          color="#120e2e"
          emissive="#6366F1"
          roughness={0.15}
          metalness={0.8}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transmission={0.6}
          thickness={1.5}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 750;
  
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 24;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color="#D4AF37"
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </points>
  );
}

export default function ThreeBackground() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const support = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebglSupported(support);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  return (
    <div className="fixed inset-0 -z-50 w-full h-full bg-[#050505] overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-[#050505] to-[#120e2e]/40 opacity-80" />
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-[#6366F1]/10 blur-[120px]" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#D4AF37]/5 blur-[150px]" />
      {webglSupported && (
        <Canvas
          camera={{ position: [0, 0, 7], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-5, -5, 2]} intensity={0.5} color="#6366F1" />
          <pointLight position={[0, 0, 3]} intensity={1.2} color="#D4AF37" />
          <Suspense fallback={null}>
            <ParticleField />
            <CentralOrb />
            <FloatingElements />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
