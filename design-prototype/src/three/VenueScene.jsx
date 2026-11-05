import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { usePerf } from "../perf/PerfProvider.jsx";

// ===========================================================================
// LUXURY AEROSPACE PBR MATERIALS
// ===========================================================================
const MAT_GOLD = {
  color: "#F59E0B",
  emissive: "#B45309",
  emissiveIntensity: 0.25,
  metalness: 0.95,
  roughness: 0.12,
  clearcoat: 1.0,
  clearcoatRoughness: 0.08,
};

const MAT_CHROME = {
  color: "#F8FAFC",
  metalness: 0.98,
  roughness: 0.05,
  clearcoat: 1.0,
  clearcoatRoughness: 0.04,
};

const MAT_TITANIUM = {
  color: "#0F172A",
  metalness: 0.88,
  roughness: 0.22,
  clearcoat: 0.8,
  clearcoatRoughness: 0.12,
};

const MAT_SLATE = {
  color: "#1E293B",
  metalness: 0.75,
  roughness: 0.28,
  clearcoat: 0.5,
};

const MAT_CYAN = {
  color: "#38BDF8",
  emissive: "#0284C7",
  emissiveIntensity: 0.45,
  metalness: 0.85,
  roughness: 0.12,
  clearcoat: 1.0,
};

const MAT_EMERALD = {
  color: "#22C55E",
  emissive: "#15803D",
  emissiveIntensity: 0.35,
  metalness: 0.2,
  roughness: 0.18,
  clearcoat: 1.0,
  clearcoatRoughness: 0.08,
};

// ===========================================================================
// 0. PUMP.FUN: 3D Mint & White Capsule Pill
// ===========================================================================
function PumpFunPill() {
  const group = useRef(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.20;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.6) * 0.03;
  });

  return (
    <group ref={group} rotation={[0.20, 0.12, -Math.PI / 4.2]}>
      {/* Lower Half - Mint Green */}
      <mesh position={[0, -0.07, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.14, 32]} />
        <meshPhysicalMaterial {...MAT_EMERALD} />
      </mesh>
      <mesh position={[0, -0.14, 0]}>
        <sphereGeometry args={[0.14, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshPhysicalMaterial {...MAT_EMERALD} />
      </mesh>

      {/* Upper Half - Porcelain White */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.14, 32]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.12}
          metalness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
        />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <sphereGeometry args={[0.14, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.12}
          metalness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
        />
      </mesh>

      {/* Recessed Dividing Seam Ring */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.143, 0.010, 12, 32]} />
        <meshStandardMaterial color="#0A0E14" roughness={0.4} />
      </mesh>

      {/* 24k Gold Center Brand Ring */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.141, 0.005, 12, 32]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* Specular Glint Stripe */}
      <mesh position={[0.09, 0.05, 0.09]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.014, 0.06, 8, 16]} />
        <meshBasicMaterial color="#FFFFFF" opacity={0.65} transparent />
      </mesh>
    </group>
  );
}

// ===========================================================================
// 1. METEORA DBC: 3D Hypersonic Meteor Dart & Plasma Slipstream
// ===========================================================================
function MeteoraMeteor() {
  const group = useRef(null);
  const ringRef = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.9 + 1) * 0.22;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + 1) * 0.035;
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.015;
    }
  });

  return (
    <group ref={group} rotation={[0.2, 0.1, -0.3]}>
      {/* Central 24k Gold Fuselage Dart */}
      <mesh position={[0, 0.05, 0]}>
        <coneGeometry args={[0.10, 0.38, 4]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* Titanium Main Body Core */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.09, 0.06, 0.22, 4]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} />
      </mesh>

      {/* Swept Delta Wing Blades */}
      <mesh position={[-0.14, -0.06, 0]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.22, 0.06, 0.02]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      <mesh position={[0.14, -0.06, 0]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.22, 0.06, 0.02]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* Trailing Supersonic Slipstream Ring */}
      <group ref={ringRef} position={[0, -0.20, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.012, 12, 32]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.65} />
      </group>
    </group>
  );
}

