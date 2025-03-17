`use client`;
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TextLoop } from "@/components/ui/textLoop";
import FullScreen from "@/components/fullScreen";
import { useFullScreenStore } from "@/components/stores/fullScreenStore";
export default function VerticalScreenMask() {
    const [showMask, setShowMask] = useState(false);
    const { isFull } = useFullScreenStore();
  
    useEffect(() => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
        navigator.userAgent
      );
  
      const checkOrientation = () => {
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        setShowMask((isMobile && isPortrait) || !isFull); // 使用 store 中的 isFull
      };
  
      checkOrientation();
      window.addEventListener("resize", checkOrientation);
      return () => window.removeEventListener("resize", checkOrientation);
    }, [isFull]); 

  if (!showMask) return null;
  const loopTextVariants = {
    initial: {
      y: 20,
      rotateX: 90,
      opacity: 0,
      filter: "blur(10px)",
    },
    animate: {
      y: 0,
      rotateX: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: {
      y: -20,
      rotateX: -90,
      opacity: 0,
      filter: "blur(10px)",
    },
  };
  return (
    <motion.div
     className="select-none pointer-events-auto fixed inset-0 w-screen h-screen flex justify-center items-center bg-black/80 z-998 backdrop-blur-lg">
      <FullScreen />
      <TextLoop
        interval={5}
        trigger={true}
        variants={loopTextVariants}
        className="gap-2 flex text-3xl  text-white pointer-events-none select-none"
      >
        <span>Soul Sign</span>
        <span>喆式应援</span>
      </TextLoop>
    </motion.div>
  );
}
