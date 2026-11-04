import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { usePerf } from "../perf/PerfProvider.jsx";

function Field() {
  const points = useRef(null);
  const { low } = usePerf();
  const count = low ? 140 : 520;
  const base = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 4.2;
      values[index * 3 + 1] = (Math.random() - 0.5) * 2.4;
      values[index * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    return values;
  }, [count]);
  const seeded = useMemo(() => new Float32Array(base), [base]);

  useFrame((state) => {
    const geometry = points.current?.geometry;
    if (!geometry) return;
    const positions = geometry.attributes.position;
    const pointerX = state.pointer.x * 2;
    const pointerY = state.pointer.y * 1.2;
    for (let index = 0; index < count; index += 1) {
      const ox = base[index * 3];
      const oy = base[index * 3 + 1];
      const dx = pointerX - ox;
      const dy = pointerY - oy;
      const pull = low ? 0 : 0.08 / (1 + dx * dx + dy * dy);
      positions.setX(index, ox + dx * pull);
      positions.setY(index, oy + dy * pull);
    }
    positions.needsUpdate = true;
    if (low) state.invalidate();
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seeded, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#FF3E00" size={low ? 0.03 : 0.02} sizeAttenuation />
    </points>
  );
}

export default function ShockScene({ onReady }) {
  const { low } = usePerf();
  return (
    <Canvas
      dpr={low ? 1 : [1, 1.25]}
      frameloop={low ? "demand" : "always"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 2.6], fov: 50 }}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor("#08090C", 1);
        onReady?.();
        invalidate();
      }}
    >
      <Field />
    </Canvas>
  );
}
