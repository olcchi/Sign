"use client";
import { motion } from "motion/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronRight, Type } from "lucide-react";
import useClickOutside from "@/lib/hooks/useClickOutside";
import { useEditMode } from "./useEditMode";

type EditWrapperProps = {
  children: React.ReactNode;
  onEditStart?: () => void;
  onEditEnd?: () => void;
  elementRef?: React.RefObject<HTMLDivElement | null>;
};

const PRESET_SIZES = [
  { width: "240px", height: "240px" },
  { width: "320px", height: "320px" },
  { width: "480px", height: "480px" },
];

export function EditWrapper({
  children,
  onEditStart,
  onEditEnd,
  elementRef,
}: EditWrapperProps) {
  const { isEditing, startEditing, cancelEditing, exitEditMode } = useEditMode(
    onEditStart,
    onEditEnd
  );
  const [toolbarPosition, setToolbarPosition] = useState<"top" | "bottom">(
    "top"
  );
  const [isResizing, setIsResizing] = useState(false);
  const [currentSizeIndex, setCurrentSizeIndex] = useState(1);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useClickOutside(wrapperRef as React.RefObject<HTMLElement>, () => {
    if (isEditing) {
      exitEditMode();
    }
  });

  const calculatePosition = useCallback(() => {
    if (!wrapperRef.current || !elementRef?.current) return;

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const parentRect = elementRef.current.getBoundingClientRect();
    const spaceAbove = wrapperRect.top - parentRect.top;

    setToolbarPosition(spaceAbove < 300 ? "bottom" : "top");
  }, [elementRef]);

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsResizing(true);

    if ("touches" in e) {
      lastMousePos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else {
      lastMousePos.current = {
        x: e.clientX,
        y: e.clientY,
      };
    }
  };

  const handleResize = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isResizing) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - lastMousePos.current.x;

      const isTouchDevice = "touches" in e;

      const threshold = isTouchDevice ? 50 : 200;

      if (Math.abs(deltaX) > threshold) {
        const steps = Math.min(Math.floor(Math.abs(deltaX) / threshold), 1);

        if (deltaX > 0 && currentSizeIndex < PRESET_SIZES.length - 1) {
          setCurrentSizeIndex((prev) =>
            Math.min(prev + steps, PRESET_SIZES.length - 1)
          );
        } else if (deltaX < 0 && currentSizeIndex > 0) {
          setCurrentSizeIndex((prev) => Math.max(prev - steps, 0));
        }

        lastMousePos.current = {
          x: clientX,
          y: "touches" in e ? e.touches[0].clientY : e.clientY,
        };

        if (isTouchDevice && e.cancelable) {
          e.preventDefault();
        }
      }
    },
    [isResizing, currentSizeIndex]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isEditing) {
      calculatePosition();
      window.addEventListener("resize", calculatePosition);
    }
    return () => window.removeEventListener("resize", calculatePosition);
  }, [isEditing, calculatePosition]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("touchmove", handleResize);
      window.addEventListener("mouseup", handleResizeEnd);
      window.addEventListener("touchend", handleResizeEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("touchmove", handleResize);
      window.removeEventListener("mouseup", handleResizeEnd);
      window.removeEventListener("touchend", handleResizeEnd);
    };
  }, [isResizing, handleResize, handleResizeEnd]);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isResizing) {
      startEditing();
    }
  };

  const handleInteractionEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isResizing) {
      cancelEditing();
    }
  };

  return (
    <motion.div
      ref={wrapperRef}
      drag={!isResizing}
      dragMomentum={false}
      dragConstraints={elementRef}
      className="relative flex justify-center h-fit w-fit items-center touch-none select-none p-10 rounded-lg cursor-move"
      animate={{
        ...(isEditing
          ? { scale: 0.9, backgroundColor: "rgba(24, 24, 27,0.8)" }
          : { scale: 1 }),
        width: PRESET_SIZES[currentSizeIndex].width,
        height: PRESET_SIZES[currentSizeIndex].height,
      }}
      transition={{
        width: { type: "spring", stiffness: 300, damping: 30 },
        height: { type: "spring", stiffness: 300, damping: 30 },
        scale: { type: "spring", stiffness: 300, damping: 25 },
      }}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
    >
      {children}
      {isEditing && (
        <motion.div
          className="absolute right-0 bottom-0 rotate-45 cursor-se-resize"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
        >
          <ChevronRight size={32} color="white" />
        </motion.div>
      )}
    </motion.div>
  );
}
