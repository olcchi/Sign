"use client";
import ToolBar from "@/components/ui/toolBar/toolBar";
import ScrollingText from "@/components/ui/widgets/scrollingText/scrollingText";
import { EdgeBlurEffect } from "@/components/ui/filter/EdgeBlurEffect";
import { Olcchi } from "@/components/ui/icon/olcchi";
import { useRef, useState, useEffect } from "react";
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
  const [showWelcome, setShowWelcome] = useState(false);
  const {
    textSettings,
    backgroundSettings,
    effectsSettings,
    setIsTextScrolling,
  } = useSettings();

  // Check if this is the first visit and show welcome modal
  useEffect(() => {
    const hasVisited = localStorage.getItem('sign-has-visited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('sign-has-visited', 'true');
    }
  }, []);

  // Background style based on settings
  const backgroundStyle = {
    backgroundColor: backgroundSettings.backgroundColor,
  };

  return (
    <main
      className={`relative w-screen h-[100dvh] overflow-hidden font-sans ${className || ''}`}
      style={backgroundStyle}
    >
      {/* Welcome Modal */}
      <WelcomeModal 
        open={showWelcome} 
        onOpenChange={setShowWelcome}
      />

      {/* Background image with dynamic positioning and scaling */}
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

      {/* Semi-transparent overlay improves text readability over images */}
      {backgroundSettings.backgroundImage &&
        backgroundSettings.overlayEnabled && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md z-1"></div>
        )}

      {/* Noise texture adds visual depth and dimension */}
      {effectsSettings.noiseEnabled && (
        <Noise
          className="z-30 mix-blend-overlay"
          opacity={effectsSettings.noiseOpacity}
          density={effectsSettings.noiseDensity}
          color="#ffffff"
          animated={effectsSettings.noiseAnimated}
        />
      )}

      {/* Scrolling text component with dynamic settings */}
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

      {/* Edge blur effect for visual polish */}
      <EdgeBlurEffect
        className="pointer-events-none fixed inset-0 z-30"
        enabled={effectsSettings.edgeBlurEnabled}
        intensity={effectsSettings.edgeBlurIntensity}
      />

      {/* Toolbar for user interactions */}
      <ToolBar 
        className="w-full h-full z-[999] relative flex" 
        onShowWelcome={() => setShowWelcome(true)}
      />

      <Olcchi className="z-[999]" />
    </main>
  );
} 