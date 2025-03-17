import { Expand, Shrink } from "lucide-react";
import { motion } from "motion/react";
import { useFullScreenStore } from "@/components/stores/fullScreenStore";

export default function FullScreen() {
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
    <div className="fixed top-2 right-2 z-999">
      {isFull ? (
        <Shrink onClick={toggleFullscreen} color="white" />
      ) : (
        <Expand onClick={toggleFullscreen} color="white" />
      )}
    </div>
  );
}