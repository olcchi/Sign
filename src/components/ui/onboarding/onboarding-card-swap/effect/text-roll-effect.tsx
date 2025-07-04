"use client";
import {
  motion,
  VariantLabels,
  Target,
  TargetAndTransition,
  Transition,
} from "motion/react";

export type TextRollProps = {
  children: string;
  duration?: number;
  getEnterDelay?: (index: number) => number;
  getExitDelay?: (index: number) => number;
  className?: string;
  transition?: Transition;
  variants?: {
    enter: {
      initial: Target | VariantLabels | boolean;
      animate: TargetAndTransition | VariantLabels;
    };
    exit: {
      initial: Target | VariantLabels | boolean;
      animate: TargetAndTransition | VariantLabels;
    };
  };
  onAnimationComplete?: () => void;
  infinite?: boolean;
  infiniteDelay?: number;
};

export function TextRoll({
  children,
  duration = 0.5,
  getEnterDelay = (i) => i * 0.1,
  getExitDelay = (i) => i * 0.1 + 0.2,
  className,
  transition = { ease: "easeIn" },
  variants,
  onAnimationComplete,
  infinite = false,
  infiniteDelay = 1,
}: TextRollProps) {
  const defaultVariants = {
    enter: {
      initial: { rotateX: 0 },
      animate: { rotateX: 90 },
    },
    exit: {
      initial: { rotateX: 90 },
      animate: { rotateX: 0 },
    },
  } as const;

  const letters = children.split("");

  return (
    <span className={className}>
      {letters.map((letter, i) => {
        return (
          <span
            key={i}
            className="relative inline-block [perspective:10000px] [transform-style:preserve-3d] [width:auto]"
            aria-hidden="true"
          >
            <motion.span
              className="absolute inline-block [backface-visibility:hidden] [transform-origin:50%_25%]"
              initial={
                variants?.enter?.initial ?? defaultVariants.enter.initial
              }
              animate={
                variants?.enter?.animate ?? defaultVariants.enter.animate
              }
              transition={{
                ...transition,
                duration,
                delay: getEnterDelay(i),
                repeat: infinite ? Infinity : 0,
                repeatDelay: infinite ? infiniteDelay : 0,
                repeatType: infinite ? "loop" : undefined,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
            <motion.span
              className="absolute inline-block [backface-visibility:hidden] [transform-origin:50%_100%]"
              initial={variants?.exit?.initial ?? defaultVariants.exit.initial}
              animate={variants?.exit?.animate ?? defaultVariants.exit.animate}
              transition={{
                ...transition,
                duration,
                delay: getExitDelay(i),
                repeat: infinite ? Infinity : 0,
                repeatDelay: infinite ? infiniteDelay : 0,
                repeatType: infinite ? "loop" : undefined,
              }}
              onAnimationComplete={
                letters.length === i + 1 && !infinite ? onAnimationComplete : undefined
              }
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
            <span className="invisible">
              {letter === " " ? "\u00A0" : letter}
            </span>
          </span>
        );
      })}
      <span className="sr-only">{children}</span>
    </span>
  );
}
