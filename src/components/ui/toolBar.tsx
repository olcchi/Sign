"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { Menu, Type, Palette, X, Clock } from "lucide-react";
import TextEditor from "@/components/ui/textEditor";
import { Slider } from "@/components/ui/inputs/slider";

const colorOptions = [
  { name: "默认", value: "#ffffff", bg: "bg-white" },
  // { name: "i'm ok 红", value: "#B41D25", bg: "bg-[#B41D25]" },
  // { name: "i'm ok 黄", value: "#FAE300", bg: "bg-[#FAE300]" },
  { name: "蓝砖 蓝", value: "#04449C", bg: "bg-[#04449C]" },
  // { name: "黑色柳丁 橙", value: "#CB7F33", bg: "bg-[#CB7F33]" },
];

const fontOptions = [
  { name: "Serif", value: "sans-serif" },
  { name: "KolKer Brush", value: "var(--font-kolker-brush)" },
  { name: "DM SANS", value: "var(--font-dm-serif-text)" },
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
  scrollSpeed?: number;
  onScrollSpeedChange?: (speed: number) => void;
}

export default function ToolBar({
  initialText = "dt in the house",
  onTextChange,
  onColorChange,
  onFontChange,
  scrollSpeed = 10,
  onScrollSpeedChange,
}: ToolBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "text" | null>(null);

  const [text, setText] = useState(initialText);
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [editMode, setEditMode] = useState(false);
  const [inputText, setInputText] = useState(text);

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

  const handleScrollSpeedChange = (value: number[]) => {
    if (onScrollSpeedChange) {
      onScrollSpeedChange(value[0]);
    }
  };

  const closePanel = () => {
    setIsOpen(false);
    setActiveTab(null); // 重置 activeTab
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
      <div className="fixed bottom-4 right-4 z-10" ref={menuRef}>
        <div className="flex space-x-2">
          {TOOLBAR_ITEMS.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-md w-10 h-10 flex justify-center items-center border",
                activeTab === item.id
                  ? "border-zinc-400 bg-zinc-800/50"
                  : "border-zinc-800 backdrop-blur-sm"
              )}
            >
              <button
                aria-label={item.label}
                className="w-full h-full flex select-none appearance-none items-center justify-center text-zinc-300 hover:text-zinc-100 transition-colors"
                type="button"
                onClick={item.action}
              >
                {item.icon}
              </button>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={cardRef}
            className="fixed landscape:bottom-4 landscape:right-16 bottom-16 right-4 z-10 w-64 landscape:w-[400px] rounded-md border border-zinc-800 bg-black/90 backdrop-blur-md shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-zinc-200 font-medium select-none">设置</h3>
                <button
                  onClick={closePanel}
                  className="text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Type size={14} className="text-zinc-400" />
                    <h4 className="text-zinc-300 text-sm font-medium select-none">
                      内容
                    </h4>
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
                    <Palette size={14} className="text-zinc-400" />
                    <h4 className="text-zinc-300 text-sm font-medium select-none">
                      颜色
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 px-3 py-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorChange(color.value)}
                        className={`w-6 h-6 rounded-full ${
                          color.bg
                        } border transition-all ${
                          textColor === color.value
                            ? "border-zinc-200 scale-110 shadow-md"
                            : "border-transparent"
                        }`}
                        title={color.name}
                        aria-label={color.name + " 颜色"}
                      ></button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Type size={14} className="text-zinc-400" />
                    <h4 className="text-zinc-300 text-sm font-medium select-none">
                      字体样式
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 px-3 py-2">
                    {fontOptions.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => handleFontChange(font.value)}
                        className={`px-3 py-1 rounded-md text-xs font-sans transition-colors ${
                          fontFamily === font.value
                            ? "bg-zinc-700 text-zinc-100"
                            : "bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-zinc-400" />
                    <h4 className="text-zinc-300 text-sm font-medium select-none">
                      滚动速度
                    </h4>
                  </div>
                  <div className="px-3 py-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">慢</span>
                      <span className="text-xs text-zinc-400">{scrollSpeed}</span>
                      <span className="text-xs text-zinc-400">快</span>
                    </div>
                    <Slider
                      defaultValue={[scrollSpeed]}
                      value={[scrollSpeed]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={handleScrollSpeedChange}
                      className="w-full"
                    />
                  </div>
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
