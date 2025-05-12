import React from "react";
import { motion } from "motion/react";
import "./scrollingTextScroller.css";
import { cn } from "@/lib/utils";

interface ScrollingTextScrollerProps {
  textWidth: number;
  TEXT_GAP: number;
  animationDuration: number;
  textStyle: React.CSSProperties;
  editableText: string;
  textRef: React.RefObject<HTMLDivElement>;
  shinyTextEnabled?: boolean;
  textColor: string;
  textStrokeEnabled?: boolean;
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textFillEnabled?: boolean;
}

// Implements the infinite scrolling animation for text that exceeds container width
export const ScrollingTextScroller: React.FC<ScrollingTextScrollerProps> = ({
  textWidth,
  TEXT_GAP,
  animationDuration,
  textStyle,
  editableText,
  textRef,
  shinyTextEnabled = false,
  textColor,
  textStrokeEnabled = true,
  textStrokeWidth = 1,
  textStrokeColor = "#000000",
  textFillEnabled = true,
}) => {
  // 确保文字填充和描边至少有一个是启用的
  const combinedTextStyle = {
    ...textStyle,
    gap: `${TEXT_GAP}px`,
  };

  // Apply shiny text effect when enabled
  const textClasses = cn(
    "whitespace-nowrap inline-block select-none",
    shinyTextEnabled && "shiny-text"
  );

  // Detect white text to apply the appropriate shiny effect variant
  const isWhiteText = textColor.toLowerCase() === '#ffffff' || 
                     textColor.toLowerCase() === 'white' ||
                     textColor.toLowerCase() === 'rgb(255, 255, 255)';

  return (
    <motion.div
      className="flex whitespace-nowrap"
      key={animationDuration}
      style={combinedTextStyle}
      // Create horizontal scrolling animation that continuously moves from right to left
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
      {/* First instance of text, initially visible */}
      <div
        ref={textRef}
        className={textClasses}
        style={textStyle}
        data-text={editableText}
        data-white-text={isWhiteText.toString()}
      >
        {editableText}
      </div>
      {/* Duplicate text instance to create seamless looping effect */}
      <div 
        className={textClasses}
        style={textStyle}
        data-text={editableText}
        data-white-text={isWhiteText.toString()}
      >
        {editableText}
      </div>
    </motion.div>
  );
};