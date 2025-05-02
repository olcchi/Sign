import { Maximize, Minimize } from "lucide-react";
import { useFullScreenStore } from "@/stores/fullScreenStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";

interface FullScreenProps {
  className?: string;
  asButton?: boolean;
}

export default function FullScreen({ className, asButton = false }: FullScreenProps) {
  const { isFull, setIsFull } = useFullScreenStore();

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
    <div className={cn("z-998", className)}>
      {asButton ? (
        <Button
          size="icon"
          onClick={toggleFullscreen}
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