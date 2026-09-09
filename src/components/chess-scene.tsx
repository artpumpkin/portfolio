"use client";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Chess, type Square } from "chess.js";
import { squares } from "@/lib/chess";
function SceneReady({ onReady }: { onReady: () => void }) {
  const frame = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  useFrame(({ gl }) => {
    if (frame.current === null) {
      // useFrame runs before rendering. Reveal only after that frame completes.
      frame.current = requestAnimationFrame(() => {
        gl.domElement.dataset.ready = "true";
        onReady();
      });
    }
  });
  return null;
}
function FixedCamera({ exploring }: { exploring: boolean }) {
  const { camera, invalidate, size } = useThree();
  useEffect(() => {
    if (!exploring) {
      camera.position.set(6.7, 8.8, 10.5);
      camera.lookAt(0, 0, 0);
      // Three.js owns this mutable camera; update it only after React commits.
      // eslint-disable-next-line react-hooks/immutability
      camera.zoom = Math.min(1.4, Math.max(0.95, size.width / 380));
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      invalidate();
    }
  }, [exploring, camera, invalidate, size.width]);
  return null;
}
function Piece({ kind, color }: { kind: string; color: string }) {
  const mat = (
    <meshStandardMaterial color={color} roughness={0.32} metalness={0.13} />
  );
  return (
    <group>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.29, 0.16, 32]} />
        {mat}
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.24, 0.1, 32]} />
        {mat}
      </mesh>
      <mesh position={[0, 0.44, 0]} castShadow>
        <cylinderGeometry args={[0.115, 0.19, 0.4, 32]} />
        {mat}
      </mesh>
      <mesh position={[0, 0.69, 0]} castShadow>
        <cylinderGeometry args={[0.21, 0.12, 0.13, 32]} />
        {mat}
      </mesh>
      {kind === "q" ? (
        <>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.19, 0.14, 0.15, 32]} />
            {mat}
          </mesh>
          {Array.from({ length: 5 }, (_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i * Math.PI * 2) / 5) * 0.145,
                0.91,
                Math.sin((i * Math.PI * 2) / 5) * 0.145,
              ]}
              castShadow
            >
              <sphereGeometry args={[0.062, 12, 12]} />
              {mat}
            </mesh>
          ))}
          <mesh position={[0, 0.91, 0]} castShadow>
            <sphereGeometry args={[0.085, 16, 16]} />
            {mat}
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0, 0.84, 0]} castShadow>
            <sphereGeometry args={[0.15, 24, 24]} />
            {mat}
          </mesh>
          <mesh position={[0, 1.04, 0]} castShadow>
            <boxGeometry args={[0.075, 0.27, 0.075]} />
            {mat}
          </mesh>
          <mesh position={[0, 1.07, 0]} castShadow>
            <boxGeometry args={[0.22, 0.075, 0.075]} />
            {mat}
          </mesh>
        </>
      )}
    </group>
  );
}
export default function ChessScene({
  fen,
  selected,
  targets,
  onSquare,
  solved,
  active,
  onReady,
  exploring,
}: {
  fen: string;
  selected: Square | null;
  targets: Square[];
  onSquare: (s: Square) => void;
  solved: boolean;
  active: boolean;
  exploring: boolean;
  onReady: () => void;
}) {
  const game = new Chess(fen);
  return (
    <Canvas
      aria-hidden="true"
      tabIndex={-1}
      shadows
      dpr={[1, 1.5]}
      frameloop={active ? "demand" : "never"}
      camera={{ position: [6.7, 8.8, 10.5], fov: 37 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
    >
      <SceneReady onReady={onReady} />
      <FixedCamera exploring={exploring} />
      <ambientLight intensity={1.7} />
      <directionalLight
        position={[-4, 10, 4]}
        intensity={3}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />
      <directionalLight position={[6, 3, -4]} intensity={1.1} color="#e9c49e" />
      <group position={[0, 0.35, 0]} rotation={[0, -0.12, 0]}>
        <mesh position={[0, -0.21, 0]} receiveShadow castShadow>
          <boxGeometry args={[6.16, 0.36, 6.16]} />
          <meshStandardMaterial color="#665b46" roughness={0.55} />
        </mesh>
        {squares.map((s, i) => {
          const x = ((i % 8) - 3.5) * 0.74,
            z = (Math.floor(i / 8) - 3.5) * 0.74,
            p = game.get(s);
          return (
            <group
              key={s}
              position={[x, 0, z]}
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                if (!exploring && e.delta < 5) onSquare(s);
              }}
            >
              <mesh receiveShadow>
                <boxGeometry args={[0.738, 0.08, 0.738]} />
                <meshStandardMaterial
                  color={
                    selected === s
                      ? "#bc7954"
                      : (i + Math.floor(i / 8)) % 2 === 0
                        ? "#e5dfce"
                        : "#748174"
                  }
                  roughness={0.75}
                />
              </mesh>
              {targets.includes(s) && (
                <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.08, 0.12, 24]} />
                  <meshBasicMaterial color="#80422d" />
                </mesh>
              )}
              {p && (
                <group position={[0, 0.05, 0]}>
                  <Piece
                    kind={p.type}
                    color={p.color === "w" ? "#ece7d8" : "#343d36"}
                  />
                </group>
              )}
            </group>
          );
        })}
        {solved &&
          Array.from({ length: 18 }, (_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos(i) * 3.8,
                0.5 + (i % 4) * 0.32,
                Math.sin(i) * 3.8,
              ]}
            >
              <octahedronGeometry args={[0.055 + (i % 3) * 0.02]} />
              <meshStandardMaterial color={i % 2 ? "#a75535" : "#c5ae75"} />
            </mesh>
          ))}
      </group>
      <ContactShadows
        position={[0, -0.09, 0]}
        opacity={0.28}
        scale={13}
        blur={2.5}
        far={5}
        frames={1}
      />
      <OrbitControls
        key={exploring ? "explore" : "play"}
        enabled={exploring}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0.3}
        maxPolarAngle={1.15}
        minAzimuthAngle={-0.7}
        maxAzimuthAngle={0.7}
      />
    </Canvas>
  );
}
