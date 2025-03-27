"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import "./scrollingText.css";

export interface ScrollingTextProps {
  text: string;
  speed?: number;
  fontSize?: string;
  fontFamily?: string;
  color?: string;
  className?: string;
  onTextChange?: (text: string) => void;
  editable?: boolean;
}

export default function ScrollingText({
  text,
  speed = 50,
  fontSize = "5rem",
  fontFamily = "var(--font-dm-serif-text)",
  color = "white",
  className = "",
  onTextChange,
  editable = false,
}: ScrollingTextProps) {
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editableText, setEditableText] = useState(text);
  const [shouldScroll, setShouldScroll] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const measureWidths = useCallback(() => {
    if (textRef.current && containerRef.current) {
      const textRect = textRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      // 计算文本和容器的位置关系
      const textLeft = textRect.left;
      const textRight = textRect.right;
      const containerLeft = containerRect.left;
      const containerRight = containerRect.right;

      // 如果文本与容器的任意一侧发生交叉，则需要滚动
      const needsScroll =
        textLeft < containerLeft || textRight > containerRight;

      setTextWidth(textRect.width);
      setContainerWidth(containerRect.width);
      setShouldScroll(needsScroll);
    }
  }, []);

  useEffect(() => {
    measureWidths();

    const handleResize = () => {
      measureWidths();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measureWidths, editableText]);

  useEffect(() => {
    setEditableText(text);
    measureWidths();
  }, [text, measureWidths]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableText(e.target.value);
    onTextChange?.(e.target.value);
  };

  const enterEditMode = () => {
    if (editable) {
      setEditMode(true);
      setTimeout(() => {
        textInputRef.current?.focus();
        textInputRef.current?.select();
      }, 10);
    }
  };

  const exitEditMode = () => {
    setEditMode(false);
    setTimeout(measureWidths, 0);
  };
  const TEXT_GAP = 150;
  const animationDuration = textWidth > 0 ? (textWidth + TEXT_GAP) / speed : 10;

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden flex items-center justify-center relative ${className}`}
      onDoubleClick={enterEditMode}
    >
      <div className="relative w-full h-full overflow-hidden flex items-center">
        {shouldScroll ? (
          <motion.div
            className={`flex whitespace-nowrap`}
            style={{ gap: `${TEXT_GAP}px` }}
            animate={{
              x: [`0%`, `-${textWidth + TEXT_GAP}px`],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: animationDuration,
                ease: "linear",
              },
            }}
          >
            <div
              ref={textRef}
              className="whitespace-nowrap inline-block"
              style={{
                fontSize,
                fontFamily,
                color,
              }}
            >
              {editableText}
            </div>
            <div
              className="whitespace-nowrap inline-block"
              style={{
                fontSize,
                fontFamily,
                color,
              }}
            >
              {editableText}
            </div>
          </motion.div>
        ) : (
          <div
            ref={textRef}
            className="whitespace-nowrap inline-block mx-auto"
            style={{
              fontSize,
              fontFamily,
              color,
            }}
          >
            {editableText}
          </div>
        )}
      </div>
      {editMode && editable && (
        <motion.div className="absolute top-1/2 left-1/2 z-10 bg-black/80 p-4 rounded-lg shadow-lg min-w-[300px]">
          <input
            ref={textInputRef}
            type="text"
            value={editableText}
            onChange={handleTextChange}
            onBlur={exitEditMode}
            onKeyDown={(e) => e.key === "Enter" && exitEditMode()}
            className="w-full text-center bg-transparent border-none outline-none text-2xl"
            style={{
              fontFamily,
              color,
            }}
          />
        </motion.div>
      )}
    </div>
  );
}