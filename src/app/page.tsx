"use client";
import FullScreen from "@/components/ui/layout/fullScreen";
import ToolBar from "@/components/ui/toolBar";
import ScrollingText from "@/components/ui/widgets/scrollingText/scrollingText";
import { EdgeBlurEffect } from "@/components/ui/EdgeBlurEffect";
import { Olcchi } from "@/components/ui/olcchi";
import { useRef, useState } from "react";
import Image from "next/image";
import "@/components/ui/widgets/shinyText/shinyText.css";
import Noise from "@/components/ui/noisyButterflyBackground/noise";

export default function SoulSignPage() {
  const textRef = useRef<HTMLDivElement>(null);

  // Main display configuration state
  const [text, setText] = useState("Soul Sign");
  const [textColor, setTextColor] = useState("#FFFFFB");
  const [fontFamily, setFontFamily] = useState("var(--font-geist-sans)");
  const [fontSize, setFontSize] = useState("10rem");
  const [scrollSpeed, setScrollSpeed] = useState(10);
  const [isTextScrolling, setIsTextScrolling] = useState(false);
  
  // Background configuration
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundPosition, setBackgroundPosition] = useState({
    x: 50,
    y: 50,
  });
  const [backgroundZoom, setBackgroundZoom] = useState(1);
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  
  // Visual effects configuration
  const [edgeBlurEnabled, setEdgeBlurEnabled] = useState(false);
  const [edgeBlurIntensity, setEdgeBlurIntensity] = useState(10);
  const [shinyTextEnabled, setShinyTextEnabled] = useState(true);
  const [noiseEnabled, setNoiseEnabled] = useState(false);
  const [noiseOpacity, setNoiseOpacity] = useState(0.1);
  const [noiseDensity, setNoiseDensity] = useState(0.3);
  
  // Text styling effects
  const [textStrokeEnabled, setTextStrokeEnabled] = useState(true);
  const [textStrokeWidth, setTextStrokeWidth] = useState(2);
  const [textStrokeColor, setTextStrokeColor] = useState("#FFFFFB");
  const [textFillEnabled, setTextFillEnabled] = useState(false);

  const backgroundStyle = {
    backgroundColor,
  };

  return (
    <main
      className="relative w-screen h-[100dvh] overflow-hidden font-[family-name:var(--font-dm-serif-text)]"
      style={backgroundStyle}
    >
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
              transformOrigin: `${backgroundPosition.x}% ${backgroundPosition.y}%`,
            }}
          />
        </div>
      )}

      {/* Semi-transparent overlay improves text readability over images */}
      {backgroundImage && overlayEnabled && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md z-1"></div>
      )}

      {/* Noise texture adds visual interest and depth */}
      {noiseEnabled && (
        <Noise opacity={noiseOpacity} density={noiseDensity} color="#ffffff" className="z-20 mix-blend-overlay" />
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
            shinyTextEnabled={shinyTextEnabled}
            textStrokeEnabled={textStrokeEnabled}
            textStrokeWidth={textStrokeWidth}
            textStrokeColor={textStrokeColor}
            textFillEnabled={textFillEnabled}
          />
        </div>
      </div>

      <EdgeBlurEffect enabled={edgeBlurEnabled} intensity={edgeBlurIntensity} />
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
        shinyTextEnabled={shinyTextEnabled}
        onShinyTextEnabledChange={setShinyTextEnabled}
        noiseEnabled={noiseEnabled}
        onNoiseEnabledChange={setNoiseEnabled}
        noiseOpacity={noiseOpacity}
        onNoiseOpacityChange={setNoiseOpacity}
        noiseDensity={noiseDensity}
        onNoiseDensityChange={setNoiseDensity}
        textStrokeEnabled={textStrokeEnabled}
        onTextStrokeEnabledChange={setTextStrokeEnabled}
        textStrokeWidth={textStrokeWidth}
        onTextStrokeWidthChange={setTextStrokeWidth}
        textStrokeColor={textStrokeColor}
        onTextStrokeColorChange={setTextStrokeColor}
        textFillEnabled={textFillEnabled}
        onTextFillEnabledChange={setTextFillEnabled}
      />

      <FullScreen asButton={true} className="fixed top-4 left-4" />
    </main>
  );
}
