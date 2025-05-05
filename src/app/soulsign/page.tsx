"use client";
import FullScreen from "@/components/ui/layout/fullScreen";
import EnterPageContent from "@/components/ui/setup/SetupGuide/setupGuide";
import ToolBar from "@/components/ui/toolBar";
import ScrollingText from "@/components/ui/widgets/scrollingText/scrollingText";
import { useRef, useState } from "react"; 

export default function Home() {
  const dragContainer = useRef(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // State - centralized management of all text-related states
  const [text, setText] = useState('dt in the house');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('var(--font-geist-sans)');
  const [fontSize, setFontSize] = useState("5rem");
  const [scrollSpeed, setScrollSpeed] = useState(10);
  const [isTextScrolling, setIsTextScrolling] = useState(false);
  // Background settings
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  // Overlay settings
  const [overlayEnabled, setOverlayEnabled] = useState(true);

  // Build background style
  const backgroundStyle = {
    backgroundColor,
    ...(backgroundImage && {
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    })
  };

  return (
    <main
      ref={dragContainer}
      className="relative w-screen h-[100dvh] overflow-hidden font-[family-name:var(--font-dm-serif-text)] italic"
      style={backgroundStyle}
    >
      {/* Background overlay */}
      {backgroundImage && overlayEnabled && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xs z-0"></div>
      )}
      
      {/* <EnterPageContent /> */}
      <main className="w-full h-full flex justify-center items-center relative z-10">
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
          text={text}
          onTextChange={setText}
          textColor={textColor}
          onColorChange={setTextColor}
          fontFamily={fontFamily}
          onFontChange={setFontFamily}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          scrollSpeed={scrollSpeed}
          onScrollSpeedChange={setScrollSpeed}
          isTextScrolling={isTextScrolling}
          backgroundColor={backgroundColor}
          onBackgroundColorChange={setBackgroundColor}
          backgroundImage={backgroundImage}
          onBackgroundImageChange={setBackgroundImage}
          overlayEnabled={overlayEnabled}
          onOverlayEnabledChange={setOverlayEnabled}
        />
        <FullScreen
          asButton={true}
          className="fixed top-4 left-4"
        />
      </main>
    </main>
  );
}
