"use client";
import CanvasDots from "@/components/ui/canvasDots";
import FullScreen from "@/components/ui/fullScreen";
import VerticalScreenMask from "@/components/ui/usageHelpMask/usageHelpMask";
import { TextLoop } from "@/components/ui/textLoop";
import { useRef } from "react";
export default function Home() {
  const loopTextVariants = {
    initial: {
      y: 20,
      rotateX: 90,
      opacity: 0,
      filter: "blur(8px)",
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
      filter: "blur(8px)",
    },
  };
  const dragContainer = useRef(null);
  return (
    <main
      ref={dragContainer}
      className="relative w-screen h-[100dvh] overflow-clip flex justify-center items-center bg-black"
    >
      <section className="flex flex-col gap-4 justify-center w-fit p-2 border-2 rounded-sm">
        <div className=" whitespace-normal">
          <span>
          Hi!,这里是
          </span>
        <TextLoop
          interval={5}
          trigger={true}
          variants={loopTextVariants}
          className="pr-2 pl-2 text-md text-white pointer-events-none select-none font-[family-name:var(--font-dm-serif-text)]"
        >
          <span>Soul Sign</span>
          <span>喆式应援</span>
        </TextLoop>
        <span>一款DT迷制作的电子应援牌</span> 
        </div>
      <section>
        - 为确保使用体验,请在进入前:
      </section>
      </section>
    </main>
  );
}
