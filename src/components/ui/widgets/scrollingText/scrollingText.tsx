"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ScrollingTextScroller } from "@/components/ui/widgets/scrollingText/scrollingTextScroller";
import "@/components/ui/widgets/shinyText/shinyText.css"

export interface ScrollingTextProps {
  text: string;
  fontSize?: string;
  fontFamily?: string;
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

// Displays text with automatic horizontal scrolling when content exceeds container width
export default function ScrollingText({
  text,
  fontSize,
  fontFamily = "var(--font-dm-serif-text)",
  color = "white",
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

  // Determines scroll necessity by comparing text width to container width
  const measureWidths = useCallback(() => {
    if (textRef.current && containerRef.current) {
      const textRect = textRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const needsScroll = textRect.width > containerRect.width;
      
      // Reset animation state to prevent visual glitches during transitions
      setShouldScroll(false);
      setTimeout(() => {
        setTextWidth(textRect.width);
        setShouldScroll(needsScroll);
      }, 0);
    }
  }, [textRef, fontFamily, fontSize]);

  // Measure on mount, text change, and window resize
  useEffect(() => {
    measureWidths();
    window.addEventListener("resize", measureWidths);
    return () => window.removeEventListener("resize", measureWidths);
  }, [measureWidths, text]);

  useEffect(() => {
    if (onScrollStateChange) {
      onScrollStateChange(shouldScroll);
    }
  }, [shouldScroll, onScrollStateChange]);

  // Spacing between repeated text instances
  const TEXT_GAP = 150;
  
  // Adjust animation speed based on text width for consistent visual effect
  const BASE_WIDTH = 1000;
  const widthFactor = textWidth / BASE_WIDTH;
  const animationDuration = (widthFactor * 100) / scrollSpeed;

  // Ensure at least one text styling option is active
  const ensuredTextFillEnabled = (!textStrokeEnabled && !textFillEnabled) ? true : textFillEnabled;
  const ensuredTextStrokeEnabled = (!textStrokeEnabled && !textFillEnabled) ? true : textStrokeEnabled;

  const textStyle = {
    fontSize,
    fontFamily,
    color: ensuredTextFillEnabled ? color : 'transparent',
    ...(ensuredTextStrokeEnabled && {
      WebkitTextStroke: `${textStrokeWidth}px ${textStrokeColor}`,
      textStroke: `${textStrokeWidth}px ${textStrokeColor}`,
    }),
  };

  // Detect white text for appropriate shiny effect variation
  const isWhiteText = color.toLowerCase() === '#ffffff' || 
                     color.toLowerCase() === 'white' ||
                     color.toLowerCase() === 'rgb(255, 255, 255)';

  const textClasses = cn(
    "whitespace-nowrap inline-block mx-auto select-none",
    shinyTextEnabled && "shiny-text"
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full overflow-hidden flex items-center justify-center relative",
        className
      )}
    >
      <div
        className="relative w-full h-fit overflow-hidden flex items-center"
        aria-label={`Scrolling text: ${text}`}
      >
        {shouldScroll ? (
          // Use scroller for continuous animation when text is wider than container
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
          // Display static centered text when it fits within container
          <div
            ref={textRef}
            className={textClasses}
            style={textStyle}
            data-text={text}
            data-white-text={isWhiteText.toString()}
          >
            <p>
            {text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
