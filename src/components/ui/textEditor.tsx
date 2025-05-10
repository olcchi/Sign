import { AnimatePresence, motion } from "motion/react";
import { Textarea } from "@/components/ui/inputs/textarea";
import { Button } from "@/components/ui/button/button";
import React from "react";

interface TextEditorProps {
  show: boolean;
  text: string;
  onTextChange: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  textInputRef?: React.RefObject<HTMLTextAreaElement>;
  textColor?: string;
  onColorChange?: (color: string) => void;
  scrollSpeed?: number;
  onScrollSpeedChange?: (speed: number) => void;
}

export default function TextEditor({
  show,
  text,
  onTextChange,
  onClose,
  onSubmit,
  textInputRef,
}: TextEditorProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-2xl"
          // onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.15, type: "spring", bounce: 0.1 }}
            className="max-w-md w-[90vw] md:w-96 mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black/90 backdrop-blur-2xl border rounded-lg shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-zinc-200">内容</p>
              </div>

              <div className="p-3">
                <div className="h-32 w-full rounded-md bg-zinc-900/40 border border-zinc-900/40 focus-within:border-zinc-700 overflow-y-auto custom-scrollbar">
                  <Textarea
                    ref={textInputRef}
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                    onKeyDown={(e) => e.ctrlKey && e.key === "Enter" && onSubmit()}
                    className="h-auto w-full bg-transparent border-0 text-sm text-zinc-200 overflow-hidden resize-none"
                    placeholder="Enter text content..."
                    aria-label="Edit text content"
                    style={{
                      overflowY: 'hidden',
                    }}
                  />
                </div>
              </div>
              
              <div className="px-4 pb-3 bg-black flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  size="sm"
                  className="text-xs rounded-md border-zinc-800 bg-transparent hover:bg-zinc-800 text-zinc-300 px-3"
                >
                  取消
                </Button>
                <Button
                  onClick={onSubmit}
                  size="sm"
                  className="text-xs rounded-md bg-zinc-100 hover:bg-white text-black px-6 flex-grow md:flex-grow-0 flex-1!"
                >
                  提交
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
