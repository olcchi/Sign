"use client";

import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/layout/button";
import { SettingItem } from "@/components/ui/settings/setting-item";
import { PresetManager } from "@/components/ui/settings/preset";
import { PresetType } from "@/types";
import { ToolBarSettings } from "@/components/ui/settings/tool-bar-settings";
import { PanelHeader } from "@/components/ui/settings/panel/panel-header";
import { PanelContent } from "@/components/ui/settings/panel/panel-content";
import { Card } from "@/components/ui/layout/card";
import { Ellipsis } from "lucide-react";
import {
  colorOptions,
  fontOptions,
  fontSizeOptions,
} from "@/lib/settings-config";
import { useBackgroundImage } from "@/lib/hooks/useBackgroundImage";
import { usePresetManager } from "@/lib/hooks/usePresetManager";
import { useSettings } from "@/lib/contexts/settings-context";
import { useToolbarState } from "@/lib/hooks/useToolbarState";

// Create motion variants of Card component
const MotionCard = motion.create(Card);

interface ToolBarProps {
  className?: string;
}

// Main configuration toolbar component that manages all display settings UI
export default function ToolBar({ className }: ToolBarProps) {
  // Access settings from context
  const {
    textSettings,
    backgroundSettings,
    updateBackgroundSettings,
    effectsSettings,
  } = useSettings();

  // Track current active preset
  const [activePreset, setActivePreset] = useState<PresetType | null>(null);

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

  // Toolbar menu item configuration
  const toolbarItems = [
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
    sm: "w-[75vw] top-12 right-0 h-auto max-h-[70vh]",
    md: "md:w-[40vw] md:h-[80vh] md:max-h-[80dvh]",
    lg: "lg:w-80 lg:top-12 lg:right-0",
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
            "pointer-events-auto",
            "activity-opacity",
            isActive || isOpen ? "active" : "inactive"
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
        <AnimatePresence mode="popLayout">
          {isOpen && (
            <MotionCard
              className={cn(
                toolBarPosition.sm,
                toolBarPosition.md,
                toolBarPosition.lg,
                "absolute flex flex-col py-0 gap-0 pointer-events-auto"
              )}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
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
                    noisePatternSize={effectsSettings.noisePatternSize}
                    noisePatternAlpha={effectsSettings.noisePatternAlpha}
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
