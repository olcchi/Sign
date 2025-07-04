"use client";

import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

interface Star {
  x: number;
  y: number;
  opacity: number;
  fadeDirection: number; // 1 for fade in, -1 for fade out
  fadeSpeed: number;
}

interface StarFieldProps {
  enabled?: boolean;
  density?: number;
  color?: string;
  size?: number;
  twinkleSpeed?: number;
  className?: string;
}

export function StarField({
  enabled = false,
  density = 0.5,
  color = "#FFFFFB",
  size = 2,
  twinkleSpeed = 1.0,
  className,
}: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const activeStarsRef = useRef<Star[]>([]);
  const dormantStarsRef = useRef<Star[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Performance optimization related refs
  const lastFrameTime = useRef(0);
  const needsRedraw = useRef(false);
  const frameInterval = useRef(1000 / 30); // 30fps

  // Memoize RGB conversion to avoid repeated calculations
  const starRgb = useMemo(() => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 255 };
  }, [color]);

  // Memoize gradient colors to avoid string concatenation in render loop
  const glowColors = useMemo(
    () => ({
      center: `rgba(${starRgb.r}, ${starRgb.g}, ${starRgb.b}, 0.2)`,
      mid: `rgba(${starRgb.r}, ${starRgb.g}, ${starRgb.b}, 0.1)`,
    }),
    [starRgb]
  );

  // Get container dimensions for star positioning
  const getContainerDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }
    // Fallback to a default size if container is not available
    return { width: 800, height: 600 };
  }, []);

  // Create a new star with random properties
  const createStar = useCallback((): Star => {
    const { width, height } = getContainerDimensions();
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      opacity: 0,
      fadeDirection: 1,
      fadeSpeed: (Math.random() * 0.5 + 0.1) * twinkleSpeed,
    };
  }, [twinkleSpeed, getContainerDimensions]);

  // Initialize stars based on density
  const initializeStars = useCallback(() => {
    const { width, height } = getContainerDimensions();
    const area = width * height;
    const baseStarCount = Math.floor(area * density * 0.00005);
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
  }, [density, createStar, getContainerDimensions]);

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

      const { width, height } = getContainerDimensions();
      ctx.clearRect(0, 0, width, height);

      activeStarsRef.current.forEach((star) => {
        ctx.save();
        ctx.globalAlpha = star.opacity;

        // Create circular glow effect using radial gradient
        const glowRadius = size * 2;
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
        ctx.fillStyle = color;
        drawStarShape(ctx, star.x, star.y, size);

        ctx.restore();
      });

      needsRedraw.current = false;
    },
    [color, size, glowColors, drawStarShape, getContainerDimensions]
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
        star.fadeSpeed = (Math.random() * 0.5 + 0.1) * twinkleSpeed;
        star.opacity = 0;

        // 30% chance to reposition
        if (Math.random() < 0.3) {
          const { width, height } = getContainerDimensions();
          star.x = Math.random() * width;
          star.y = Math.random() * height;
        }

        activeStarsRef.current.push(star);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      needsRedraw.current = true;
    }
  }, [twinkleSpeed, getContainerDimensions]);

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
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;

    // Ensure canvas has minimum dimensions
    const minWidth = Math.max(displayWidth, 1);
    const minHeight = Math.max(displayHeight, 1);

    canvas.width = minWidth * dpr;
    canvas.height = minHeight * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    initializeStars();
  }, [initializeStars]);

  useEffect(() => {
    if (!enabled) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    lastFrameTime.current = Date.now();
    needsRedraw.current = true;

    resizeCanvas();
    animate();

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);

    // Use ResizeObserver for better container size tracking
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      resizeObserver.observe(container);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, resizeCanvas, animate]);

  // Re-initialize stars when settings change
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    initializeStars();
  }, [density, size, twinkleSpeed, initializeStars]);

  if (!enabled) {
    return null;
  }

  return (
    <div ref={containerRef} className={cn("w-full h-full pointer-events-none", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ display: "block" }}
      />
    </div>
  );
}
