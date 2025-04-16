"use client";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NoiseProps {
  opacity?: number;
  density?: number;
  dotSize?: number;
  className?: string;
  color?: string;
}

export default function Noise({
  opacity = 0.5,
  density = 0.5,
  dotSize = 1,
  className,
  color = "#000000",
}: NoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio;
    
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
      
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < density) {
          data[i] = r;     // R
          data[i + 1] = g; // G
          data[i + 2] = b; // B
          data[i + 3] = opacity * 255; // A
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    };

    const handleResize = () => {
      updateCanvas();
      drawNoise();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
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