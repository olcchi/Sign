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
import React from "react";

interface TextEditorProps {
  show: boolean;
  text: string;
  onTextChange: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  textInputRef?: React.RefObject<HTMLTextAreaElement>;
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
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.4, ease: "easeIn" }}
          className="absolute inset-0 z-10 w-full h-full flex justify-center lg:items-center font-sans! bg-black"
        >
          <Card className="mt-20 w-80 xl:w-100 h-fit">
            <CardHeader>
              <CardTitle>内容</CardTitle>
              <CardDescription>输入应援内容</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={textInputRef}
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                onKeyDown={(e) => e.ctrlKey && e.key === "Enter" && onSubmit()}
                className="h-40!"
              />
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button onClick={onClose} variant="secondary" size="sm">
                取消
              </Button>
              <Button onClick={onSubmit} variant="secondary" size="sm">
                提交
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
