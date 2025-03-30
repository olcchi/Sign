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
  onDoubleClick?: () => void;
  textRef?: React.RefObject<HTMLDivElement>;
}

export default function ScrollingText({
  text,
  speed = 50,
  fontSize = "5rem",
  fontFamily = "var(--font-dm-serif-text)",
  color = "white",
  className = "",
  onDoubleClick,
  textRef: externalTextRef,
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
      setTextWidth(textRect.width);
      setShouldScroll(needsScroll);
    }
  }, [textRef]);

  useEffect(() => {
    measureWidths();
    window.addEventListener("resize", measureWidths);
    return () => window.removeEventListener("resize", measureWidths);
  }, [measureWidths, text]);

  const TEXT_GAP = 150;
  const animationDuration = textWidth > 0 ? (textWidth + TEXT_GAP) / speed : 10;

  const textStyle = {
    fontSize,
    fontFamily,
    color,
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full overflow-hidden flex items-center justify-center relative",
        className
      )}
    >
      <div
        onDoubleClick={onDoubleClick}
        className="relative w-full h-fit overflow-hidden flex items-center"
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