// ===========================================================================
// 2. RAYDIUM: 3D Faceted Diamond Crystal & Gyroscopic Cyan Prism
// ===========================================================================
function RaydiumCrystal() {
  const group = useRef(null);
  const ringRef = useRef(null);
  const ring2Ref = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.85 + 2) * 0.20;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4 + 2) * 0.03;
    if (ringRef.current) {
      ringRef.current.rotation.x += 0.012;
      ringRef.current.rotation.y += 0.015;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= 0.015;
      ring2Ref.current.rotation.z += 0.012;
    }
  });

  return (
    <group ref={group}>
      {/* Outer Cyan Gyroscope Ring */}
      <group ref={ringRef}>
        <mesh rotation={[0.45, 0.3, 0]}>
          <torusGeometry args={[0.26, 0.012, 16, 48]} />
          <meshPhysicalMaterial {...MAT_CYAN} />
        </mesh>
      </group>

      {/* Inner Gold Counter-Rotating Gyroscope Ring */}
      <group ref={ring2Ref}>
        <mesh rotation={[-0.4, 0.5, 0.3]}>
          <torusGeometry args={[0.21, 0.009, 14, 36]} />
          <meshPhysicalMaterial {...MAT_GOLD} />
        </mesh>
      </group>

      {/* Central Faceted Jewel-Cut Diamond Shard */}
      <mesh position={[0, 0, 0]} rotation={[0.2, 0.4, 0]}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshPhysicalMaterial
          color="#E0F2FE"
          emissive="#38BDF8"
          emissiveIntensity={0.35}
          transmission={0.75}
          roughness={0.05}
          metalness={0.12}
          ior={1.65}
          clearcoat={1.0}
        />
      </mesh>

      {/* Inset Gold Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
    </group>
  );
}

// ===========================================================================
// 3. BAGS: AUTHENTIC 3D MONEY BAG 💰
// Plump teardrop sack, pinched waist, tied gold rope, ruffled crown, gold coins, '$' medallion
// ===========================================================================
function BagsMoneyBag() {
  const group = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.85) * 0.18;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
  });

  return (
    <group ref={group}>
      {/* 1. Plump Teardrop Cloth Sack Body */}
      {/* Lower Belly - Wide plump base */}
      <mesh position={[0, -0.06, 0]} scale={[1.1, 0.9, 1.05]}>
        <sphereGeometry args={[0.20, 32, 24]} />
        <meshPhysicalMaterial
          color="#C6923C" // Warm golden saddle burlap canvas
          roughness={0.72} // Natural cloth texture
          metalness={0.05}
          clearcoat={0.12}
        />
      </mesh>

      {/* Tapered Waist up to Cinch */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.085, 0.18, 0.14, 32]} />
        <meshPhysicalMaterial
          color="#C6923C"
          roughness={0.72}
          metalness={0.05}
          clearcoat={0.12}
        />
      </mesh>

      {/* 2. Tied 24k Gold Braided Cord around Cinch */}
      <mesh position={[0, 0.12, 0]}>
        <torusGeometry args={[0.088, 0.016, 16, 36]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* Front Knot */}
      <mesh position={[0, 0.12, 0.095]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* Dual Hanging Gold Rope Tassels */}
      <mesh position={[-0.024, 0.05, 0.095]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.006, 0.010, 0.12, 8]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      <mesh position={[0.024, 0.05, 0.095]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.006, 0.010, 0.12, 8]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* 3. Flared Pleated Cloth Crown / Ruffled Mouth */}
      <mesh position={[0, 0.17, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.13, 0.09, 20, 1, true]} />
        <meshPhysicalMaterial
          color="#C6923C"
          roughness={0.72}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pleat Creases on Crown Lip */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const px = Math.cos(rad) * 0.105;
        const pz = Math.sin(rad) * 0.105;
        return (
          <mesh key={i} position={[px, 0.20, pz]}>
            <sphereGeometry args={[0.016, 8, 8]} />
            <meshPhysicalMaterial color="#B5812B" roughness={0.75} />
          </mesh>
        );
      })}

      {/* 4. Overflowing 24k Gold Bullion Coins in Mouth */}
      <group position={[0, 0.16, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.03, 20]} />
          <meshPhysicalMaterial {...MAT_GOLD} />
        </mesh>
        <mesh position={[0.03, 0.03, 0.02]} rotation={[0.3, 0.3, 0.1]}>
          <cylinderGeometry args={[0.035, 0.035, 0.012, 20]} />
          <meshPhysicalMaterial {...MAT_GOLD} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.03, 0.04, -0.01]} rotation={[-0.2, -0.3, -0.2]}>
          <cylinderGeometry args={[0.033, 0.033, 0.012, 20]} />
          <meshPhysicalMaterial {...MAT_GOLD} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.01, 0.05, -0.02]} rotation={[0.1, 0.2, 0.4]}>
          <cylinderGeometry args={[0.032, 0.032, 0.012, 20]} />
          <meshPhysicalMaterial {...MAT_GOLD} emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* 5. Bold Embossed 24k Gold '$' Medallion on Front Belly */}
      <group position={[0, -0.04, 0.205]}>
        {/* Medallion disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.072, 0.072, 0.014, 32]} />
          <meshPhysicalMaterial {...MAT_GOLD} emissiveIntensity={0.35} />
        </mesh>
        {/* Bezel Ring */}
        <mesh position={[0, 0, 0.008]}>
          <ringGeometry args={[0.060, 0.070, 32]} />
          <meshStandardMaterial color="#78350F" roughness={0.35} />
        </mesh>
        {/* '$' Vertical spine */}
        <mesh position={[0, 0, 0.012]}>
          <boxGeometry args={[0.016, 0.095, 0.008]} />
          <meshPhysicalMaterial {...MAT_GOLD} emissiveIntensity={0.6} />
        </mesh>
        {/* Top 'S' loop */}
        <mesh position={[0, 0.020, 0.012]}>
          <torusGeometry args={[0.024, 0.007, 8, 16, Math.PI * 1.5]} />
          <meshPhysicalMaterial {...MAT_GOLD} emissiveIntensity={0.6} />
        </mesh>
        {/* Bottom 'S' loop */}
        <mesh position={[0, -0.020, 0.012]}>
          <torusGeometry args={[0.024, 0.007, 8, 16, Math.PI * 1.5]} />
          <meshPhysicalMaterial {...MAT_GOLD} emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// ===========================================================================
