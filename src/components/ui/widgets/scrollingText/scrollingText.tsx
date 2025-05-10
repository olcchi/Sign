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
}

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

  // Trigger callback when scroll state changes
  useEffect(() => {
    if (onScrollStateChange) {
      onScrollStateChange(shouldScroll);
    }
  }, [shouldScroll, onScrollStateChange]);

  const TEXT_GAP = 150;
  // Adjust animation duration based on text width to maintain consistent visual speed across different text sizes
  // Uses a fixed base width to normalize the speed
  const BASE_WIDTH = 1000;
  const widthFactor = textWidth / BASE_WIDTH;
  const animationDuration = (widthFactor * 100) / scrollSpeed;

  const textStyle = {
    fontSize,
    fontFamily,
    color,
  };

  // 检测是否为白色文本 (白色文本需要不同的闪光效果)
  const isWhiteText = color.toLowerCase() === '#ffffff' || 
                     color.toLowerCase() === 'white' ||
                     color.toLowerCase() === 'rgb(255, 255, 255)';

  // Determine text classes based on shiny effect being enabled
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
          <ScrollingTextScroller
            textWidth={textWidth}
            TEXT_GAP={TEXT_GAP}
            animationDuration={animationDuration}
            textStyle={textStyle}
            editableText={text}
            textRef={textRef as React.RefObject<HTMLDivElement>}
            shinyTextEnabled={shinyTextEnabled}
            textColor={color}
          />
        ) : (
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
