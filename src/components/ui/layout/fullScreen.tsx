import { Maximize, Minimize } from "lucide-react";
import { useFullScreenStore } from "@/stores/fullScreenStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/layout/button";
import { useEffect, useState } from "react";

interface FullScreenProps {
  className?: string;
  asButton?: boolean;
}

export default function FullScreen({ className, asButton = false }: FullScreenProps) {
  const { isFull, setIsFull } = useFullScreenStore();
  const [isActive, setIsActive] = useState(true);
  
  // Handle user interaction and inactive state
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    // User interaction event listener
    const handleUserInteraction = () => {
      setIsActive(true);
      
      // Clear existing timer
      clearTimeout(timeoutId);
      
      // Set new timer, reduce opacity after 3 seconds
      timeoutId = setTimeout(() => {
        setIsActive(false);
      }, 3000);
    };
    
    // Initial startup
    handleUserInteraction();
    
    // Add event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction);
    });
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  const toggleFullscreen = () => {
    if (isFull) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen failed:", err);
      });
    }
    setIsFull(!isFull);
  };

  const icon = isFull ? (
    <Minimize size={20} color="white" />
  ) : (
    <Maximize size={20} color="white" />
  );

  return (
    <div 
      className={cn(
        "transition-opacity duration-300", 
        isActive ? "opacity-100" : "opacity-10 hover:opacity-100",
        className
      )}
    >
      {asButton ? (
        <Button
          variant="ghost"
          onClick={toggleFullscreen}
          className="hover:bg-[#080808] "
          aria-label={isFull ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {icon}
        </Button>
      ) : (
        <div onClick={toggleFullscreen}>{icon}</div>
      )}
    </div>
  );
}