"use client";

import React, { useRef } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { SettingItem } from "@/components/ui/settings/SettingItem";
import { PresetManager, Preset } from "@/components/ui/settings/PresetManager";
import { ToolBarSettings } from "@/components/ui/settings/ToolBarSettings";
import { PanelHeader } from "@/components/ui/panel/PanelHeader";
import { PanelContent } from "@/components/ui/panel/PanelContent";
import { useToolbarState } from "@/lib/hooks/useToolbarState";
import { 
  colorOptions, 
  fontOptions, 
  fontSizeOptions, 
  toolBarPosition,
  transition
} from "@/lib/toolbar-config";
import Petal from "@/components/ui/Petal";
import { useBackgroundImage } from "@/lib/hooks/useBackgroundImage";
import { useTextState } from "@/lib/hooks/useTextState";
import { applyPreset } from "@/lib/preset-utils";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Main configuration toolbar component that manages all display settings UI
export default function ToolBar() {
  // Access settings from context
  const {
    textSettings,
    updateTextSettings,
    backgroundSettings,
    updateBackgroundSettings,
    effectsSettings,
    updateEffectsSettings,
    isTextScrolling
  } = useSettings();

  // Using custom hooks to separate state and logic for improved maintainability
  const {
    isOpen,
    isActive,
    activeTab,
    editMode,
    openPanel,
    closePanel,
    enterEditMode: enterEditModeBase,
    exitEditMode: exitEditModeBase,
    handleImageChange
  } = useToolbarState();

  const menuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Handle text state and editing logic
  const { 
    inputText, 
    setInputText
  } = useTextState(
    textSettings.text, 
    (text) => updateTextSettings({ text }), 
    enterEditModeBase, 
    exitEditModeBase, 
    textInputRef as any
  );

  // Handle background image functionality
  const {
    previewImage,
    sliderDisabled,
    handleFileChangeWrapped,
    triggerFileUpload,
    removeBackgroundImage,
    handlePositionChange
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

  // Apply preset configuration to all settings
  const loadPreset = (preset: Preset) => {
    applyPreset(preset, {
      onTextChange: (text) => updateTextSettings({ text }),
      onColorChange: (color) => updateTextSettings({ textColor: color }),
      onFontChange: (font) => updateTextSettings({ fontFamily: font }),
      onFontSizeChange: (size) => updateTextSettings({ fontSize: size }),
      onScrollSpeedChange: (speed) => updateTextSettings({ scrollSpeed: speed }),
      onEdgeBlurEnabledChange: (enabled) => updateEffectsSettings({ edgeBlurEnabled: enabled }),
      onEdgeBlurIntensityChange: (intensity) => updateEffectsSettings({ edgeBlurIntensity: intensity }),
      onShinyTextEnabledChange: (enabled) => updateEffectsSettings({ shinyTextEnabled: enabled }),
      onNoiseEnabledChange: (enabled) => updateEffectsSettings({ noiseEnabled: enabled }),
      onNoiseOpacityChange: (opacity) => updateEffectsSettings({ noiseOpacity: opacity }),
      onNoiseDensityChange: (density) => updateEffectsSettings({ noiseDensity: density }),
      onTextStrokeEnabledChange: (enabled) => updateTextSettings({ textStrokeEnabled: enabled }),
      onTextStrokeWidthChange: (width) => updateTextSettings({ textStrokeWidth: width }),
      onTextStrokeColorChange: (color) => updateTextSettings({ textStrokeColor: color }),
      onTextFillEnabledChange: (enabled) => updateTextSettings({ textFillEnabled: enabled })
    });
  };

  // Toolbar menu item configuration
  const toolbarItems = [
    {
      id: "menu",
      label: "菜单",
      icon: <Petal />,
      action: () => {
        if (activeTab === "menu") {
          closePanel();
        } else {
          openPanel();
        }
      },
    },
  ];

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
  });
  return (
    <MotionConfig transition={transition}>
      <div className="z-[1000] relative">
      {/* toolbar buttons */}
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

      {/* settings panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={cardRef}
            className={cn(
              toolBarPosition.sm,
              toolBarPosition.md,
              toolBarPosition.lg,
              "fixed flex flex-col rounded-md bg-zinc-950 border border-zinc-800 overflow-hidden"
            )}
            style={{ zIndex: 999 }}
            initial={{ opacity: 0, scale:0.98  }}
            animate={{ opacity: 1, scale:1}}
            exit={{ opacity: 0, scale:0.98 }}
            transition={{ ...transition }}
          >
            <PanelHeader 
              title="配置" 
              onClose={closePanel} 
            />
            <PanelContent className="z-[1000]">
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
                scrollSpeed={textSettings.scrollSpeed}
                edgeBlurEnabled={effectsSettings.edgeBlurEnabled}
                edgeBlurIntensity={effectsSettings.edgeBlurIntensity}
                shinyTextEnabled={effectsSettings.shinyTextEnabled}
                noiseEnabled={effectsSettings.noiseEnabled}
                noiseOpacity={effectsSettings.noiseOpacity}
                noiseDensity={effectsSettings.noiseDensity}
                textStrokeEnabled={textSettings.textStrokeEnabled}
                textStrokeWidth={textSettings.textStrokeWidth}
                textStrokeColor={textSettings.textStrokeColor}
                textFillEnabled={textSettings.textFillEnabled}
                onLoadPreset={loadPreset}
              />
            </PanelContent>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
