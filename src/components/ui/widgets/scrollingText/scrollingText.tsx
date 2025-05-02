"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ScrollingTextScroller } from "@/components/ui/widgets/scrollingText/scrollingTextScroller";

export interface ScrollingTextProps {
  text: string;
  speed?: number;
  fontSize?: string;
  fontFamily?: string;
  color?: string;
  className?: string;
  textRef?: React.RefObject<HTMLDivElement>;
  scrollSpeed?: number;
  onScrollStateChange?: (isScrolling: boolean) => void;
}

export default function ScrollingText({
  text,
  speed = 50,
  fontSize = "5rem",
  fontFamily = "var(--font-dm-serif-text)",
  color = "white",
  className = "",
  textRef: externalTextRef,
  scrollSpeed = 10,
  onScrollStateChange,
}: ScrollingTextProps) {
  const [textWidth, setTextWidth] = useState(0);
  const [shouldScroll, setShouldScroll] = useState(false);
  
  const internalTextRef = useRef<HTMLDivElement>(null);
  const textRef = externalTextRef || internalTextRef;
  const containerRef = useRef<HTMLDivElement>(null);

  const measureWidths = useCallback(() => {
    if (textRef.current && containerRef.current) {
      const textRect = textRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const needsScroll = textRect.width > containerRect.width;
      
      // Reset animation state: Stop scrolling first, then restart if needed
      setShouldScroll(false); // Immediately stop current animation
      setTimeout(() => {
        setTextWidth(textRect.width); // Update text width
        setShouldScroll(needsScroll); // Restart scrolling if needed
      }, 0); // Execute in the next frame to ensure rendering completes
    }
  }, [textRef, fontFamily, fontSize]);

  useEffect(() => {
    measureWidths();
    window.addEventListener("resize", measureWidths);
    return () => window.removeEventListener("resize", measureWidths);
  }, [measureWidths, text]);

  // Measure text width changes when text or color updates
  useEffect(() => {
    measureWidths();
  }, [text, measureWidths]);

  // Trigger callback when scroll state changes
  useEffect(() => {
    if (onScrollStateChange) {
      onScrollStateChange(shouldScroll);
    }
  }, [shouldScroll, onScrollStateChange]);

  const TEXT_GAP = 150;
  const animationDuration = 100 / scrollSpeed;

  const textStyle = {
    fontSize,
    fontFamily,
    color,
  };
  console.log(textStyle);

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
          <ScrollingTextScroller
            textWidth={textWidth}
            TEXT_GAP={TEXT_GAP}
            animationDuration={animationDuration}
            textStyle={textStyle}
            editableText={text}
            textRef={textRef as React.RefObject<HTMLDivElement>}
          />
        ) : (
          <div
            ref={textRef}
            className={cn("whitespace-nowrap inline-block mx-auto select-none")}
            style={textStyle}
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
}