// 4. LETSBONK: 3D Solid 24k Gold Bonk Sledgehammer of Velocity
// ===========================================================================
function LetsBonkHammer() {
  const group = useRef(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.9 + 4) * 0.22;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + 4) * 0.03;
  });

  return (
    <group ref={group} rotation={[0.15, 0.1, -0.20]}>
      {/* Knurled Aerospace Titanium Shaft */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.36, 24]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} />
      </mesh>

      {/* Gold Pommel Counterweight */}
      <mesh position={[0, -0.24, 0]}>
        <cylinderGeometry args={[0.034, 0.026, 0.035, 24]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* Gold Shaft Collar Rings */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.030, 0.010, 12, 24]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* Solid 24k Gold Sledgehammer Head */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.30, 0.15, 0.15]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* Mirror-Polished Strike Faceplates */}
      <mesh position={[-0.155, 0.14, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.068, 0.068, 0.014, 32]} />
        <meshPhysicalMaterial {...MAT_CHROME} />
      </mesh>
      <mesh position={[0.155, 0.14, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.068, 0.068, 0.014, 32]} />
        <meshPhysicalMaterial {...MAT_CHROME} />
      </mesh>

      {/* Cyan Plasma Energy Conduit */}
      <mesh position={[0, 0.14, 0.078]}>
        <boxGeometry args={[0.22, 0.020, 0.006]} />
        <meshPhysicalMaterial {...MAT_CYAN} emissiveIntensity={0.8} />
      </mesh>

      {/* Floating Gold Impact Star Sparks */}
      <mesh position={[0.20, 0.24, 0.06]} rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.035, 0]} />
        <meshBasicMaterial color="#FDE047" />
      </mesh>
    </group>
  );
}

