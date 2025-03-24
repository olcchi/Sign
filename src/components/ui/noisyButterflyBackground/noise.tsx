"use client";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NoiseProps {
  opacity?: number;
  density?: number;
  dotSize?: number;
  className?: string;
}

export default function Noise({
  opacity = 0.5,
  density = 0.5,
  dotSize = 1,
  className,
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
      
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < density) {
          const value = Math.random() * 255;
          data[i] = value;     // R
          data[i + 1] = value; // G
          data[i + 2] = value; // B
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
  }, [opacity, density, dotSize]);

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