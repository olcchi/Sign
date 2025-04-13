import {Maximize,Minimize } from "lucide-react";
import { useFullScreenStore } from "@/stores/fullScreenStore";
import { cn } from "@/lib/utils";
export default function FullScreen({ className }: { className?: string }) {
  const { isFull, setIsFull } = useFullScreenStore();

  const toggleFullscreen = () => {
    if (isFull) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFull(!isFull);
  };

  return (
    <div className={cn("z-998",className)}>
      {isFull ? (
        <Minimize onClick={toggleFullscreen} color="white" />
      ) : (
        <Maximize onClick={toggleFullscreen} color="white" />
      )}
    </div>
  );
}