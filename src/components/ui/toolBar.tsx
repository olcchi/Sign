"use client";

import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  Baseline,
  Image as ImageIcon,
  EyeOff,
  Eye,
  MoveHorizontal,
  MoveVertical,
} from "lucide-react";
import TextEditor from "@/components/ui/textEditor";
import { Slider } from "@/components/ui/inputs/slider";
import { Button } from "@/components/ui/button/button";
import { SettingItem } from "@/components/ui/settings/SettingItem";
import { OptionButtonGroup } from "@/components/ui/settings/OptionButtonGroup";
import { PresetManager, Preset } from "@/components/ui/settings/PresetManager";
import Image from "next/image";

const colorOptions = [
  {
    name: "Default",
    value: "#ffffff",
    bg: "bg-white",
    textColor: "text-[#ffffff]",
  },
  {
    name: "Blue",
    value: "#04449C",
    bg: "bg-[#04449C]",
    textColor: "text-[#04449C]",
  },
];

const toolBarPosition = {
  sm: "w-[80vw] top-16 right-4 h-fit max-h-[70vh]",
  md: "md:w-[40vw] md:top-4 md:right-16 md:h-[90vh] md:max-h-[90dvh]",
  lg: "lg:w-100 lg:top-16 lg:right-4 lg:h-fit",
};

const fontOptions = [
  { name: "等线", value: "var(--font-geist-sans)" },
  { name: "手写", value: "var(--font-kolker-brush)" },
  { name: "衬线", value: "var(--font-dm-serif-text)" },
];

const fontSizeOptions = [
  { name: "S", value: "5rem" },
  { name: "M", value: "8rem" },
  { name: "L", value: "10rem" },
  { name: "XL", value: "16rem" },
];

const transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.25,
};

interface ToolBarProps {
  text: string;
  onTextChange: (text: string) => void;
  textColor: string;
  onColorChange: (color: string) => void;
  fontFamily: string;
  onFontChange: (font: string) => void;
  fontSize: string;
  onFontSizeChange: (size: string) => void;
  scrollSpeed: number;
  onScrollSpeedChange: (speed: number) => void;
  isTextScrolling: boolean;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  backgroundImage: string | null;
  onBackgroundImageChange: (imageUrl: string | null) => void;
  overlayEnabled: boolean;
  onOverlayEnabledChange: (enabled: boolean) => void;
  backgroundPosition?: { x: number; y: number };
  onBackgroundPositionChange?: (position: { x: number; y: number }) => void;
}

