import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Vector2 } from "three";
import { usePerf } from "../perf/PerfProvider.jsx";

const vertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uLive;
  void main() {
    vec2 uv = vUv;
    float wake = sin((uv.x * 6.0) + uTime * 0.35 + uPointer.x);
    float band = abs(uv.y - 0.55 - wake * 0.08 - (uPointer.y - 0.5) * 0.12);
    float ribbon = smoothstep(0.08, 0.0, band);
    float ember = smoothstep(0.22, 0.0, band);
    vec3 base = vec3(0.031, 0.035, 0.047);
    vec3 plasma = vec3(1.0, 0.243, 0.0);
    vec3 flare = vec3(1.0, 0.467, 0.0);
    vec3 color = base + flare * ember * 0.35 + plasma * ribbon;
    float grain = fract(sin(dot(uv, vec2(12.9, 78.2)) + uTime) * 43758.5);
    color += (grain - 0.5) * 0.03 * uLive;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function Sheet() {
  const material = useRef(null);
  const { low } = usePerf();
  useFrame((state, delta) => {
    const uniforms = material.current?.uniforms;
    if (!uniforms) return;
    if (!low) uniforms.uTime.value += delta;
    uniforms.uPointer.value.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
    uniforms.uLive.value = low ? 0 : 1;
    if (low) state.invalidate();
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={{
          uTime: { value: 0 },
          uPointer: { value: new Vector2(0.5, 0.5) },
          uLive: { value: low ? 0 : 1 },
        }}
      />
    </mesh>
  );
}

export default function RibbonScene({ onReady }) {
  const { low } = usePerf();
  return (
    <Canvas
      dpr={low ? 1 : [1, 1.25]}
      frameloop={low ? "demand" : "always"}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ invalidate }) => {
        onReady?.();
        invalidate();
      }}
    >
      <Sheet />
    </Canvas>
  );
}
