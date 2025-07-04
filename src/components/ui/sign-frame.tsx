"use client";
import { useRef } from "react";
import { ToolBar } from "@/components/ui/settings";
import { ScrollingText } from "@/components/ui/widgets";
import { EdgeBlurEffect, Noise, StarField } from "@/components/ui/filter";
import { FullScreen } from "@/components/ui/layout";
import Image from "next/image";
import "@/components/ui/widgets/shiny-text/shiny-text.css";
import { useSettings } from "@/lib/contexts/settings-context";
import { OnboardingModal } from "@/components/ui/onboarding";
// import { ViewportMonitor } from "@/components/ui/widgets";

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
            quality={90}
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
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md z-1" />
        )}
      <StarField
        enabled={effectsSettings.starFieldEnabled}
        density={effectsSettings.starFieldDensity}
        color={effectsSettings.starFieldColor}
        size={effectsSettings.starFieldSize}
        twinkleSpeed={effectsSettings.starFieldTwinkleSpeed}
        className="fixed inset-0 z-0"
      />
      {effectsSettings.noiseEnabled && (
        <div className="fixed inset-0 z-50">
          <Noise
            patternSize={effectsSettings.noisePatternSize}
            patternAlpha={effectsSettings.noisePatternAlpha}
          />
        </div>
      )}
      <ScrollingText
        className="fixed inset-0 z-20 overflow-hidden flex-center"
        fontFamily={textSettings.fontFamily}
        text={textSettings.text}
        fontSize={textSettings.fontSize}
        fontWeight={textSettings.fontWeight}
        fontItalic={textSettings.fontItalic}
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
      <OnboardingModal />
      {/* Viewport Monitor */}
      {/* <ViewportMonitor 
        position="bottom-left" 
        showHeight={true}
      /> */}
      {/* Top-right button group */}
      <div className="fixed top-4 right-4 z-[999] flex items-center gap-2">
        <FullScreen asButton={true} />
        <ToolBar className="relative pointer-events-none" />
      </div>
    </main>
  );
}
