"use client";
import FullScreen from "@/components/ui/layout/fullScreen";
import ToolBar from "@/components/ui/toolBar";
import ScrollingText from "@/components/ui/widgets/scrollingText/scrollingText";
import { EdgeBlurEffect } from "@/components/ui/EdgeBlurEffect";
import { Olcchi } from "@/components/ui/olcchi";
import { useRef } from "react";
import Image from "next/image";
import "@/components/ui/widgets/shinyText/shinyText.css";
import Noise from "@/components/ui/noisyButterflyBackground/noise";
import { SettingsProvider, useSettings } from "@/lib/contexts/SettingsContext";

// Internal component using Context to access global settings
function SoulSignContent() {
  const textRef = useRef<HTMLDivElement>(null);
  const {
    textSettings,
    backgroundSettings,
    effectsSettings,
    isTextScrolling,
    setIsTextScrolling
  } = useSettings();

  const backgroundStyle = {
    backgroundColor: backgroundSettings.backgroundColor,
  };

  return (
    <main
      className="relative w-screen h-[100dvh] overflow-hidden font-[family-name:var(--font-dm-serif-text)]"
      style={backgroundStyle}
    >
      {backgroundSettings.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundSettings.backgroundImage}
            alt="Background"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: `${backgroundSettings.backgroundPosition.x}% ${backgroundSettings.backgroundPosition.y}%`,
              transform: `scale(${backgroundSettings.backgroundZoom})`,
              transformOrigin: `${backgroundSettings.backgroundPosition.x}% ${backgroundSettings.backgroundPosition.y}%`,
            }}
          />
        </div>
      )}

      {/* Semi-transparent overlay improves text readability over images */}
      {backgroundSettings.backgroundImage && backgroundSettings.overlayEnabled && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md z-1"></div>
      )}

      {/* Noise texture adds visual depth and dimension */}
      {effectsSettings.noiseEnabled && (
        <Noise 
          opacity={effectsSettings.noiseOpacity} 
          density={effectsSettings.noiseDensity} 
          color="#ffffff" 
          className="z-20 mix-blend-overlay" 
        />
      )}

      <div className="w-full h-full flex justify-center items-center relative z-10">
        <div className="relative w-full">
          <ScrollingText
            fontFamily={textSettings.fontFamily}
            text={textSettings.text}
            fontSize={textSettings.fontSize}
            color={textSettings.textColor}
            textRef={textRef as React.RefObject<HTMLDivElement>}
            scrollSpeed={textSettings.scrollSpeed}
            onScrollStateChange={setIsTextScrolling}
            shinyTextEnabled={effectsSettings.shinyTextEnabled}
            textStrokeEnabled={textSettings.textStrokeEnabled}
            textStrokeWidth={textSettings.textStrokeWidth}
            textStrokeColor={textSettings.textStrokeColor}
            textFillEnabled={textSettings.textFillEnabled}
          />
        </div>
      </div>

      <EdgeBlurEffect 
        enabled={effectsSettings.edgeBlurEnabled} 
        intensity={effectsSettings.edgeBlurIntensity} 
      />
      
      <ToolBar />

      <FullScreen asButton={true} className="fixed top-4 left-4" />
    </main>
  );
}

// Main page component wraps with SettingsProvider to ensure global state availability
export default function SoulSignPage() {
  return (
    <SettingsProvider>
      <SoulSignContent />
    </SettingsProvider>
  );
}
