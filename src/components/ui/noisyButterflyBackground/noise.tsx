"use client";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NoiseProps {
  opacity?: number;
  density?: number;
  dotSize?: number;
  className?: string;
  color?: string;
  zIndex?: number;
}

// debounce function
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export default function Noise({
  opacity = 0.5,
  density = 0.5,
  dotSize = 1,
  className,
  color = "#000000",
  zIndex = 20,
}: NoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // improve performance by reducing device pixel ratio
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    
    const updateCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const drawNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      // improve performance by reducing sampling frequency
      const sampleRate = 2; // sample every 2 pixels
      
      for (let i = 0; i < data.length; i += (4 * sampleRate)) {
        if (Math.random() < density) {
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

    // use debounce to handle resize event, reduce re-render times
    const debouncedResize = debounce(() => {
      updateCanvas();
      drawNoise();
    }, 200);

    // init render
    updateCanvas();
    drawNoise();
    
    window.addEventListener("resize", debouncedResize);
    
    return () => window.removeEventListener("resize", debouncedResize);
  }, [opacity, density, dotSize, color]);

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