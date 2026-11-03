"use client";

import React, { useEffect, useRef } from "react";

export function HypersonicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle streaks simulating Mach hypersonic stream
    interface Streak {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      width: number;
      hue: number;
    }

    const STREAK_COUNT = 65;
    const streaks: Streak[] = [];

    for (let i = 0; i < STREAK_COUNT; i++) {
      streaks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 40 + Math.random() * 120,
        speed: 3 + Math.random() * 8,
        opacity: 0.15 + Math.random() * 0.45,
        width: 0.5 + Math.random() * 1.5,
        hue: Math.random() > 0.8 ? 25 : 14, // Orange flare or red plasma
      });
    }

    // Grid dots
    const GRID_SPACING = 48;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      // Ease mouse
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Dark fade trail
      ctx.fillStyle = "rgba(8, 9, 12, 0.35)";
      ctx.fillRect(0, 0, width, height);

      // 1. Subtle Perspective Grid Lines
      ctx.strokeStyle = "rgba(28, 37, 51, 0.35)";
      ctx.lineWidth = 1;

      const cols = Math.ceil(width / GRID_SPACING);
      const rows = Math.ceil(height / GRID_SPACING);

      for (let c = 0; c < cols; c++) {
        const x = c * GRID_SPACING;
        // Dot at intersections
        for (let r = 0; r < rows; r++) {
          const y = r * GRID_SPACING;
          const distToMouse = Math.hypot(x - mouseX, y - mouseY);
          const maxDist = 240;

          if (distToMouse < maxDist) {
            const glow = (1 - distToMouse / maxDist) * 0.45;
            ctx.fillStyle = `rgba(255, 62, 0, ${glow})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = "rgba(28, 37, 51, 0.45)";
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }

      // 2. Hypersonic Streaks (Mach Stream)
      streaks.forEach((s) => {
        s.x -= s.speed * 1.5;
        // Reset when leaving left edge
        if (s.x + s.length < 0) {
          s.x = width + Math.random() * 100;
          s.y = Math.random() * height;
          s.speed = 3 + Math.random() * 8;
        }

        const gradient = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y);
        gradient.addColorStop(0, "rgba(255, 62, 0, 0)");
        gradient.addColorStop(
          0.7,
          s.hue === 25
            ? `rgba(255, 119, 0, ${s.opacity})`
            : `rgba(255, 62, 0, ${s.opacity})`
        );
        gradient.addColorStop(1, `rgba(255, 255, 255, ${s.opacity * 0.8})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = s.width;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.length, s.y);
        ctx.stroke();
      });

      // 3. Central Ambient Radial Glow
      const radial = ctx.createRadialGradient(
        mouseX,
        mouseY,
        10,
        mouseX,
        mouseY,
        500
      );
      radial.addColorStop(0, "rgba(255, 62, 0, 0.08)");
      radial.addColorStop(0.5, "rgba(255, 119, 0, 0.02)");
      radial.addColorStop(1, "rgba(8, 9, 12, 0)");

      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ filter: "contrast(110%)" }}
    />
  );
}
