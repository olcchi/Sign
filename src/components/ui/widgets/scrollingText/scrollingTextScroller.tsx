import React from "react";
import { motion } from "motion/react";
import "./scrollingTextScroller.css";
interface ScrollingTextScrollerProps {
  textWidth: number;
  TEXT_GAP: number;
  animationDuration: number;
  textStyle: React.CSSProperties;
  editableText: string;
  textRef: React.RefObject<HTMLDivElement>;
}

export const ScrollingTextScroller: React.FC<ScrollingTextScrollerProps> = ({
  textWidth,
  TEXT_GAP,
  animationDuration,
  textStyle,
  editableText,
  textRef,
}) => {
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
        className="whitespace-nowrap inline-block select-none"
      >
        {editableText}
      </div>
      <div className="whitespace-nowrap inline-block select-none">
        {editableText}
      </div>
    </motion.div>
  );
};