// ===========================================================================
// 5. STONKFUN: 3D Emerald Stonks Ascension Monolith
// ===========================================================================
function StonkFunRocket() {
  const group = useRef(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.9 + 5) * 0.22;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + 5) * 0.035;
  });

  return (
    <group ref={group}>
      {/* Stepped Architectural Monolith Pedestal */}
      <mesh position={[-0.14, -0.16, 0]}>
        <boxGeometry args={[0.10, 0.12, 0.14]} />
        <meshPhysicalMaterial {...MAT_SLATE} />
      </mesh>
      <mesh position={[-0.04, -0.10, 0]}>
        <boxGeometry args={[0.10, 0.24, 0.14]} />
        <meshPhysicalMaterial {...MAT_SLATE} />
      </mesh>
      <mesh position={[0.06, -0.04, 0]}>
        <boxGeometry args={[0.10, 0.36, 0.14]} />
        <meshPhysicalMaterial {...MAT_SLATE} />
      </mesh>

      {/* Slashing 3D Emerald Breakout Arrow */}
      <mesh position={[0.02, 0.08, 0.08]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.065, 0.42, 0.065]} />
        <meshPhysicalMaterial {...MAT_EMERALD} />
      </mesh>

      {/* Apex 24k Gold Arrowhead */}
      <mesh position={[0.17, 0.23, 0.08]} rotation={[0, 0, -Math.PI / 4]}>
        <coneGeometry args={[0.11, 0.16, 4]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
    </group>
  );
}

// ===========================================================================
// 6. PRINTR: 3D High-Speed Currency Minting Press
// ===========================================================================
function PrintrMachine() {
  const group = useRef(null);
  const roller1 = useRef(null);
  const roller2 = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.85 + 6) * 0.22;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + 6) * 0.035;
    if (roller1.current) roller1.current.rotation.x += 0.08;
    if (roller2.current) roller2.current.rotation.x -= 0.08;
  });

  return (
    <group ref={group}>
      {/* Matte Dark Titanium Chassis */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[0.42, 0.22, 0.26]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} />
      </mesh>

      {/* Dual Counter-Rotating Mirror Chrome Rollers */}
      <mesh ref={roller1} position={[0, 0.07, 0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.042, 0.042, 0.36, 24]} />
        <meshPhysicalMaterial {...MAT_CHROME} />
      </mesh>
      <mesh ref={roller2} position={[0, 0.07, -0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.042, 0.042, 0.36, 24]} />
        <meshPhysicalMaterial {...MAT_CHROME} />
      </mesh>

      {/* Flowing Curved Ribbon of Freshly Minted Currency */}
      <mesh position={[0, 0.15, 0.12]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[0.30, 0.22, 0.012]} />
        <meshPhysicalMaterial {...MAT_EMERALD} />
      </mesh>

      {/* Gold Security Thread Stripe */}
      <mesh position={[0, 0.15, 0.128]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[0.03, 0.22, 0.005]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* Status LED Bar */}
      <mesh position={[0, -0.04, 0.135]}>
        <boxGeometry args={[0.34, 0.020, 0.01]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>
    </group>
  );
}

