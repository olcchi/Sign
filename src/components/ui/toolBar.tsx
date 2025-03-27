"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

const transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.25,
};

const ITEMS = [
  {
    id: 1,
    label: "菜单",
    title: <Menu className="h-5 w-5" />,
    content: (
      <div className="flex flex-col space-y-4">
        <div className="text-zinc-200 text-sm">设置</div>
      </div>
    ),
  },
];

export default function ToolBar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  return (
    <MotionConfig transition={transition}>
      <div className="fixed bottom-4 right-4 z-10" ref={menuRef}>
        <div
          className={cn(
            "rounded-xl h-10 w-10 border border-zinc-700 backdrop-blur-sm shadow-lg",
            isOpen ? "bg-zinc-900 text-zinc-100" : ""
          )}
        >
          <div className="flex space-x-2 p-2">
            {ITEMS.map((item) => (
              <button
                key={item.id}
                aria-label={item.label}
                className={cn(
                  "relative flex h-full w-full shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-zinc-100 focus-visible:ring-2 active:scale-[0.98]"
                )}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={cardRef}
            className="fixed bottom-16 right-4 z-10 w-64 h-[60%] rounded-xl border border-zinc-700 bg-zinc-900/90 backdrop-blur-sm shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="p-4">{ITEMS[0].content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
