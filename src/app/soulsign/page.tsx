"use client";
import FullScreen from "@/components/ui/layout/fullScreen";
import ToolBar from "@/components/ui/toolBar";
import ScrollingText from "@/components/ui/widgets/scrollingText/scrollingText";
import { EdgeBlurEffect } from "@/components/ui/EdgeBlurEffect";
import { Olcchi } from "@/components/ui/olcchi";
import { useRef, useState } from "react"; 
import Image from "next/image";

export default function SoulSignPage() {
  const textRef = useRef<HTMLDivElement>(null);
  
  // State - centralized management of all text-related states
  const [text, setText] = useState('Soul Sign , 创建你的赛博应援牌');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('var(--font-geist-sans)');
  const [fontSize, setFontSize] = useState("5rem");
  const [scrollSpeed, setScrollSpeed] = useState(10);
  const [isTextScrolling, setIsTextScrolling] = useState(false);
  // Background settings
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 50, y: 50 });
  // Overlay settings
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [backgroundZoom, setBackgroundZoom] = useState(1);
  // Edge blur effect settings
  const [edgeBlurEnabled, setEdgeBlurEnabled] = useState(false);
  const [edgeBlurIntensity, setEdgeBlurIntensity] = useState(5);


  // Build background style (only for backgroundColor now)
  const backgroundStyle = {
    backgroundColor
  };

  return (
    <main
      className="relative w-screen h-[100dvh] overflow-hidden font-[family-name:var(--font-dm-serif-text)] italic"
      style={backgroundStyle}
    >
      {/* Background image using Next.js Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`,
              transform: `scale(${backgroundZoom})`,
              transformOrigin: `${backgroundPosition.x}% ${backgroundPosition.y}%`
            }}
          />
        </div>
      )}
      
      {/* Background overlay */}
      {backgroundImage && overlayEnabled && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md z-0"></div>
      )}
      
      <div className="w-full h-full flex justify-center items-center relative z-10">
        <div className="relative w-full">
          <ScrollingText 
            fontFamily={fontFamily}
            text={text} 
            fontSize={fontSize}
            color={textColor}
            textRef={textRef as React.RefObject<HTMLDivElement>}
            scrollSpeed={scrollSpeed}
            onScrollStateChange={setIsTextScrolling}
          />
        </div>
        
        {/* Edge blur effect */}
        <EdgeBlurEffect 
          enabled={edgeBlurEnabled} 
          intensity={edgeBlurIntensity} 
        />
        
        
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
          backgroundPosition={backgroundPosition}
          onBackgroundPositionChange={setBackgroundPosition}
          backgroundZoom={backgroundZoom}
          onBackgroundZoomChange={setBackgroundZoom}
          edgeBlurEnabled={edgeBlurEnabled}
          onEdgeBlurEnabledChange={setEdgeBlurEnabled}
          edgeBlurIntensity={edgeBlurIntensity}
          onEdgeBlurIntensityChange={setEdgeBlurIntensity}
        />
        <FullScreen
          asButton={true}
          className="fixed top-4 left-4"
        />
      </div>
    </main>
  );
}
