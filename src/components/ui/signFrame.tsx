"use client";
import { useRef } from "react";
import ToolBar from "@/components/ui/toolBar/toolBar";
import ScrollingText from "@/components/ui/widgets/scrollingText/scrollingText";
import { EdgeBlurEffect } from "@/components/ui/filter/EdgeBlurEffect";
import FullScreen from "@/components/ui/layout/fullScreen";
import Image from "next/image";
import "@/components/ui/widgets/shinyText/shinyText.css";
import Noise from "@/components/ui/filter/noise";
import { useSettings } from "@/lib/contexts/SettingsContext";
import WelcomeModal from "@/components/ui/welcome/WelcomeModal";

interface SignFrameProps {
  className?: string;
}

export default function SignFrame({ className }: SignFrameProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const {
    textSettings,
    backgroundSettings,
    effectsSettings,
    setIsTextScrolling,
  } = useSettings();

  // Background style based on settings
  const backgroundStyle = {
    backgroundColor: backgroundSettings.backgroundColor,
  };

  return (
    <main
      className={`relative w-screen h-[100dvh] overflow-hidden font-sans ${
        className || ""
      }`}
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
              transformOrigin: "50% 50%",
            }}
          />
        </div>
      )}
      {backgroundSettings.backgroundImage &&
        backgroundSettings.overlayEnabled && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md z-1"></div>
        )}
      {effectsSettings.noiseEnabled && (
        <Noise
          className="z-30 mix-blend-overlay"
          opacity={effectsSettings.noiseOpacity}
          density={effectsSettings.noiseDensity}
          color="#ffffff"
          animated={effectsSettings.noiseAnimated}
        />
      )}
      <ScrollingText
        className="fixed inset-0 z-20 overflow-hidden flex items-center justify-center"
        fontFamily={textSettings.fontFamily}
        text={textSettings.text}
        fontSize={textSettings.fontSize}
        fontWeight={textSettings.fontWeight}
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
      <EdgeBlurEffect
        className="pointer-events-none fixed inset-0 z-30"
        enabled={effectsSettings.edgeBlurEnabled}
        intensity={effectsSettings.edgeBlurIntensity}
      />
      <WelcomeModal />
      
      {/* Top-right button group */}
      <div className="fixed top-4 right-4 z-[999] flex items-center gap-2">
        <FullScreen asButton={true} />
        <ToolBar className="relative pointer-events-none" />
      </div>
    </main>
  );
}
