"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { TabId } from "@/data/portfolio";
import { tabs } from "@/data/portfolio";

type Scene3DProps = {
  activeTab: TabId;
  reducedMotion?: boolean;
};

function TabMeshes({
  activeTab,
  reducedMotion,
}: {
  activeTab: TabId;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const cameraTarget = useRef(new THREE.Vector3(0, 0.4, 5.2));
  const accent = useMemo(
    () => tabs.find((t) => t.id === activeTab)?.accent ?? "#2dd4a8",
    [activeTab],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    const target = tabs.find((t) => t.id === activeTab)?.camera ?? [0, 0.4, 5.2];
    cameraTarget.current.set(target[0], target[1], target[2]);
    state.camera.position.lerp(cameraTarget.current, reducedMotion ? 1 : 0.045);
    state.camera.lookAt(0, 0, 0);

    if (!reducedMotion) {
      group.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group ref={group}>
      {activeTab === "about" && (
        <Float speed={reducedMotion ? 0 : 1.4} floatIntensity={reducedMotion ? 0 : 0.8}>
          <mesh scale={1.35}>
            <torusKnotGeometry args={[0.9, 0.28, 180, 24]} />
            <MeshDistortMaterial
              color={accent}
              distort={reducedMotion ? 0 : 0.35}
              speed={reducedMotion ? 0 : 1.6}
              roughness={0.2}
              metalness={0.55}
            />
          </mesh>
        </Float>
      )}

      {activeTab === "work" && (
        <group>
          {[-1.2, 0, 1.2].map((x, i) => (
            <Float
              key={x}
              speed={reducedMotion ? 0 : 1 + i * 0.2}
              floatIntensity={reducedMotion ? 0 : 0.5}
            >
              <mesh position={[x, i * 0.15 - 0.2, 0]} rotation={[0.4, 0.5, 0.2]}>
                <boxGeometry args={[0.7, 1.6 + i * 0.2, 0.7]} />
                <meshStandardMaterial
                  color={accent}
                  roughness={0.25}
                  metalness={0.65}
                  emissive={accent}
                  emissiveIntensity={0.12}
                />
              </mesh>
            </Float>
          ))}
        </group>
      )}

      {activeTab === "projects" && (
        <group>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r = 1.6 + (i % 3) * 0.25;
            return (
              <Float
                key={i}
                speed={reducedMotion ? 0 : 1.2 + (i % 4) * 0.15}
                floatIntensity={reducedMotion ? 0 : 0.6}
              >
                <mesh position={[Math.cos(a) * r, Math.sin(a * 1.4) * 0.7, Math.sin(a) * r]}>
                  <sphereGeometry args={[0.18 + (i % 3) * 0.05, 24, 24]} />
                  <meshStandardMaterial
                    color={i % 2 === 0 ? accent : "#f4efe6"}
                    roughness={0.3}
                    metalness={0.5}
                  />
                </mesh>
              </Float>
            );
          })}
          <mesh>
            <torusGeometry args={[1.7, 0.03, 16, 100]} />
            <meshBasicMaterial color={accent} transparent opacity={0.45} />
          </mesh>
        </group>
      )}

      {activeTab === "skills" && (
        <Float speed={reducedMotion ? 0 : 1.1} floatIntensity={reducedMotion ? 0 : 0.7}>
          <mesh scale={1.5} rotation={[0.4, 0.6, 0.1]}>
            <icosahedronGeometry args={[1.1, 0]} />
            <meshStandardMaterial
              color={accent}
              flatShading
              roughness={0.35}
              metalness={0.45}
              emissive={accent}
              emissiveIntensity={0.15}
            />
          </mesh>
        </Float>
      )}

      {activeTab === "contact" && (
        <Float speed={reducedMotion ? 0 : 1.3} floatIntensity={reducedMotion ? 0 : 1}>
          <mesh scale={1.4}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshDistortMaterial
              color={accent}
              distort={reducedMotion ? 0 : 0.28}
              speed={reducedMotion ? 0 : 1.2}
              roughness={0.15}
              metalness={0.7}
            />
          </mesh>
        </Float>
      )}
    </group>
  );
}

export default function Scene3D({ activeTab, reducedMotion = false }: Scene3DProps) {
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return (
    <Canvas
      className="scene-canvas"
      frameloop={pageVisible && !reducedMotion ? "always" : "demand"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.4, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#06110e"]} />
      <fog attach="fog" args={["#06110e", 6, 14]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 3]} intensity={1.35} color="#dff7ee" />
      <pointLight position={[-3, -1, 2]} intensity={1.1} color="#c4a574" />
      <Stars radius={40} depth={30} count={reducedMotion ? 400 : 1200} factor={3} fade speed={reducedMotion ? 0 : 0.6} />
      <TabMeshes activeTab={activeTab} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
