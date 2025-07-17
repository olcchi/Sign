"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ScrollingTextScroller } from "@/components/ui/widgets/scrolling-text/scrolling-text-scroller";
import { textShadowConfig } from "@/lib/settings-config";

import "@/components/ui/widgets/shiny-text/shiny-text.css";

export interface ScrollingTextProps {
  text: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontItalic?: boolean;
  color?: string;
  className?: string;
  textRef?: React.RefObject<HTMLDivElement>;
  scrollSpeed?: number;
  onScrollStateChange?: (isScrolling: boolean) => void;
  shinyTextEnabled?: boolean;
  textStrokeEnabled?: boolean;
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textFillEnabled?: boolean;
  textGlowEnabled?: boolean;
  textGlowColor?: string;
  textGlowIntensity?: number;
  textGlowBlur?: number;
}

// Responsive text component that automatically scrolls when content exceeds container
export default function ScrollingText({
  text,
  fontSize,
  fontFamily = "var(--font-serif)",
  fontWeight = "400",
  fontItalic = false,
  color = "#FFFFFB",
  className = "",
  textRef: externalTextRef,
  scrollSpeed = 10,
  onScrollStateChange,
  shinyTextEnabled = false,
  textStrokeEnabled = true,
  textStrokeWidth = 0.03,
  textStrokeColor = "#000000",
  textFillEnabled = true,
  textGlowEnabled = false,
  textGlowColor = "#FFFFFF",
  textGlowIntensity = textShadowConfig.intensity.defaultValue,
  textGlowBlur = 4,
}: ScrollingTextProps) {
  const [textWidth, setTextWidth] = useState(0);
  const [shouldScroll, setShouldScroll] = useState(false);

  const internalTextRef = useRef<HTMLDivElement>(null);
  const textRef = externalTextRef || internalTextRef;
  const containerRef = useRef<HTMLDivElement>(null);

  // Compare text and container widths to determine if scrolling is needed
  const measureWidths = useCallback(() => {
    if (textRef.current && containerRef.current) {
      const textRect = textRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const needsScroll = textRect.width > containerRect.width;

      // Reset before updating to prevent animation flicker
      setShouldScroll(false);
      setTimeout(() => {
        setTextWidth(textRect.width);
        setShouldScroll(needsScroll);
      }, 0);
    }
  }, [textRef, fontFamily, fontSize]);

  // Re-measure when text or container size might change
  useEffect(() => {
    measureWidths();
    window.addEventListener("resize", measureWidths);
    return () => window.removeEventListener("resize", measureWidths);
  }, [measureWidths, text]);

  // Notify parent component about scrolling state changes
  useEffect(() => {
    if (onScrollStateChange) {
      onScrollStateChange(shouldScroll);
    }
  }, [shouldScroll, onScrollStateChange]);

  // Space between repeated texts for smooth loop transition
  const TEXT_GAP = 150;

  // Adjust animation speed relative to text length for consistent visual pace
  const BASE_WIDTH = 1000;
  const widthFactor = textWidth / BASE_WIDTH;
  const animationDuration = (widthFactor * 100) / scrollSpeed;

  // Ensure text remains visible even if contradictory props are provided
  const ensuredTextFillEnabled =
    !textStrokeEnabled && !textFillEnabled ? true : textFillEnabled;
  const ensuredTextStrokeEnabled =
    !textStrokeEnabled && !textFillEnabled ? true : textStrokeEnabled;

  // Generate text glow effect using CSS text-shadow with relative units
  const generateTextGlow = () => {
    if (!textGlowEnabled) return "";
    
    const intensity = textGlowIntensity;
    const blur = textGlowBlur;
    const color = textGlowColor;
    
    // Use intensity to control blur radius and opacity for smooth transitions
    // Convert blur to em units for relative scaling with font size
    const shadowBlur = (blur * intensity * 0.5) * 0.01; // Scale blur with intensity
    const opacity = Math.min(intensity * 0.6, 1); // Scale opacity with intensity
    
    // Extract RGB values from hex color and apply opacity
    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    const glowColor = color.startsWith('#') ? hexToRgba(color, opacity) : color;
    
    // text-shadow syntax: offset-x offset-y blur-radius color
    return `0 0 ${shadowBlur}em ${glowColor}`;
  };

  const textStyle = {
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle: fontItalic ? "italic" : "normal",
    color: ensuredTextFillEnabled ? color : "transparent",
    ...(ensuredTextStrokeEnabled && {
      WebkitTextStroke: `${textStrokeWidth}em ${textStrokeColor}`,
      textStroke: `${textStrokeWidth}em ${textStrokeColor}`,
    }),
    ...(textGlowEnabled && {
      textShadow: generateTextGlow(),
    }),
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility" as const,
  };

  // White text requires different shiny effect parameters
  const isWhiteText = color.toLowerCase() === "#fffffb";

  const textClasses = cn(
    "whitespace-nowrap inline-block mx-auto select-none",
    shinyTextEnabled && "shiny-text"
  );

  return (
    <div ref={containerRef} className={cn(className)}>
      <div
        className="relative w-full h-fit overflow-hidden flex items-center"
        aria-label={`Scrolling text: ${text}`}
      >
        {shouldScroll ? (
          // Continuous scrolling for overflow text
          <ScrollingTextScroller
             textWidth={textWidth}
             TEXT_GAP={TEXT_GAP}
             animationDuration={animationDuration}
             textStyle={textStyle}
             editableText={text}
             textRef={textRef as React.RefObject<HTMLDivElement>}
             shinyTextEnabled={shinyTextEnabled}
             textColor={color}
             textStrokeEnabled={textStrokeEnabled}
             textStrokeWidth={textStrokeWidth}
             textStrokeColor={textStrokeColor}
             textFillEnabled={textFillEnabled}
             textGlowEnabled={textGlowEnabled}
           />
        ) : (
          // Static display when text fits container
          <div
            ref={textRef}
            className={textClasses}
            style={textStyle}
            data-text={text}
            data-white-text={isWhiteText.toString()}
          >
            <p>{text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
