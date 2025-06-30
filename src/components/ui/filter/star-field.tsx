"use client";

import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { useSettings } from "@/lib/contexts/settings-context";

interface Star {
  x: number;
  y: number;
  opacity: number;
  fadeDirection: number; // 1 for fade in, -1 for fade out
  fadeSpeed: number;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const activeStarsRef = useRef<Star[]>([]);
  const dormantStarsRef = useRef<Star[]>([]);
  const { effectsSettings } = useSettings();

  // Performance optimization related refs
  const lastFrameTime = useRef(0);
  const needsRedraw = useRef(false);
  const frameInterval = useRef(1000 / 30); // 30fps

  const {
    starFieldEnabled,
    starFieldDensity,
    starFieldColor,
    starFieldSize,
    starFieldTwinkleSpeed,
  } = effectsSettings;

  // Memoize RGB conversion to avoid repeated calculations
  const starRgb = useMemo(() => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      starFieldColor
    );
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 255 };
  }, [starFieldColor]);

  // Memoize gradient colors to avoid string concatenation in render loop
  const glowColors = useMemo(
    () => ({
      center: `rgba(${starRgb.r}, ${starRgb.g}, ${starRgb.b}, 0.2)`,
      mid: `rgba(${starRgb.r}, ${starRgb.g}, ${starRgb.b}, 0.1)`,
    }),
    [starRgb]
  );

  // Create a new star with random properties
  const createStar = useCallback((): Star => {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      opacity: 0,
      fadeDirection: 1,
      fadeSpeed: (Math.random() * 0.5 + 0.1) * starFieldTwinkleSpeed,
    };
  }, [starFieldTwinkleSpeed]);

  // Initialize stars based on density
  const initializeStars = useCallback(() => {
    const area = window.innerWidth * window.innerHeight;
    const baseStarCount = Math.floor(area * starFieldDensity * 0.00005);
    const starCount = Math.min(baseStarCount, 1000);

    // Clear all pools
    activeStarsRef.current = [];
    dormantStarsRef.current = [];

    // Create stars and distribute them
    const stars = Array.from({ length: starCount }, createStar);

    stars.forEach((star) => {
      if (Math.random() > 0.7) {
        // 30% of stars start active
        star.fadeDirection = Math.random() > 0.5 ? 1 : -1;
        star.opacity = Math.random();
        activeStarsRef.current.push(star);
      } else {
        dormantStarsRef.current.push(star);
      }
    });

    needsRedraw.current = true;
  }, [starFieldDensity, createStar]);

  // Draw star shape using optimized Canvas path operations
  const drawStarShape = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const radius = size / 2;
      const innerRadius = radius * 0.4;

      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.moveTo(0, -radius);
      ctx.lineTo(innerRadius * 0.3, -innerRadius * 0.3);
      ctx.lineTo(radius, 0);
      ctx.lineTo(innerRadius * 0.3, innerRadius * 0.3);
      ctx.lineTo(0, radius);
      ctx.lineTo(-innerRadius * 0.3, innerRadius * 0.3);
      ctx.lineTo(-radius, 0);
      ctx.lineTo(-innerRadius * 0.3, -innerRadius * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    []
  );

  // Render stars with circular glow effect
  const renderStars = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!needsRedraw.current) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      activeStarsRef.current.forEach((star) => {
        ctx.save();
        ctx.globalAlpha = star.opacity;

        // Create circular glow effect using radial gradient
        const glowRadius = starFieldSize * 2;
        const gradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          glowRadius
        );

        // Use memoized colors
        gradient.addColorStop(0, glowColors.center);
        gradient.addColorStop(0.2, glowColors.mid);
        gradient.addColorStop(1, "transparent");

        // Draw circular glow
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw star shape on top
        ctx.fillStyle = starFieldColor;
        drawStarShape(ctx, star.x, star.y, starFieldSize);

        ctx.restore();
      });

      needsRedraw.current = false;
    },
    [starFieldColor, starFieldSize, glowColors, drawStarShape]
  );

  // Update star animations
  const updateStars = useCallback(() => {
    let hasChanges = false;

    // Process active stars
    for (let i = activeStarsRef.current.length - 1; i >= 0; i--) {
      const star = activeStarsRef.current[i];

      // Update opacity
      star.opacity += star.fadeDirection * star.fadeSpeed * 0.033;

      // Handle fade transitions
      if (star.opacity >= 1) {
        star.opacity = 1;
        star.fadeDirection = -1;
        hasChanges = true;
      } else if (star.opacity <= 0) {
        star.opacity = 0;
        // Move star to dormant pool
        activeStarsRef.current.splice(i, 1);
        dormantStarsRef.current.push(star);
        hasChanges = true;
      } else {
        hasChanges = true;
      }
    }

    // Maintain target number of active stars
    const totalStars =
      activeStarsRef.current.length + dormantStarsRef.current.length;
    const targetActiveStars = Math.floor(totalStars * 0.3);
    const currentActiveStars = activeStarsRef.current.length;

    if (
      currentActiveStars < targetActiveStars &&
      dormantStarsRef.current.length > 0
    ) {
      const starsToActivate = Math.min(
        targetActiveStars - currentActiveStars,
        dormantStarsRef.current.length,
        2
      );

      for (let i = 0; i < starsToActivate; i++) {
        const randomIndex = Math.floor(
          Math.random() * dormantStarsRef.current.length
        );
        const star = dormantStarsRef.current.splice(randomIndex, 1)[0];

        // Reset star properties
        star.fadeDirection = 1;
        star.fadeSpeed = (Math.random() * 0.5 + 0.1) * starFieldTwinkleSpeed;
        star.opacity = 0;

        // 30% chance to reposition
        if (Math.random() < 0.3) {
          star.x = Math.random() * window.innerWidth;
          star.y = Math.random() * window.innerHeight;
        }

        activeStarsRef.current.push(star);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      needsRedraw.current = true;
    }
  }, [starFieldTwinkleSpeed]);

  // Animation loop with frame rate control
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const now = Date.now();
    const elapsed = now - lastFrameTime.current;

    if (elapsed < frameInterval.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    lastFrameTime.current = now;
    updateStars();

    if (needsRedraw.current) {
      renderStars(ctx);
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateStars, renderStars]);

  // Handle canvas resize with DPI scaling
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    initializeStars();
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

    lastFrameTime.current = Date.now();
    needsRedraw.current = true;

    resizeCanvas();
    animate();

    const handleResize = () => resizeCanvas();
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
    initializeStars();
  }, [starFieldDensity, starFieldSize, starFieldTwinkleSpeed, initializeStars]);

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
