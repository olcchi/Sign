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
}

export const ScrollingTextScroller: React.FC<ScrollingTextScrollerProps> = ({
  textWidth,
  TEXT_GAP,
  animationDuration,
  textStyle,
  editableText,
  textRef,
  shinyTextEnabled = false,
  textColor,
}) => {
  // Determine text classes based on shiny effect being enabled
  const textClasses = cn(
    "whitespace-nowrap inline-block select-none",
    shinyTextEnabled && "shiny-text"
  );

  // check if the text is white
  const isWhiteText = textColor.toLowerCase() === '#ffffff' || 
                     textColor.toLowerCase() === 'white' ||
                     textColor.toLowerCase() === 'rgb(255, 255, 255)';

  return (
    <motion.div
      className="flex whitespace-nowrap"
      key={animationDuration}
      style={{ ...textStyle, gap: `${TEXT_GAP}px` }}
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
        className={textClasses}
        data-text={editableText}
        data-white-text={isWhiteText.toString()}
      >
        {editableText}
      </div>
      <div 
        className={textClasses}
        data-text={editableText}
        data-white-text={isWhiteText.toString()}
      >
        {editableText}
      </div>
    </motion.div>
  );
};