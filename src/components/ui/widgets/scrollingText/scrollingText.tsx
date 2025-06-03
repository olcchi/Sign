"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ScrollingTextScroller } from "@/components/ui/widgets/scrollingText/scrollingTextScroller";
import "@/components/ui/widgets/shinyText/shinyText.css";

export interface ScrollingTextProps {
  text: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
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
}

// Responsive text component that automatically scrolls when content exceeds container
export default function ScrollingText({
  text,
  fontSize,
  fontFamily = "var(--font-dm-serif-text)",
  fontWeight = "400",
  color = "#FFFFFB",
  className = "",
  textRef: externalTextRef,
  scrollSpeed = 10,
  onScrollStateChange,
  shinyTextEnabled = false,
  textStrokeEnabled = true,
  textStrokeWidth = 1,
  textStrokeColor = "#000000",
  textFillEnabled = true,
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

  const textStyle = {
    fontSize,
    fontFamily,
    fontWeight,
    color: ensuredTextFillEnabled ? color : "transparent",
    ...(ensuredTextStrokeEnabled && {
      WebkitTextStroke: `${textStrokeWidth}px ${textStrokeColor}`,
      textStroke: `${textStrokeWidth}px ${textStrokeColor}`,
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
