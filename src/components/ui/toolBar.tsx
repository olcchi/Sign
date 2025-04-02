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
            "rounded-sm w-10 h-10 flex justify-center items-center border border-zinc-800 backdrop-blur-sm shadow-lg",
          )}
        >
          <div className="w-full h-full">
            {ITEMS.map((item) => (
              <button
                key={item.id}
                aria-label={item.label}
                className={cn(
                  "w-full h-full relative flex select-none appearance-none items-center justify-center text-zinc-300"
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
            className="fixed landscape:bottom-4 landscape:right-16 bottom-16 right-4 z-10 w-64 landscape:w-[50%] landscape:h-[90%] h-[60%] rounded-sm border border-zinc-800 bg-black shadow-lg"
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
