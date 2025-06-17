"use client";

import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/layout/button";
import { SettingItem } from "@/components/ui/settings/SettingItem";
import { PresetManager, Preset } from "@/components/ui/settings/Preset";
import { ToolBarSettings } from "@/components/ui/settings/ToolBarSettings";
import { PanelHeader } from "@/components/ui/settings/panel/PanelHeader";
import { PanelContent } from "@/components/ui/settings/panel/PanelContent";
import { useToolbarState } from "@/lib/hooks/useToolbarState";
import { Card } from "@/components/ui/layout/card";
import { Ellipsis, Maximize, Minimize, HelpCircle } from "lucide-react";
import { useFullScreenStore } from "@/stores/fullScreenStore";
import {
  colorOptions,
  fontOptions,
  fontSizeOptions,
} from "@/lib/settings-config";
import { useBackgroundImage } from "@/lib/hooks/useBackgroundImage";
import { usePresetManager } from "@/lib/hooks/usePresetManager";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Create motion variants of Card component
const MotionCard = motion.create(Card);

interface ToolBarProps {
  className?: string;
  onShowWelcome?: () => void;
}

// Main configuration toolbar component that manages all display settings UI
export default function ToolBar({ className, onShowWelcome }: ToolBarProps) {
  // Access settings from context
  const {
    textSettings,
    updateTextSettings,
    backgroundSettings,
    updateBackgroundSettings,
    effectsSettings,
    updateEffectsSettings,
  } = useSettings();

  // Track current active preset
  const [activePreset, setActivePreset] = useState<Preset | null>(null);

  // Fullscreen state
  const { isFull, setIsFull } = useFullScreenStore();

  // Using custom hooks to separate state and logic for improved maintainability
  const {
    isOpen,
    isActive,
    activeTab,
    openPanel,
    closePanel,
    handleImageChange,
  } = useToolbarState();

  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Handle background image functionality
  const {
    previewImage,
    sliderDisabled,
    handleFileChangeWrapped,
    triggerFileUpload,
    removeBackgroundImage,
    handlePositionChange,
  } = useBackgroundImage(
    backgroundSettings.backgroundImage,
    (imageUrl) => updateBackgroundSettings({ backgroundImage: imageUrl }),
    previewContainerRef as any,
    fileInputRef as any,
    handleImageChange,
    backgroundSettings.backgroundPosition,
    (position) => updateBackgroundSettings({ backgroundPosition: position }),
    isOpen
  );

  // Use unified preset manager
  const { loadPreset } = usePresetManager();

  // Fullscreen toggle function
  const toggleFullscreen = () => {
    if (isFull) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen failed:", err);
      });
    }
    setIsFull(!isFull);
  };

  // Toolbar menu item configuration
  const toolbarItems = [
    {
      id: "fullscreen",
      label: isFull ? "退出全屏" : "进入全屏",
      icon: isFull ? <Minimize size={20} color="#FFFFFB" /> : <Maximize size={20} color="#FFFFFB" />,
      action: toggleFullscreen,
    },
    {
      id: "help",
      label: "帮助",
      icon: <HelpCircle color="#FFFFFB" />,
      action: () => {
        onShowWelcome?.();
      },
    },
    {
      id: "menu",
      label: "菜单",
      icon: <Ellipsis color="#FFFFFB" />,
      // icon: <p className="font-sans border-b font-thin border-white">配置</p>,
      action: () => {
        if (activeTab === "menu") {
          closePanel();
        } else {
          openPanel();
        }
      },
    },  
  ];
  // Responsive positioning for toolbar at different screen sizes
  const toolBarPosition = {
    sm: "w-[80vw] top-16 right-4 h-auto max-h-[70vh]",
    md: "md:w-[40vw] md:h-[80vh] md:max-h-[80dvh]",
    lg: "lg:w-90 lg:top-16 lg:right-4",
  };
  // Animation configuration for toolbar transitions
  const transition = {
    type: "easeInOut",
    duration: 0.1,
    delay: 0,
  };
  // Get setting item components list
  const settingItems = ToolBarSettings({
    // Background image handling
    previewImage,
    previewContainerRef,
    handlePositionChange,
    sliderDisabled,
    triggerFileUpload,
    removeBackgroundImage,
    fileInputRef,
    handleFileChange: handleFileChangeWrapped,

    // Configuration options
    colorOptions,
    fontOptions,
    fontSizeOptions,

    // Panel state
    isOpen,
    activePreset,
  });
  return (
    <MotionConfig transition={transition}>
      <div className={cn(className)}>
        {/* toolbar buttons */}
        <div
          className={cn(
            "absolute top-4 right-4",
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
                  variant={"ghost"}
                  aria-label={item.label}
                  className="w-full h-full flex  hover:bg-[#080808] select-none appearance-none items-center justify-center"
                  type="button"
                  onClick={item.action}
                >
                  {item.icon}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* settings panel */}
        <AnimatePresence>
          {isOpen && (
            <MotionCard
              className={cn(
                toolBarPosition.sm,
                toolBarPosition.md,
                toolBarPosition.lg,
                "absolute flex flex-col py-0 gap-0 "
              )}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ ...transition }}
            >
              <PanelHeader title="配置" onClose={closePanel} />
              <div className="p-0 flex-1 overflow-hidden overflow-y-auto custom-scrollbar">
                <PanelContent>
                  {settingItems.map((item) => (
                    <SettingItem key={item.id} title={item.title}>
                      {item.component}
                    </SettingItem>
                  ))}

                  <PresetManager
                    text={textSettings.text}
                    textColor={textSettings.textColor}
                    fontFamily={textSettings.fontFamily}
                    fontSize={textSettings.fontSize}
                    fontWeight={textSettings.fontWeight}
                    scrollSpeed={textSettings.scrollSpeed}
                    edgeBlurEnabled={effectsSettings.edgeBlurEnabled}
                    edgeBlurIntensity={effectsSettings.edgeBlurIntensity}
                    shinyTextEnabled={effectsSettings.shinyTextEnabled}
                    noiseEnabled={effectsSettings.noiseEnabled}
                    noiseOpacity={effectsSettings.noiseOpacity}
                    noiseDensity={effectsSettings.noiseDensity}
                    noiseAnimated={effectsSettings.noiseAnimated}
                    textStrokeEnabled={textSettings.textStrokeEnabled}
                    textStrokeWidth={textSettings.textStrokeWidth}
                    textStrokeColor={textSettings.textStrokeColor}
                    textFillEnabled={textSettings.textFillEnabled}
                    onLoadPreset={loadPreset}
                    onActivePresetChange={setActivePreset}
                  />
                </PanelContent>
              </div>
            </MotionCard>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
