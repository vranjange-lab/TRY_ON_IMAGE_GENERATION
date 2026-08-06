import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Component to handle mouse parallax and camera smoothing
const SceneController = () => {
  const { camera, mouse } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    // Calculate target rotation based on mouse coordinates
    targetRotation.current.x = (mouse.x * Math.PI) / 8;
    targetRotation.current.y = (mouse.y * Math.PI) / 8;

    // Smoothly interpolate camera position/rotation (parallax)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 2, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 2, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// Central Glowing AI Orb with abstract waviness
const GlowingCore = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.x = time * 0.1;
      
      // Dynamic scaling to simulate "breathing" or pulsing AI
      const scale = 1 + Math.sin(time * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Outer Glow Sphere (Semi-transparent) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#8B5CF6"
          emissive="#EC4899"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={1.5}
          opacity={0.8}
          transparent
          wireframe={false}
        />
      </mesh>

      {/* Inner solid glowing core */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>
    </group>
  );
};

// Abstract Fabric-inspired winding ribbons (Torus Knot)
const FloatingRibbon = () => {
  const ribbonRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ribbonRef.current) {
      // Rotation and gentle waving motion
      ribbonRef.current.rotation.x = time * 0.15;
      ribbonRef.current.rotation.y = -time * 0.1;
      ribbonRef.current.position.y = Math.sin(time * 0.8) * 0.3;
    }
  });

  return (
    <mesh ref={ribbonRef} position={[0, 0, 0]}>
      {/* TorusKnot acts as an elegant folding abstract fabric element */}
      <torusKnotGeometry args={[2.5, 0.15, 150, 20, 3, 5]} />
      <meshPhysicalMaterial
        color="#EC4899"
        roughness={0.2}
        metalness={0.8}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        transmission={0.4}
        thickness={0.8}
        opacity={0.9}
        transparent
      />
    </mesh>
  );
};

// Futuristic orbital rings
const OrbitalRings = () => {
  const ringsRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ringsRef.current) {
      // Rotate the group of rings
      ringsRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group ref={ringsRef}>
      {/* Ring 1 */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[3.2, 0.04, 16, 100]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
      </mesh>
      
      {/* Ring 2 */}
      <mesh rotation={[-Math.PI / 4, -Math.PI / 3, 0]}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

// Floating background particles
const AnimatedParticles = () => {
  const pointsRef = useRef();
  
  // Create static positions and allow the frame loop to slide them
  const particleCount = 200;
  const [positions] = useState(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
      pointsRef.current.rotation.x = time * 0.03;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} limit={particleCount}>
      <PointMaterial
        transparent
        color="#38BDF8"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
};

const HeroCanvas = () => {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px] relative">
      {/* Subtle radial background glow behind canvas */}
      <div className="absolute inset-0 bg-radial from-brand-primary/10 via-transparent to-transparent pointer-events-none blur-3xl" />
      
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['transparent']} />
        
        {/* Soft lighting environment */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#8B5CF6" />
        <pointLight position={[-10, -10, -10]} intensity={1.0} color="#EC4899" />
        <pointLight position={[0, 0, 5]} intensity={1.2} color="#38BDF8" />
        
        <SceneController />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group scale={1.1}>
            <GlowingCore />
            <FloatingRibbon />
            <OrbitalRings />
            <AnimatedParticles />
          </group>
        </Float>
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
