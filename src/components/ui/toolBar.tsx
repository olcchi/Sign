"use client";

import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import TextEditor from "@/components/ui/textEditor";
import { Button } from "@/components/ui/button/button";
import { SettingItem } from "@/components/ui/settings/SettingItem";

import { PresetManager, Preset } from "@/components/ui/settings/PresetManager";
import { getSettingItems } from "@/components/ui/settings/ToolBarSettings";

const colorOptions = [
  {
    name: "GOFUN",
    value: "#FFFFFB",
    bg: "bg-[#FFFFFB]",
    textColor: "text-[#FFFFFB]",
  },
  {
    name: "RURIKON",
    value: "#0B346E",
    bg: "bg-[#0B346E]",
    textColor: "text-[#0B346E]",
  },
  {
    name: "KOHAKU",
    value: "#CA7A2C",
    bg: "bg-[#CA7A2C]",
    textColor: "text-[#CA7A2C]",
  },
  {
    name: "FUJI",
    value: "#8B81C3",
    bg: "bg-[#8B81C3]",
    textColor: "text-[#8B81C3]",
  },
  {
    name: "SYOJYOHI",
    value: "#CC543A",
    bg: "bg-[#CC543A]",
    textColor: "text-[#CC543A]",
  },
];

const toolBarPosition = {
  sm: "w-[80vw] top-16 right-4 h-fit max-h-[70vh]",
  md: "md:w-[40vw] md:top-4 md:right-16 md:h-[90vh] md:max-h-[90dvh]",
  lg: "lg:w-100 lg:top-16 lg:right-4 lg:h-fit",
};

const fontOptions = [
  {
    name: "Sans",
    value: "var(--font-geist-sans)",
    fontFamily: "text-[var(--font-geist-sans)]",
  },
  // {
  //   name: "Brush",
  //   value: "var(--font-kolker-brush)",
  //   fontFamily: "text-[var(--font-kolker-brush)]",
  // },
  {
    name: "Serif",
    value: "var(--font-dm-serif-text)",
    fontFamily: "text-[var(--font-dm-serif-text)]",
  },
];

const fontSizeOptions = [
  { name: "S", value: "5rem" },
  { name: "M", value: "8rem" },
  { name: "L", value: "10rem" },
  { name: "XL", value: "16rem" },
];

