"use client";
import CanvasDots from "@/components/ui/canvasDots";
import CircularText from "@/components/ui/widgets/circularText";
import FullScreen from "@/components/ui/fullScreen";
import EnterPageContent from "@/components/ui/SetupGuide/setupGuide";
import { EditWrapper } from "@/components/ui/widgets/editableWrapper/editableWrapper";
import ToolBar from "@/components/ui/toolBar";
import ShinyText from "@/components/ui/shinyText/shinyText";
import '@/components/ui/shinyText/shinyText.css'
import ScrollingText from "@/components/ui/widgets/scrollingText/scrollingText";
import { useRef } from "react";
export default function Home() {
  const dragContainer = useRef(null);
  return (
    <main
      ref={dragContainer}
      className="relative w-screen h-screen overflow-hidden font-[family-name:var(--font-dm-serif-text)] italic"
    >
      <EnterPageContent />
      <main className="w-full h-full flex justify-center items-center">
        <ScrollingText className="font-4xl" speed={300} editable={true} text='dt in the house' />
        {/* <ToolBar /> */}
        <FullScreen  className="fixed top-4 right-4"/>
      </main>
    </main>
  );
}