// ===========================================================================
// 7. ANONCOIN: 3D Stealth Carbon-Titanium Operative Mask
// ===========================================================================
function AnoncoinMask() {
  const group = useRef(null);
  const ringRef = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.85 + 7) * 0.24;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + 7) * 0.035;
    if (ringRef.current) ringRef.current.rotation.z += 0.014;
  });

  return (
    <group ref={group}>
      {/* Matte Stealth Low-Poly Mask Cowl */}
      <mesh position={[0, 0, 0]}>
        <dodecahedronGeometry args={[0.22, 1]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} clearcoat={0.9} />
      </mesh>

      {/* Emissive Neon Cyan Cipher HUD Visor */}
      <mesh position={[0, 0.06, 0.20]}>
        <boxGeometry args={[0.26, 0.035, 0.04]} />
        <meshPhysicalMaterial {...MAT_CYAN} emissiveIntensity={0.8} />
      </mesh>

      {/* Orbiting Dark Chrome Data Ring */}
      <mesh ref={ringRef} rotation={[1.1, 0.3, 0]}>
        <torusGeometry args={[0.34, 0.012, 12, 48]} />
        <meshPhysicalMaterial {...MAT_CYAN} />
      </mesh>
    </group>
  );
}

// ===========================================================================
// 8. SURGE: 3D Continuous Crystalline Lightning Bolt & Confinement Ring
// ===========================================================================
function SurgeLightning() {
  const group = useRef(null);
  const ringRef = useRef(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.9 + 8) * 0.22;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + 8) * 0.035;
    if (ringRef.current) ringRef.current.rotation.y += 0.022;
  });

  return (
    <group ref={group}>
      {/* 3D Continuous Zigzag Lightning Core */}
      <mesh position={[-0.04, 0.16, 0]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.06, 0.20, 0.05]} />
        <meshPhysicalMaterial {...MAT_CYAN} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.02, 0.04, 0]} rotation={[0, 0, 0.7]}>
        <boxGeometry args={[0.055, 0.18, 0.05]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          emissive="#38BDF8"
          emissiveIntensity={1.0}
          metalness={0.5}
          roughness={0.1}
          clearcoat={1.0}
        />
      </mesh>
      <mesh position={[-0.02, -0.12, 0]} rotation={[0, 0, -0.4]}>
        <coneGeometry args={[0.06, 0.22, 4]} />
        <meshPhysicalMaterial {...MAT_CYAN} emissiveIntensity={0.8} />
      </mesh>

      {/* Plasma Confinement Ring */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.30, 0.014, 12, 36]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.65} />
        </mesh>
      </group>
    </group>
  );
}

