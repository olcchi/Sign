"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { Menu, X, Baseline } from "lucide-react";
import TextEditor from "@/components/ui/textEditor";
import { Slider } from "@/components/ui/inputs/slider";
import { Button } from "@/components/ui/button/button";
import { Separator } from "@/components/ui/layout/separator";
const colorOptions = [
  {
    name: "默认",
    value: "#ffffff",
    bg: "bg-white",
    textColor: "text-[#ffffff]",
  },
  {
    name: "蓝砖 蓝",
    value: "#04449C",
    bg: "bg-[#04449C]",
    textColor: "text-[#04449C]",
  },
];
const toolBarPosition = {
  sm: "w-fit top-16 right-4 h-fit",
  md: "md:top-4 md:right-16 md:h-[90vh]",
  lg: "w-100 lg:top-16 lg:right-4 lg:h-fit",
};
const fontOptions = [
  { name: "等线", value: "sans-serif" },
  { name: "手写", value: "var(--font-kolker-brush)" },
  { name: "衬线", value: "var(--font-dm-serif-text)" },
];

const fontSizeOptions = [
  { name: "M", value: "5rem" },
  { name: "L", value: "8rem" },
  { name: "XL", value: "10rem" },
];

const transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.25,
};

interface ToolBarProps {
  initialText?: string;
  onTextChange?: (text: string) => void;
  onColorChange?: (color: string) => void;
  onFontChange?: (font: string) => void;
  onFontSizeChange?: (size: string) => void;
  scrollSpeed?: number;
  onScrollSpeedChange?: (speed: number) => void;
  isTextScrolling?: boolean;
}

export default function ToolBar({
  initialText = "dt in the house",
  onTextChange,
  onColorChange,
  onFontChange,
  onFontSizeChange,
  scrollSpeed = 10,
  onScrollSpeedChange,
  isTextScrolling = false,
}: ToolBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "text" | null>(null);

  const [text, setText] = useState(initialText);
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [editMode, setEditMode] = useState(false);
  const [inputText, setInputText] = useState(text);
  const [fontSize, setFontSize] = useState("text-base");

  const menuRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (onTextChange) onTextChange(newText);
  };

  const handleColorChange = (newColor: string) => {
    setTextColor(newColor);
    if (onColorChange) onColorChange(newColor);
  };

  const handleFontChange = (newFont: string) => {
    setFontFamily(newFont);
    if (onFontChange) onFontChange(newFont);
  };

  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize);
    if (onFontSizeChange) onFontSizeChange(newSize);
  };

  const handleScrollSpeedChange = (value: number[]) => {
    if (onScrollSpeedChange) {
      onScrollSpeedChange(value[0]);
    }
  };

  const closePanel = () => {
    setIsOpen(false);
    setActiveTab(null);
  };
  const enterEditMode = () => {
    setEditMode(true);
    setInputText(text);
    closePanel();
    setTimeout(() => {
      textInputRef.current?.focus();
      textInputRef.current?.select();
    }, 10);
  };

  const exitEditMode = () => {
    setEditMode(false);
    const finalText = inputText.trim() === "" ? "请输入一些内容..." : inputText;
    handleTextChange(finalText);
  };

  const TOOLBAR_ITEMS = [
    {
      id: "menu",
      label: "菜单",
      icon: <Menu className="h-5 w-5" />,
      action: () => {
        if (activeTab === "menu") {
          closePanel();
        } else {
          setActiveTab("menu");
          setIsOpen(true);
        }
      },
    },
  ];

  return (
    <MotionConfig transition={transition}>
      <div className="fixed top-4 right-4 z-10" ref={menuRef}>
        <div className="flex space-x-2">
          {TOOLBAR_ITEMS.map((item) => (
            <div
              key={item.id}
              className={cn("w-10 h-10 flex justify-center items-center")}
            >
              <Button
                aria-label={item.label}
                className="w-full h-full flex select-none appearance-none items-center justify-center text-zinc-300 hover:text-zinc-100 transition-colors"
                type="button"
                onClick={item.action}
              >
                {item.icon}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={cardRef}
            className={cn(
              toolBarPosition.sm,
              toolBarPosition.md,
              toolBarPosition.lg,
              "fixed z-10 rounded-md border border-zinc-800 bg-black/90 backdrop-blur-md shadow-lg overflow-hidden landscape:overflow-y-auto"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="px-4 pb-4 select-none ">
              <div className="flex justify-between items-center sticky top-0 bg-black pb-4 pt-4 border-b border-zinc-800">
                <p className="text-zinc-200 text-sm select-none font-bold">
                  配置
                </p>
                <button
                  onClick={closePanel}
                  className="text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-zinc-300 text-sm font-medium select-none">
                      内容
                    </p>
                  </div>
                  <button
                    onClick={enterEditMode}
                    className="w-full text-left px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-md text-zinc-200 text-sm transition-colors"
                  >
                    {text.length > 30 ? text.substring(0, 30) + "..." : text}
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-zinc-300 text-sm font-medium select-none">
                      尺寸
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 py-2">
                    {fontSizeOptions.map((size) => (
                      <Button
                        size="sm"
                        key={size.value}
                        onClick={() => handleFontSizeChange(size.value)}
                        className={`px-3 py-1 rounded-md text-xs font-sans transition-colors ${
                          fontSize === size.value
                            ? "bg-zinc-800 text-zinc-100"
                            : "bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {size.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-zinc-300 text-sm font-medium select-none">
                      颜色
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 py-2">
                    {colorOptions.map((color) => (
                      <Button
                        size={"icon"}
                        key={color.value}
                        onClick={() => handleColorChange(color.value)}
                        title={color.name}
                        aria-label={color.name + " 颜色"}
                        className={`px-3 py-1 rounded-md text-xs font-sans transition-colors ${
                          textColor === color.value
                            ? "bg-zinc-800 text-zinc-100"
                            : "bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        <Baseline className={cn(color.textColor)} size="12" />
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-zinc-300 text-sm font-medium select-none">
                      字体样式
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 py-2">
                    {fontOptions.map((font) => (
                      <Button
                        size="sm"
                        key={font.value}
                        onClick={() => handleFontChange(font.value)}
                        className={`px-3 py-1 rounded-md text-xs font-sans transition-colors ${
                          fontFamily === font.value
                            ? "bg-zinc-800 text-zinc-100"
                            : "bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {font.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-zinc-300 text-sm font-medium select-none">
                      滚动速度
                    </p>
                  </div>
                  <Slider
                    defaultValue={[scrollSpeed]}
                    value={[scrollSpeed]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={handleScrollSpeedChange}
                    disabled={!isTextScrolling}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <TextEditor
        show={editMode}
        text={inputText}
        onTextChange={setInputText}
        onClose={() => setEditMode(false)}
        onSubmit={exitEditMode}
        textColor={textColor}
        onColorChange={handleColorChange}
        textInputRef={
          textInputRef as unknown as React.RefObject<HTMLTextAreaElement>
        }
        scrollSpeed={scrollSpeed}
        onScrollSpeedChange={onScrollSpeedChange}
      />
    </MotionConfig>
  );
}
