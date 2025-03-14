"use client";
import Panel from "@/components/panel";
import CanvasDots from "@/components/canvasDots";
import AnimationText from "@/components/circularText";

import { motion } from "motion/react";
import { useRef } from "react";
export default function Home() {
  const dragContainer = useRef(null);
  return (
    <main
      ref={dragContainer}
      className="relative w-screen h-screen overflow-clip font-[family-name:var(--font-dm-serif-text)] italic"
    >
      <Panel />
      <main className="w-full h-full flex justify-center items-center">
        <CanvasDots />
        <motion.div
          drag={true}
          dragMomentum={false}
          dragConstraints={dragContainer}
          whileTap={{ scale: 0.9 }}
          className="rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
          transition={{ duration: 1 }}
        >
          <AnimationText
            text="DT IN THE HOUSE !"
            onHover="speedUp"
            spinDuration={100}
            className="w-100! h-100! text-5xl rounded-full"
          />
        </motion.div>
      </main>
    </main>
  );
}
