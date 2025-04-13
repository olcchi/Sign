"use client";
import FullScreen from "@/components/ui/fullScreen";
import EnterPageContent from "@/components/ui/SetupGuide/setupGuide";
import ToolBar from "@/components/ui/toolBar";
import ScrollingText from "@/components/ui/widgets/scrollingText/scrollingText";
import { useRef, useState,useEffect } from "react"; 
import { cn } from "@/lib/utils";

export default function Home() {
  const dragContainer = useRef(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // 状态
  const [text, setText] = useState('dt in the house');
  const [textColor, setTextColor] = useState('white');
  const [fontFamily, setFontFamily] = useState('var(--font-dm-serif-text)');
  const [scrollSpeed, setScrollSpeed] = useState(10); // 滚动速度
  
  // 计算动画持续时间：速度越大，持续时间越短
  const animationDuration = 50 / scrollSpeed;

  return (
    <main
      ref={dragContainer}
      className="relative bg-black w-screen h-[100dvh] overflow-hidden font-[family-name:var(--font-dm-serif-text)] italic"
    >
      <EnterPageContent />
      <main className="w-full h-full flex justify-center items-center">
        <div className="relative w-full">
          <ScrollingText 
            className={cn("font-4xl")}
            fontFamily={fontFamily}
            speed={300} 
            text={text}
            color={textColor}
            textRef={textRef as React.RefObject<HTMLDivElement>}
            animationDuration={animationDuration}
          />
        </div>
        <ToolBar
          initialText={text}
          onTextChange={setText}
          onColorChange={setTextColor}
          onFontChange={setFontFamily}
          scrollSpeed={scrollSpeed}
          onScrollSpeedChange={setScrollSpeed}
        />
        <FullScreen className="fixed top-4 right-4"/>
      </main>
    </main>
  );
}
