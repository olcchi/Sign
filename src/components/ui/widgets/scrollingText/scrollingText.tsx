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
      
      // 重置动画状态：先停止滚动，再根据新宽度重新开始
      setShouldScroll(false); // 立即停止当前动画
      setTimeout(() => {
        setTextWidth(textRect.width); // 更新文本宽度
        setShouldScroll(needsScroll); // 重新触发滚动（如果需要）
      }, 0); // 下一帧执行，确保渲染完成
    }
  }, [textRef, fontFamily]);

  useEffect(() => {
    measureWidths();
    window.addEventListener("resize", measureWidths);
    return () => window.removeEventListener("resize", measureWidths);
  }, [measureWidths, text]);

  // 测量文本宽度变化 - 当文本或颜色改变时
  useEffect(() => {
    measureWidths();
  }, [text, measureWidths]);


  const TEXT_GAP = 150;
  const animationDuration = 100 / scrollSpeed;

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
        className="relative w-full h-fit overflow-hidden flex items-center"
        aria-label={`滚动文本: ${text}`}
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
