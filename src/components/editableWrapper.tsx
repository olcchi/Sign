"use client";
import { motion } from "motion/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronRight, Type } from "lucide-react";
import useClickOutside from "./ui/useClickOutside";
import { Toggle } from "@/components/ui/toggle";
type EditWrapperProps = {
  children: React.ReactNode;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  elementRef?: React.RefObject<HTMLDivElement | null>;
};

export function EditWrapper({
  children,
  onEditStart,
  onEditEnd,
  elementRef,
}: EditWrapperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<"top" | "bottom">(
    "top"
  );
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  useClickOutside(wrapperRef, () => {
    if (isEditing) {
      exitEditMode();
    }
  });
  const calculatePosition = useCallback(() => {
    if (!wrapperRef.current || !elementRef?.current) return;

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const parentRect = elementRef.current.getBoundingClientRect();
    const spaceAbove = wrapperRect.top - parentRect.top;

    setToolbarPosition(spaceAbove < 100 ? "bottom" : "top");
  }, [elementRef]);

  useEffect(() => {
    if (isEditing) {
      calculatePosition();
      window.addEventListener("resize", calculatePosition);
    }
    return () => window.removeEventListener("resize", calculatePosition);
  }, [isEditing, calculatePosition]);
  const handleTouchStart = useCallback(() => {
    pressTimer.current = setTimeout(() => {
      setIsEditing(true);
      onEditStart?.();
    }, 100);
  }, [onEditStart]);
  const exitEditMode = useCallback(() => {
    setIsEditing(false);
    onEditEnd?.();
  }, [onEditEnd]);
  return (
    <motion.div
      ref={wrapperRef}
      drag
      dragMomentum={false}
      dragConstraints={elementRef}
      className="relative touch-none select-none p-10 rounded-lg"
      onTouchStart={handleTouchStart}
      animate={isEditing ? "editing" : "normal"}
      variants={{
        normal: { scale: 1 },
        editing: { scale: 0.9, backgroundColor: "rgba(24, 24, 27,0.8)" },
      }}
    >
      {children}
      {isEditing && (
        <motion.div
          className="absolute right-0 bottom-0 rotate-45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ChevronRight size={32} color="white" />
        </motion.div>
      )}
      {isEditing && (
        <motion.div
          className={`absolute ${
            toolbarPosition === "top" ? "-top-15" : "-bottom-15"
          }`}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className="w-64 h-12 flex gap-2 p-1 items-center bg-zinc-800 rounded-md">
            <Toggle>
              <Type />
            </Toggle>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
