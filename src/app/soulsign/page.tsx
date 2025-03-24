"use client";
import CanvasDots from "@/components/ui/canvasDots";
import CircularText from "@/components/ui/widgets/circularText";
import FullScreen from "@/components/ui/fullScreen";
import { EditWrapper } from "@/components/ui/widgets/editableWrapper";
import { useRef } from "react";
export default function Home() {
  const dragContainer = useRef(null);
  return (
    <main
      ref={dragContainer}
      className="relative w-screen h-screen overflow-clip font-[family-name:var(--font-dm-serif-text)] italic"
    >
      {/* <VerticalScreenMask></VerticalScreenMask> */}
      <main className="w-full h-full flex justify-center items-center">
        <CanvasDots />
        <EditWrapper elementRef={dragContainer}>
          <CircularText
            text="DT IN THE HOUSE !"
            onHover="speedUp"
            spinDuration={100}
            className="h-60! w-60! text-5xl rounded-full"
          />
        </EditWrapper>
        <FullScreen  className="fixed top-4 right-4"/>
      </main>
    </main>
  );
}