// ===========================================================================
// 9. CLANKER: 3D Brushed Titanium Retro-Futuristic AI Terminal
// ===========================================================================
function ClankerRobot() {
  const group = useRef(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.85 + 9) * 0.24;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + 9) * 0.035;
  });

  return (
    <group ref={group}>
      {/* Brushed Titanium Head Chassis */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.34, 0.32, 0.28]} />
        <meshPhysicalMaterial {...MAT_SLATE} />
      </mesh>

      {/* Curved CRT Glass Monitor */}
      <mesh position={[0, 0.02, 0.145]}>
        <boxGeometry args={[0.26, 0.18, 0.02]} />
        <meshPhysicalMaterial
          color="#064E3B"
          emissive="#059669"
          emissiveIntensity={0.4}
          roughness={0.1}
          clearcoat={1.0}
        />
      </mesh>

      {/* Phosphor Green AI Eyes `(● ‿ ●)` */}
      <mesh position={[-0.065, 0.03, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.01, 16]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>
      <mesh position={[0.065, 0.03, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.01, 16]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>

      {/* Telemetry Antennae with Signal Orbs */}
      <mesh position={[-0.10, 0.22, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
        <meshPhysicalMaterial {...MAT_CHROME} />
      </mesh>
      <mesh position={[-0.10, 0.30, 0]}>
        <sphereGeometry args={[0.026, 16, 16]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>
      <mesh position={[0.10, 0.22, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
        <meshPhysicalMaterial {...MAT_CHROME} />
      </mesh>
      <mesh position={[0.10, 0.30, 0]}>
        <sphereGeometry args={[0.026, 16, 16]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>

      {/* Brass Audio Ear Knobs */}
      <mesh position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.03, 24]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.03, 24]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
    </group>
  );
}

// ===========================================================================
// 10. FOURMEME: 3D 24k Gold Lucky Quad-Amulet & Inset Emerald Gems
// ===========================================================================
function FourMemeEmblem() {
  const group = useRef(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.9 + 10) * 0.22;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + 10) * 0.035;
  });

  return (
    <group ref={group}>
      {/* 24k Polished Gold Numeral '4' Frame */}
      <mesh position={[0.05, 0, 0]}>
        <boxGeometry args={[0.065, 0.38, 0.06]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      <mesh position={[-0.07, 0.08, 0]} rotation={[0, 0, 0.65]}>
        <boxGeometry args={[0.06, 0.24, 0.06]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
      <mesh position={[-0.04, -0.04, 0]}>
        <boxGeometry args={[0.26, 0.06, 0.06]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* Four Faceted Inset Emerald Jewels */}
      {[
        [-0.14, -0.04],
        [0.05, 0.20],
        [0.14, -0.04],
        [0.05, -0.20],
      ].map(([px, py], i) => (
        <mesh key={i} position={[px, py, 0.03]}>
          <octahedronGeometry args={[0.036, 0]} />
          <meshPhysicalMaterial {...MAT_EMERALD} emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ===========================================================================
// 11. FLAP: 3D Supersonic Articulated Delta Wings & Turbine Core
// ===========================================================================
function FlapCyberWings() {
  const group = useRef(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.9 + 11) * 0.22;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + 11) * 0.035;
  });

  return (
    <group ref={group}>
      {/* Central Mach Scramjet Turbine Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.035, 16, 32]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} />
      </mesh>

      {/* Plasma Thruster Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>

      {/* Left Delta Wing Blades */}
      <mesh position={[-0.20, 0.08, 0]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.22, 0.05, 0.03]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} />
      </mesh>
      <mesh position={[-0.24, 0.01, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.26, 0.045, 0.03]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>

      {/* Right Delta Wing Blades */}
      <mesh position={[0.20, 0.08, 0]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[0.22, 0.05, 0.03]} />
        <meshPhysicalMaterial {...MAT_TITANIUM} />
      </mesh>
      <mesh position={[0.24, 0.01, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.26, 0.045, 0.03]} />
        <meshPhysicalMaterial {...MAT_GOLD} />
      </mesh>
    </group>
  );
}

// ===========================================================================
// 12-VENUE HERO CAROUSEL RIG
// Hero spotlight architecture: The focused venue is prominently centered at full scale.
// The other venues orbit at a clean wider radius with gentle depth fade.
// ===========================================================================
const VENUE_ACCENTS = [
  "#22C55E", // 0. Pump.fun (Mint)
  "#F59E0B", // 1. Meteora (Aerospace Gold)
  "#38BDF8", // 2. Raydium (Electric Cyan)
  "#F59E0B", // 3. Bags (Bullion Gold & Canvas)
  "#F59E0B", // 4. LetsBonk (Bonk Gold)
  "#22C55E", // 5. StonkFun (Stonks Green)
  "#22C55E", // 6. Printr (Mint)
  "#38BDF8", // 7. Anoncoin (Cyan)
  "#38BDF8", // 8. Surge (Plasma Cyan)
  "#22C55E", // 9. Clanker (Phosphor Green)
  "#F59E0B", // 10. FourMeme (Gold)
  "#38BDF8", // 11. Flap (Shield Cyan)
];

const TOTAL_VENUES = 12;

function VenueModel({ index }) {
  switch (index) {
    case 0: return <PumpFunPill />;
    case 1: return <MeteoraMeteor />;
    case 2: return <RaydiumCrystal />;
    case 3: return <BagsMoneyBag />;
    case 4: return <LetsBonkHammer />;
    case 5: return <StonkFunRocket />;
    case 6: return <PrintrMachine />;
    case 7: return <AnoncoinMask />;
    case 8: return <SurgeLightning />;
    case 9: return <ClankerRobot />;
    case 10: return <FourMemeEmblem />;
    case 11: return <FlapCyberWings />;
    default: return <PumpFunPill />;
  }
}

function Rig({ focus }) {
  const group = useRef(null);
  const target = useRef(0);
  const { low } = usePerf();

  useEffect(() => {
    target.current = -focus * ((Math.PI * 2) / TOTAL_VENUES);
  }, [focus]);

  useFrame((state) => {
    const node = group.current;
    if (!node) return;
    node.rotation.y += (target.current - node.rotation.y) * 0.12;
    node.rotation.x = state.pointer.y * 0.08;
    if (low) state.invalidate();
  });

  return (
    <group ref={group}>
      {/* Aerospace Turntable Stage Floor */}
      <mesh position={[0, -0.40, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.4, 64]} />
        <meshStandardMaterial
          color="#0B0F17"
          roughness={0.65}
          metalness={0.35}
        />
      </mesh>
      {/* Subtle Orbital Guide Track */}
      <mesh position={[0, -0.395, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.36, 2.40, 64]} />
        <meshBasicMaterial color="#1E293B" transparent opacity={0.5} />
      </mesh>

      {Array.from({ length: TOTAL_VENUES }).map((_, index) => {
        const angle = (index / TOTAL_VENUES) * Math.PI * 2;
        // Generous, wide gallery radius so models never crowd or collide
        const radius = 2.4;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const accent = VENUE_ACCENTS[index];
        const isFocused = index === focus;

        return (
          <group
            key={index}
            position={[x, 0, z]}
            // Crucial: Rotate each model around Y so its front face ALWAYS faces outward toward the camera!
            rotation={[0, angle, 0]}
          >
            <group scale={isFocused ? 1.0 : 0.54}>
              <VenueModel index={index} />
            </group>

            {/* Glowing Studio Turntable Ring under each model */}
            <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.22, 0.28, 32]} />
              <meshBasicMaterial
                color={accent}
                transparent
                opacity={isFocused ? 0.95 : 0.15}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function VenueScene({ onReady, focus = 0 }) {
  const { low } = usePerf();

  return (
    <Canvas
      dpr={low ? 1 : [1, 1.5]}
      frameloop={low ? "demand" : "always"}
      gl={{
        antialias: !low,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0.52, 4.0], fov: 36 }}
      onCreated={({ gl, scene, invalidate }) => {
        gl.setClearColor("#08090C", 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;

        // Apply realistic neutral studio lighting environment map via RoomEnvironment
        const pmrem = new THREE.PMREMGenerator(gl);
        pmrem.compileEquirectangularShader();
        const room = new RoomEnvironment();
        scene.environment = pmrem.fromScene(room, 0.04).texture;

        onReady?.();
        invalidate();
      }}
    >
      {/* Studio 3-Point Lighting Setup */}
      <ambientLight intensity={0.55} />
      {/* Key Light: Crisp warm directional spotlight from top-right */}
      <directionalLight position={[4, 5, 4]} intensity={2.6} color="#FFFDF7" />
      {/* Fill Light: Cool slate fill from top-left */}
      <directionalLight position={[-4, 2, 1]} intensity={0.8} color="#94A3B8" />
      {/* Rim / Silhouette Light: Crisp edge backlight */}
      <spotLight position={[0, 4, -3]} intensity={2.6} color="#22C55E" angle={0.8} />

      <Rig focus={focus} />
    </Canvas>
  );
}
