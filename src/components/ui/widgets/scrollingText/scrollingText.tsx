"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./scrollingText.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import TextEditor from "@/components/ui/textEditor";
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
  const [shouldScroll, setShouldScroll] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableText, setEditableText] = useState(text);
  const [inputText, setInputText] = useState(text);

  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const measureWidths = useCallback(() => {
    if (textRef.current && containerRef.current) {
      const textRect = textRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const needsScroll = textRect.width > containerRect.width;
      setTextWidth(textRect.width);
      setShouldScroll(needsScroll);
    }
  }, []);

  useEffect(() => {
    measureWidths();
    window.addEventListener("resize", measureWidths);
    return () => window.removeEventListener("resize", measureWidths);
  }, [measureWidths, editableText]);

  useEffect(() => {
    setEditableText(text);
    measureWidths();
  }, [text, measureWidths]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const enterEditMode = () => {
    if (editable) {
      setEditMode(true);
      setInputText(editableText);
      setTimeout(() => {
        textInputRef.current?.focus();
        textInputRef.current?.select();
      }, 10);
    }
  };

  const exitEditMode = () => {
    setEditMode(false);
    setEditableText(inputText);
    onTextChange?.(inputText);
    measureWidths();
  };

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
      className={`w-full h-full overflow-hidden flex items-center justify-center relative ${className}`}
    >
      <div
        onDoubleClick={enterEditMode}
        className="relative w-full h-fit overflow-hidden flex items-center"
      >
        {shouldScroll ? (
          <motion.div
            className="flex whitespace-nowrap"
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
              className="whitespace-nowrap inline-block select-none"
              style={textStyle}
            >
              {editableText}
            </div>
            <div
              className="whitespace-nowrap inline-block select-none"
              style={textStyle}
            >
              {editableText}
            </div>
          </motion.div>
        ) : (
          <div
            ref={textRef}
            className="whitespace-nowrap inline-block mx-auto select-none"
            style={textStyle}
          >
            {editableText}
          </div>
        )}
      </div>
      <TextEditor
        show={editMode && editable}
        text={inputText}
        onTextChange={setInputText}
        onClose={() => setEditMode(false)}
        onSubmit={exitEditMode}
        textInputRef={
          textInputRef as unknown as React.RefObject<HTMLTextAreaElement>
        }
      />
    </div>
  );
}
