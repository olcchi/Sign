"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useSettings } from "@/lib/contexts/settings-context";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  fadeDirection: number; // 1 for fade in, -1 for fade out
  fadeSpeed: number;
  color: string;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const starsRef = useRef<Star[]>([]);
  const { effectsSettings } = useSettings();

  const {
    starFieldEnabled,
    starFieldDensity,
    starFieldColor,
    starFieldSize,
    starFieldTwinkleSpeed,
  } = effectsSettings;

  // Convert hex color to RGB for glow effect
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 255 };
  }, []);

  // Create a new star with random properties
  const createStar = useCallback(
    (canvas: HTMLCanvasElement): Star => {
      const rgb = hexToRgb(starFieldColor);
      // Use display dimensions for star positioning
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      return {
        x: Math.random() * displayWidth,
        y: Math.random() * displayHeight,
        size: starFieldSize,
        opacity: 0,
        fadeDirection: 1,
        fadeSpeed: (Math.random() * 0.5 + 0.1) * starFieldTwinkleSpeed,
        color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      };
    },
    [starFieldColor, starFieldSize, starFieldTwinkleSpeed, hexToRgb]
  );

  // Initialize stars based on density
  const initializeStars = useCallback(
    (canvas: HTMLCanvasElement) => {
      // Use display dimensions for star count calculation, not scaled canvas dimensions
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      const area = displayWidth * displayHeight;
      // Restore original density for richer star field
      const baseStarCount = Math.floor(area * starFieldDensity * 0.00005);
      const starCount = Math.min(baseStarCount, 300); // Increased limit for better visual effect
      starsRef.current = [];

      for (let i = 0; i < starCount; i++) {
        const star = createStar(canvas);
        // Randomly set initial fade direction and opacity
        star.fadeDirection = Math.random() > 0.5 ? 1 : -1;
        star.opacity = Math.random();
        starsRef.current.push(star);
      }
    },
    [starFieldDensity, createStar]
  );

  // Render stars with glow effect
  const renderStars = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            starsRef.current.forEach((star) => {
        if (star.opacity <= 0) return;

        // Outer glow layer
        ctx.save();
        ctx.globalAlpha = star.opacity * 0.6;
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = star.size * 8; // Large glow radius
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillRect(
          star.x - star.size / 2,
          star.y - star.size / 2,
          star.size,
          star.size
        );
        ctx.restore();

        // Main star with medium glow
        ctx.save();
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = star.size * 4; // Medium glow radius
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillRect(
          star.x - star.size / 2,
          star.y - star.size / 2,
          star.size,
          star.size
        );
        ctx.restore();
      });
    },
    [starFieldColor, hexToRgb]
  );

  // Update star animations
  const updateStars = useCallback(
    (canvas: HTMLCanvasElement) => {
      starsRef.current.forEach((star, index) => {
        // Update opacity based on fade direction
        star.opacity += star.fadeDirection * star.fadeSpeed * 0.016; // Assuming 60fps

        // Handle fade transitions
        if (star.opacity >= 1) {
          star.opacity = 1;
          star.fadeDirection = -1;
        } else if (star.opacity <= 0) {
          star.opacity = 0;
          // Randomly decide to start fading in again or stay hidden
          if (Math.random() < 0.005) {
            // 0.5% chance per frame to start fading in
            star.fadeDirection = 1;
            star.fadeSpeed =
              (Math.random() * 0.5 + 0.1) * starFieldTwinkleSpeed;
            // Randomly reposition the star for variety
            if (Math.random() < 0.3) {
              star.x = Math.random() * window.innerWidth;
              star.y = Math.random() * window.innerHeight;
            }
          }
        }
      });
    },
    [starFieldTwinkleSpeed]
  );

    // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    updateStars(canvas);
    renderStars(ctx);

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateStars, renderStars]);

  // Handle canvas resize with DPI scaling (performance optimized)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Limit DPI to maximum 2x for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    // Set the actual size in memory (scaled by limited DPI)
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    // Scale the canvas back down using CSS
    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";

    // Scale the drawing context so everything draws at the correct size
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    initializeStars(canvas);
  }, [initializeStars]);

  useEffect(() => {
    if (!starFieldEnabled) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [starFieldEnabled, resizeCanvas, animate]);

  // Re-initialize stars when settings change
  useEffect(() => {
    if (!starFieldEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    initializeStars(canvas);
  }, [
    starFieldDensity,
    starFieldColor,
    starFieldSize,
    starFieldTwinkleSpeed,
    initializeStars,
  ]);

  if (!starFieldEnabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
