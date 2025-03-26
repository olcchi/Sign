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
  const [scrolling, setScrolling] = useState(false);
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editableText, setEditableText] = useState(text);

  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // clac text width and container width
  const measureWidths = useCallback(() => {
    if (textRef.current && containerRef.current) {
      const textRect = textRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setTextWidth(textRect.width);
      setContainerWidth(containerRect.width);

      // scroll trigger logic
      setScrolling(textRect.width > containerRect.width);
    }
  }, []);

  // resize event listener
  useEffect(() => {
    measureWidths();

    const handleResize = () => {
      measureWidths();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measureWidths, editableText]);

  // refresh text when text change
  useEffect(() => {
    setEditableText(text);
    measureWidths();
  }, [text, measureWidths]);

  // edit text
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableText(e.target.value);
    onTextChange?.(e.target.value);
  };

  // edit mode
  const enterEditMode = () => {
    if (editable) {
      setEditMode(true);
      // input select
      setTimeout(() => {
        textInputRef.current?.focus();
        textInputRef.current?.select();
      }, 10);
    }
  };

  // exit edit mode
  const exitEditMode = () => {
    setEditMode(false);
  };

  // clac animation duration
  const animationDuration = textWidth > 0 ? textWidth / speed : 10;

  return (
    <div
      ref={containerRef}
      className={`scrolling-text-container ${className}`}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onDoubleClick={enterEditMode}
    >
      {editMode && editable ? (
        <input
          ref={textInputRef}
          type="text"
          value={editableText}
          onChange={handleTextChange}
          onBlur={exitEditMode}
          onKeyDown={(e) => e.key === "Enter" && exitEditMode()}
          style={{
            fontSize,
            fontFamily,
            color,
            background: "transparent",
            border: "none",
            outline: "none",
            textAlign: "center",
            width: "100%",
          }}
          className="scrolling-text-input"
        />
      ) : (
        <motion.div
          ref={textRef}
          style={{
            fontSize,
            fontFamily,
            color,
            whiteSpace: "nowrap",
            display: "inline-block",
          }}
          animate={
            scrolling
              ? {
                  x: [0, -textWidth + containerWidth],
                }
              : {}
          }
          transition={
            scrolling
              ? {
                  x: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: animationDuration,
                    ease: "linear",
                  },
                }
              : {}
          }
        >
          {editableText}
        </motion.div>
      )}
    </div>
  );
}