// Image processing configuration
const PREVIEW_IMAGE_QUALITY = 0.3;
const BACKGROUND_IMAGE_QUALITY = 0.9;

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
  backgroundZoom?: number;
  onBackgroundZoomChange?: (zoom: number) => void;
  edgeBlurEnabled?: boolean;
  onEdgeBlurEnabledChange?: (enabled: boolean) => void;
  edgeBlurIntensity?: number;
  onEdgeBlurIntensityChange?: (intensity: number) => void;
  shinyTextEnabled?: boolean;
  onShinyTextEnabledChange?: (enabled: boolean) => void;
  noiseEnabled?: boolean;
  onNoiseEnabledChange?: (enabled: boolean) => void;
  noiseOpacity?: number;
  onNoiseOpacityChange?: (opacity: number) => void;
  noiseDensity?: number;
  onNoiseDensityChange?: (density: number) => void;
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
  backgroundZoom = 1,
  onBackgroundZoomChange = () => {},
  edgeBlurEnabled = false,
  onEdgeBlurEnabledChange = () => {},
  edgeBlurIntensity = 5,
  onEdgeBlurIntensityChange = () => {},
  shinyTextEnabled = false,
  onShinyTextEnabledChange = () => {},
  noiseEnabled = false,
  onNoiseEnabledChange = () => {},
  noiseOpacity = 0.5,
  onNoiseOpacityChange = () => {},
  noiseDensity = 0.5,
  onNoiseDensityChange = () => {},
}: ToolBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "text" | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [inputText, setInputText] = useState(text);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState(true);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
          height: img.height,
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
            height: container.clientHeight,
          });
        }
      };

      updateContainerSize();
      window.addEventListener("resize", updateContainerSize);

      window.addEventListener("orientationchange", () => {
        setTimeout(updateContainerSize, 100);
      });

      return () => {
        window.removeEventListener("resize", updateContainerSize);
        window.removeEventListener("orientationchange", updateContainerSize);
      };
    }
  }, [backgroundImage, isOpen]);

  const getSliderDisabledState = () => {
    if (typeof window === "undefined") {
      // Default to disabled on the server
      return { x: true, y: true };
    }
    if (!imageSize) return { x: false, y: false }; // Should be true if no image? Or this implies it won't be shown

    // Consider window dimensions instead of the preview container
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const imageRatio = imageSize.width / imageSize.height;
    const windowRatio = windowWidth / windowHeight;

    // Determine if the image is smaller than or equal to the window size in a particular direction
    return {
      x: imageRatio <= windowRatio, // Height overflow (can slide left-right)
      y: imageRatio >= windowRatio, // Width overflow (can slide up-down)
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
    const finalText =
      inputText.trim() === "" ? "Please enter some content..." : inputText;
    onTextChange(finalText);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create object URL for the file
    const objectUrl = URL.createObjectURL(file);

    // Load image to get dimensions and process it
    const img = document.createElement("img");
    img.onload = () => {
      // Set image size for slider calculations
      setImageSize({
        width: img.width,
        height: img.height,
      });

      // Create canvas to process images
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0);

        // Convert to data URL with high quality for background
        const backgroundDataUrl = canvas.toDataURL(
          "image/jpeg",
          BACKGROUND_IMAGE_QUALITY
        );

        // Create a lower quality version for preview
        const previewDataUrl = canvas.toDataURL(
          "image/jpeg",
          PREVIEW_IMAGE_QUALITY
        );

        // Set the processed image for background
        onBackgroundImageChange(backgroundDataUrl);

        // Store preview image URL in state for the preview component
        setPreviewImage(previewDataUrl);
      } else {
        // Fallback if canvas context is not available
        onBackgroundImageChange(objectUrl);
        setPreviewImage(objectUrl);
      }
    };

    img.onerror = () => {
      // Fallback for image loading error
      console.error("Error loading image");
      URL.revokeObjectURL(objectUrl);
    };

    // Set src to start loading
    img.src = objectUrl;
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
    onEdgeBlurEnabledChange(preset.edgeBlurEnabled);
    onEdgeBlurIntensityChange(preset.edgeBlurIntensity);
    onShinyTextEnabledChange(preset.shinyTextEnabled);
    
    // 处理噪点效果相关设置
    if (preset.noiseEnabled !== undefined) {
      onNoiseEnabledChange(preset.noiseEnabled);
    }
    if (preset.noiseOpacity !== undefined) {
      onNoiseOpacityChange(preset.noiseOpacity);
    }
    if (preset.noiseDensity !== undefined) {
      onNoiseDensityChange(preset.noiseDensity);
    }
  };

  const handlePositionChange = (axis: "x" | "y", value: number[]) => {
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

  const settingItems = getSettingItems({
    text,
    enterEditMode,
    fontSize,
    onFontSizeChange,
    textColor,
    onColorChange,
    fontFamily,
    onFontChange,
    scrollSpeed,
    onScrollSpeedChange,
    backgroundImage,
    triggerFileUpload,
    removeBackgroundImage,
    previewImage,
    previewContainerRef,
    backgroundPosition,
    handlePositionChange,
    sliderDisabled,
    backgroundZoom,
    onBackgroundZoomChange,
    overlayEnabled,
    onOverlayEnabledChange,
    edgeBlurEnabled,
    onEdgeBlurEnabledChange,
    edgeBlurIntensity,
    onEdgeBlurIntensityChange,
    shinyTextEnabled,
    onShinyTextEnabledChange,
    fileInputRef,
    handleFileChange,
    colorOptions,
    fontOptions,
    fontSizeOptions,
    noiseEnabled,
    onNoiseEnabledChange,
    noiseOpacity,
    onNoiseOpacityChange,
    noiseDensity,
    onNoiseDensityChange,
  });

  return (
    <MotionConfig transition={transition}>
      <div
        className={cn(
          "fixed top-4 right-4",
          "transition-opacity duration-300",
          isActive || isOpen ? "opacity-100" : "opacity-10 hover:opacity-100"
        )}
        style={{ zIndex: 999 }}
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
              "fixed rounded-md border border-zinc-800 bg-zinc-950/80 backdrop-blur-2xl shadow-lg overflow-hidden overflow-y-auto custom-scrollbar"
            )}
            style={{ zIndex: 999 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="sticky top-0 z-888 w-full bg-zinc-950/90 backdrop-blur-xs border-b border-zinc-800">
              <div className="px-4 py-4 flex justify-between items-center">
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
            </div>
            <div className="px-4 pb-4 select-none">
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
                  edgeBlurEnabled={edgeBlurEnabled}
                  edgeBlurIntensity={edgeBlurIntensity}
                  shinyTextEnabled={shinyTextEnabled}
                  noiseEnabled={noiseEnabled}
                  noiseOpacity={noiseOpacity}
                  noiseDensity={noiseDensity}
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
