import { AnimatePresence, motion } from "motion/react";
import { Textarea } from "@/components/ui/inputs/textarea";
import { Button } from "@/components/ui/button/button";
import { Separator } from "@/components/ui/layout/separator";
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
          initial={{ opacity: 0, y: 5, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -5, filter: "blur(8px)" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative w-full h-full flex items-center justify-center bg-black/80"
          >
            <div className="absolute top-20 w-80 border-1 border-zinc-800 p-2 shadow-xl rounded-lg">
              <div className=" flex gap-2">
                <Textarea
                  ref={textInputRef}
                  value={text}
                  onChange={(e) => onTextChange(e.target.value)}
                  onKeyDown={(e) =>
                    e.ctrlKey && e.key === "Enter" && onSubmit()
                  }
                  className="h-fit flex-1 rounded-sm bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-xs"
                  placeholder="请输入文字内容..."
                  aria-label="编辑文本内容"
                />
                <div>
                <Separator orientation='vertical'/>
                </div>
                <div className="flex gap-1">
                <Button
                    onClick={onSubmit}
                    size='sm'
                    className="text-xs rounded-sm bg-zinc-100 hover:bg-white text-black"
                  >
                    保存
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    size="sm"
                    className="text-xs rounded-sm border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-300"
                  >
                    取消
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