export default function ToolBar({
  text,
  onTextChange,
  textColor,
  onColorChange,
  fontFamily,
  onFontChange,
  fontSize,
  onFontSizeChange,
  scrollSpeed,
  onScrollSpeedChange,
  isTextScrolling,
  backgroundColor,
  onBackgroundColorChange,
  backgroundImage,
  onBackgroundImageChange,
  overlayEnabled,
  onOverlayEnabledChange,
  backgroundPosition = { x: 50, y: 50 },
  onBackgroundPositionChange = () => {},
}: ToolBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "text" | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [inputText, setInputText] = useState(text);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState(true);
  const [imageSize, setImageSize] = useState<{ width: number, height: number } | null>(null);
  const [containerSize, setContainerSize] = useState<{ width: number, height: number } | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleUserInteraction = () => {
      setIsActive(true);

      clearTimeout(timeoutId);

      if (isOpen || editMode) return;

      timeoutId = setTimeout(() => {
        setIsActive(false);
      }, 3000);
    };

    handleUserInteraction();

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      window.addEventListener(event, handleUserInteraction);
    });

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [isOpen, editMode]);

  useEffect(() => {
    setInputText(text);
  }, [text]);

  useEffect(() => {
    if (backgroundImage) {
      const img = new window.Image();
      img.onload = () => {
        setImageSize({
          width: img.width,
          height: img.height
        });
      };
      img.src = backgroundImage;
    } else {
      setImageSize(null);
    }
  }, [backgroundImage]);

  useEffect(() => {
    if (previewContainerRef.current && backgroundImage) {
      const updateContainerSize = () => {
        const container = previewContainerRef.current;
        if (container) {
          setContainerSize({
            width: container.clientWidth,
            height: container.clientHeight
          });
        }
      };

      updateContainerSize();
      window.addEventListener('resize', updateContainerSize);
      
      window.addEventListener('orientationchange', () => {
        setTimeout(updateContainerSize, 100);
      });
      
      return () => {
        window.removeEventListener('resize', updateContainerSize);
        window.removeEventListener('orientationchange', updateContainerSize);
      };
    }
  }, [backgroundImage, isOpen]);

  const getSliderDisabledState = () => {
    if (!imageSize) return { x: false, y: false };
    
    // 考虑窗口的宽高，而不是预览容器
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const imageRatio = imageSize.width / imageSize.height;
    const windowRatio = windowWidth / windowHeight;
    
    // 判断图片是否在某个方向上小于或等于窗口尺寸
    return {
      x: imageRatio <= windowRatio, // 高度方向溢出（左右可以滑动）
      y: imageRatio >= windowRatio  // 宽度方向溢出（上下可以滑动）
    };
  };
  
  const sliderDisabled = getSliderDisabledState();

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
    onTextChange(finalText);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onBackgroundImageChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removeBackgroundImage = () => {
    onBackgroundImageChange(null);
  };

  const loadPreset = (preset: Preset) => {
    onTextChange(preset.text);
    onColorChange(preset.textColor);
    onFontChange(preset.fontFamily);
    onFontSizeChange(preset.fontSize);
    onScrollSpeedChange(preset.scrollSpeed);
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number[]) => {
    const newPosition = { ...backgroundPosition };
    newPosition[axis] = value[0];
    onBackgroundPositionChange(newPosition);
  };

  const toolbarItems = [
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

  const settingItems = [
    {
      id: "content",
      title: "内容",
      component: (
        <button
          onClick={enterEditMode}
          className="w-full text-left px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-md text-zinc-200 text-sm transition-colors"
        >
          {text.length > 30 ? text.substring(0, 30) + "..." : text}
        </button>
      ),
    },
    {
      id: "fontSize",
      title: "字体尺寸",
      component: (
        <OptionButtonGroup
          options={fontSizeOptions}
          selectedValue={fontSize}
          onChange={onFontSizeChange}
        />
      ),
    },
    {
      id: "textColor",
      title: "字体颜色",
      component: (
        <OptionButtonGroup
          options={colorOptions}
          selectedValue={textColor}
          onChange={onColorChange}
          buttonSize="icon"
          renderOption={(option) => (
            <Baseline className={cn(option.textColor)} size="12" />
          )}
        />
      ),
    },
    {
      id: "fontFamily",
      title: "字体样式",
      component: (
        <OptionButtonGroup
          options={fontOptions}
          selectedValue={fontFamily}
          onChange={onFontChange}
        />
      ),
    },
    {
      id: "scrollSpeed",
      title: "滚动速度",
      component: (
        <div className="">
          <Slider
            defaultValue={[scrollSpeed]}
            value={[scrollSpeed]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => onScrollSpeedChange(value[0])}
            disabled={!isTextScrolling}
            className="w-full"
          />
        </div>
      ),
    },
    {
      id: "backgroundImage",
      title: "背景图片",
      component: (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex gap-2">
            <Button
              onClick={triggerFileUpload}
              className={cn(
                backgroundImage
                  ? "bg-zinc-800 text-zinc-100"
                  : "bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300",
                "bg-zinc-900 flex items-center gap-1 text-xs hover:bg-zinc-800"
              )}
              size="sm"
            >
              <ImageIcon size={14} />
              上传图片
            </Button>
            {backgroundImage && (
              <div className=" flex items-center justify-between  gap-2">
                <Button
                  variant="destructive"
                  onClick={removeBackgroundImage}
                  size="sm"
                  className="text-xs hover:bg-red-400"
                >
                  移除图片
                </Button>
              </div>
            )}
          </div>
          {backgroundImage && (
            <>
              <div 
                className="mt-2 relative w-full h-20 rounded-md overflow-hidden"
                ref={previewContainerRef}
              >
                <Image
                  src={backgroundImage}
                  quality={80}
                  alt="背景预览"
                  fill
                  sizes="100px"
                  style={{
                    objectFit: "cover",
                    // objectPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`
                  }}
                />
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <MoveHorizontal size={14} className={cn("text-zinc-400", sliderDisabled.x && "text-zinc-600")} />
                  <Slider
                    defaultValue={[backgroundPosition.x]}
                    value={[backgroundPosition.x]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handlePositionChange('x', value)}
                    className="w-full"
                    disabled={sliderDisabled.x}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <MoveVertical size={14} className={cn("text-zinc-400", sliderDisabled.y && "text-zinc-600")} />
                  <Slider
                    defaultValue={[backgroundPosition.y]}
                    value={[backgroundPosition.y]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handlePositionChange('y', value)}
                    className="w-full"
                    disabled={sliderDisabled.y}
                  />
                </div>
              </div>
              <Button
                size="sm"
                className="bg-zinc-900 hover:bg-zinc-800 px-2 flex items-center gap-1 text-xs"
                onClick={() => onOverlayEnabledChange(!overlayEnabled)}
              >
                {overlayEnabled ? (
                  <>
                    <Eye size={12} />
                  </>
                ) : (
                  <>
                    <EyeOff size={12} />
                  </>
                )}
                弱化背景
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <MotionConfig transition={transition}>
      <div
        className={cn(
          "fixed top-4 right-4 z-10",
          "transition-opacity duration-300",
          isActive || isOpen ? "opacity-100" : "opacity-10 hover:opacity-100"
        )}
        ref={menuRef}
      >
        <div className="flex space-x-2">
          {toolbarItems.map((item) => (
            <div
              key={item.id}
              className={cn("w-10 h-10 flex justify-center items-center")}
            >
              <Button
                variant="ghost"
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
              "fixed z-10 rounded-md border border-zinc-800 bg-zinc-950 backdrop-blur-md shadow-lg overflow-hidden overflow-y-auto"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="px-4 pb-4 select-none ">
              <div className="w-full flex justify-between items-center sticky top-0 z-999 bg-zinc-950 pb-4 pt-4 border-b border-zinc-800">
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
                {settingItems.map((item) => (
                  <SettingItem key={item.id} title={item.title}>
                    {item.component}
                  </SettingItem>
                ))}

                <PresetManager
                  text={text}
                  textColor={textColor}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  scrollSpeed={scrollSpeed}
                  backgroundImage={backgroundImage}
                  onLoadPreset={loadPreset}
                />
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
        onColorChange={onColorChange}
        textInputRef={textInputRef as React.RefObject<HTMLTextAreaElement>}
        scrollSpeed={scrollSpeed}
        onScrollSpeedChange={onScrollSpeedChange}
      />
    </MotionConfig>
  );
}
