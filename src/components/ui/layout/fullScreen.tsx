import { Maximize, Minimize } from "lucide-react";
import { useFullScreenStore } from "@/stores/fullScreenStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/layout/button";
import { useUserActivityTracking } from "@/lib/hooks/useUserActivityTracking";

interface FullScreenProps {
  className?: string;
  asButton?: boolean;
}

export default function FullScreen({ className, asButton = false }: FullScreenProps) {
  const { isFull, setIsFull } = useFullScreenStore();
  const isActive = useUserActivityTracking(3000);

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
        "activity-opacity", 
        isActive ? "active" : "inactive",
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