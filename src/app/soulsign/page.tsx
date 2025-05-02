"use client";
import FullScreen from "@/components/ui/layout/fullScreen";
import EnterPageContent from "@/components/ui/setup/SetupGuide/setupGuide";
import ToolBar from "@/components/ui/toolBar";
import ScrollingText from "@/components/ui/widgets/scrollingText/scrollingText";
import { useRef, useState } from "react"; 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";

export default function Home() {
  const dragContainer = useRef(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // 状态
  const [text, setText] = useState('dt in the house');
  const [textColor, setTextColor] = useState('white');
  const [fontFamily, setFontFamily] = useState('var(--font-dm-serif-text)');
  const [fontSize, setFontSize] = useState("5rem");
  const [scrollSpeed, setScrollSpeed] = useState(10);
  const [isTextScrolling, setIsTextScrolling] = useState(false);


  return (
    <main
      ref={dragContainer}
      className="relative bg-black w-screen h-[100dvh] overflow-hidden font-[family-name:var(--font-dm-serif-text)] italic"
    >
      <EnterPageContent />
      <main className="w-full h-full flex justify-center items-center">
        <div className="relative w-full">
          <ScrollingText 
            fontFamily={fontFamily}
            speed={200} 
            text={text}
            fontSize={fontSize}
            color={textColor}
            textRef={textRef as React.RefObject<HTMLDivElement>}
            scrollSpeed={scrollSpeed}
            onScrollStateChange={setIsTextScrolling}
          />
        </div>
        <ToolBar
          initialText={text}
          onTextChange={setText}
          onColorChange={setTextColor}
          onFontChange={setFontFamily}
          onFontSizeChange={setFontSize}
          scrollSpeed={scrollSpeed}
          onScrollSpeedChange={setScrollSpeed}
          isTextScrolling={isTextScrolling}
        />
          <FullScreen
          asButton={true}
          className="fixed top-4 left-4"
           />
      </main>
    </main>
  );
}
