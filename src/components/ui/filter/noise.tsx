"use client";
import { useRef, useEffect } from "react";
import { cn, debounce } from "@/lib/utils";

interface NoiseProps {
  opacity?: number;
  density?: number;
  dotSize?: number;
  className?: string;
  color?: string;
  zIndex?: number;
  animated?: boolean;
}

// Renders a customizable noise texture using canvas for visual interest and texture
export default function Noise({
  opacity = 0.5,
  density = 0.5,
  dotSize = 1,
  className,
  color = "#000000",
  zIndex = 20,
  animated = false,
}: NoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limit pixel ratio for better performance on high-DPI displays
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    
    // Set canvas dimensions to match window size with proper scaling
    const updateCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    // Generate random noise pattern with configurable properties
    const drawNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      // Parse color string to RGB components
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      // Optimize by sampling fewer pixels at regular intervals
      const sampleRate = 2; // sample every 2 pixels
      
      for (let i = 0; i < data.length; i += (4 * sampleRate)) {
        // Randomly determine if this pixel should be visible based on density
        if (Math.random() < density) {
          // Fill adjacent pixels with the same color for the chosen sample rate
          for (let j = 0; j < sampleRate && (i + j * 4) < data.length; j++) {
            const idx = i + (j * 4);
            data[idx] = r;     // R
            data[idx + 1] = g; // G
            data[idx + 2] = b; // B
            data[idx + 3] = opacity * 255; // A
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    };

    // Handle window resize with performance optimization
    const debouncedResize = debounce(() => {
      updateCanvas();
      drawNoise();
    }, 200);

    let animationId: number;
    let lastFrameTime = 0;
    const targetFPS = 15;
    const frameInterval = 1000 / targetFPS; // ~66.67ms per frame

    const animate = (currentTime: number) => {
      if (currentTime - lastFrameTime >= frameInterval) {
        drawNoise();
        lastFrameTime = currentTime;
      }
      
      if (animated) {
        animationId = requestAnimationFrame(animate);
      }
    };

    // Initial setup
    updateCanvas();
    
    if (animated) {
      // Start animation loop
      animationId = requestAnimationFrame(animate);
    } else {
      // Static noise - render once
      drawNoise();
    }
    
    window.addEventListener("resize", debouncedResize);
    
    return () => {
      window.removeEventListener("resize", debouncedResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [opacity, density, dotSize, color, animated]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "fixed inset-0 w-full h-full pointer-events-none",
        className
      )}
    />
  );
}