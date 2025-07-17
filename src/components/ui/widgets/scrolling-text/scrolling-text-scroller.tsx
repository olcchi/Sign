"use client";
import { motion } from "motion/react";
import "./scrolling-text-scroller.css";
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
  textGlowEnabled?: boolean;
  textGlowBlur?: number;
}

// Creates seamless infinite text scrolling with duplicated content
export const ScrollingTextScroller: React.FC<ScrollingTextScrollerProps> = ({
  textWidth,
  TEXT_GAP,
  animationDuration,
  textStyle,
  editableText,
  textRef,
  shinyTextEnabled = false,
  textColor,
  textGlowEnabled = false,
  textGlowBlur = 4,
}) => {
  // Add gap spacing to prevent visually abrupt transitions
  const combinedTextStyle = {
    ...textStyle,
    gap: `${TEXT_GAP}px`,
    // Force hardware acceleration for better performance
    transform: "translateZ(0)",
    willChange: "transform",
    backfaceVisibility: "hidden" as const,
  };

  // Apply shiny text effect when enabled
  const textClasses = cn(
    "whitespace-nowrap inline-block select-none",
    shinyTextEnabled && "shiny-text"
  );

  // Flag for white text to select appropriate visual effects
  const isWhiteText =
    textColor.toLowerCase() === "#ffffff" ||
    textColor.toLowerCase() === "white" ||
    textColor.toLowerCase() === "rgb(255, 255, 255)";

  return (
    <motion.div
      className="flex whitespace-nowrap"
      key={animationDuration}
      style={combinedTextStyle}
      // Infinite loop animation with precise positioning using translate3d
      animate={{
        transform: [
          `translate3d(0px, 0px, 0px)`,
          `translate3d(-${textWidth + TEXT_GAP}px, 0px, 0px)`
        ],
      }}
      transition={{
        transform: {
          repeat: Infinity,
          repeatType: "loop",
          duration: animationDuration,
          ease: "linear",
        },
      }}
    >
      {/* Referenced instance for width measurement */}
      <div
        ref={textRef}
        className={textClasses}
        style={textStyle}
        data-text={editableText}
        data-white-text={isWhiteText.toString()}
      >
        {editableText}
      </div>
      {/* Duplicate for seamless looping */}
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
