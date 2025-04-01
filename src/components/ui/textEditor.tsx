import { AnimatePresence, motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
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
}: TextEditorProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y:5,filter: "blur(8px)" }}
          animate={{ opacity: 1, y:0,filter: "blur(0px)" }}
          exit={{ opacity: 0,y:-5, filter: "blur(8px)" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed inset-0 z-10 w-screen h-screen flex justify-center lg:items-center font-sans! bg-black"
        >
          <Card className=" w-80 xl:w-100 h-fit">
            <CardHeader>
              <CardTitle>编辑</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                ref={textInputRef}
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                onKeyDown={(e) => e.ctrlKey && e.key === "Enter" && onSubmit()}
                className={cn("h-40! font-bold")}
                style={{ color: textColor }}
              />
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => onColorChange(color.value)}
                      className={`w-4 h-4 rounded-full ${
                        color.bg
                      } border-1 flex items-center justify-center transition-all ${
                        textColor === color.value
                          ? "border-zinc-200 scale-110"
                          : "border-transparent"
                      }`}
                      title={color.name}
                    ></button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="gap-2 flex-end">
              <Button onClick={onClose} className="" size="sm">
                取消
              </Button>
              <Button onClick={onSubmit} className="grow bg-zinc-100 hover:bg-zinc-50 text-black w-24" size="sm">
                提交
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
