import { AnimatePresence, motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards/card";
import { Textarea } from "@/components/ui/inputs/textarea";
import { Button } from "@/components/ui/button/button";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { X, Check, Type } from "lucide-react";
import {
  Slider,
} from "@/components/ui/inputs/slider";

// 预设颜色选项
const colorOptions = [
  { name: "默认", value: "#ffffff", bg: "bg-white" },
  { name: "i'm ok 红", value: "#B41D25", bg: "bg-[#B41D25]" },
  { name: "i'm ok 黄", value: "#FAE300", bg: "bg-[#FAE300]" },
  { name: "蓝砖 蓝", value: "#04449C", bg: "bg-[#04449C]" },
  { name: "黑色柳丁 橙", value: "#CB7F33", bg: "bg-[#CB7F33]" },
];
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
  textColor = "",
  onColorChange = () => {},
  scrollSpeed = 10,
  onScrollSpeedChange = () => {},
}: TextEditorProps) {

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 5, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -5, filter: "blur(8px)" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md mx-auto"
          >
            <Card className="border-zinc-800 bg-black/90 shadow-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-zinc-400" />
                    <CardTitle className="text-sm">编辑文本</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-zinc-400 hover:text-zinc-100" 
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">关闭</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  ref={textInputRef}
                  value={text}
                  onChange={(e) => onTextChange(e.target.value)}
                  onKeyDown={(e) => e.ctrlKey && e.key === "Enter" && onSubmit()}
                  className="h-40 font-bold bg-zinc-900/50 border-zinc-800 focus:border-zinc-700 text-lg resize-none"
                  placeholder="请输入文字内容..."
                  aria-label="编辑文本内容"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium text-zinc-400">滚动速度</h3>
                    <span className="text-xs text-zinc-500">{scrollSpeed}</span>
                  </div>
                  <Slider
                    defaultValue={[scrollSpeed]}
                    value={[scrollSpeed]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(values) => onScrollSpeedChange(values[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 px-1">
                    <span>慢</span>
                    <span>快</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  size="sm"
                  className=" border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-300"
                >
                  取消
                </Button>
                <Button 
                  onClick={onSubmit}
                  size="sm"
                  className=" flex-1 bg-zinc-100 hover:bg-white text-black"
                >
                  保存
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
