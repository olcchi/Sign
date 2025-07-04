"use client";
import { useState, useEffect } from "react";

interface ViewportMonitorProps {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showHeight?: boolean;
}

export default function ViewportMonitor({ 
  className = "", 
  position = "bottom-left",
  showHeight = false 
}: ViewportMonitorProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Initialize dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    // Update dimensions on resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Position classes mapping
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4"
  };

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-[999999999] bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg font-mono text-sm border border-white/20 ${className}`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-blue-300">W:</span>
          <span className="font-bold">{dimensions.width}px</span>
        </div>
        {showHeight && (
          <div className="flex items-center gap-2">
            <span className="text-green-300">H:</span>
            <span className="font-bold">{dimensions.height}px</span>
          </div>
        )}
      </div>
    </div>
  );
} 