import { Expand, Shrink } from "lucide-react";
import { useFullScreenStore } from "@/components/stores/fullScreenStore";
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
        <Shrink onClick={toggleFullscreen} color="white" />
      ) : (
        <Expand onClick={toggleFullscreen} color="white" />
      )}
    </div>
  );
}