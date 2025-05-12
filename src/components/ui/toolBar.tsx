"use client";

import React, { useRef } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import TextEditor from "@/components/ui/textEditor";
import { Button } from "@/components/ui/button/button";
import { SettingItem } from "@/components/ui/settings/SettingItem";
import { PresetManager, Preset } from "@/components/ui/settings/PresetManager";
import { getSettingItems } from "@/components/ui/settings/ToolBarSettings";
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
import { useBackgroundImage } from "@/lib/hooks/useBackgroundImage";
import { useTextState } from "@/lib/hooks/useTextState";
import { applyPreset } from "@/lib/preset-utils";

// Props interface with comprehensive customization options
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
  textStrokeEnabled?: boolean;
  onTextStrokeEnabledChange?: (enabled: boolean) => void;
  textStrokeWidth?: number;
  onTextStrokeWidthChange?: (width: number) => void;
  textStrokeColor?: string;
  onTextStrokeColorChange?: (color: string) => void;
  textFillEnabled?: boolean;
  onTextFillEnabledChange?: (enabled: boolean) => void;
}

/**
 * Main toolbar component for configuring display options
 * 
 * Provides a comprehensive UI for adjusting text and background settings
 * with custom presets management. Uses multiple custom hooks to separate
 * and manage different aspects of functionality.
 */
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
  textStrokeEnabled = true,
  onTextStrokeEnabledChange = () => {},
  textStrokeWidth = 1,
  onTextStrokeWidthChange = () => {},
  textStrokeColor = "#000000",
  onTextStrokeColorChange = () => {},
  textFillEnabled = true,
  onTextFillEnabledChange = () => {},
}: ToolBarProps) {
  // Custom hooks manage state and logic
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

  // Handle text state and editing
  const { 
    inputText, 
    setInputText,
    enterEditMode, 
    exitEditMode 
  } = useTextState(
    text, 
    onTextChange, 
    enterEditModeBase, 
    exitEditModeBase, 
    textInputRef as any
  );

  // Handle background image logic
  const {
    previewImage,
    sliderDisabled,
    handleFileChangeWrapped,
    triggerFileUpload,
    removeBackgroundImage,
    handlePositionChange
  } = useBackgroundImage(
    backgroundImage,
    onBackgroundImageChange,
    previewContainerRef as any,
    fileInputRef as any,
    handleImageChange,
    backgroundPosition,
    onBackgroundPositionChange,
    isOpen
  );

  /**
   * Applies a preset configuration to all settings
   */
  const loadPreset = (preset: Preset) => {
    applyPreset(preset, {
      onTextChange,
      onColorChange,
      onFontChange,
      onFontSizeChange,
      onScrollSpeedChange,
      onEdgeBlurEnabledChange,
      onEdgeBlurIntensityChange,
      onShinyTextEnabledChange,
      onNoiseEnabledChange,
      onNoiseOpacityChange,
      onNoiseDensityChange,
      onTextStrokeEnabledChange,
      onTextStrokeWidthChange,
      onTextStrokeColorChange,
      onTextFillEnabledChange
    });
  };

  // Toolbar menu items
  const toolbarItems = [
    {
      id: "menu",
      label: "菜单",
      icon: <Menu className="h-5 w-5" />,
      action: () => {
        if (activeTab === "menu") {
          closePanel();
        } else {
          openPanel();
        }
      },
    },
  ];

  // Get setting items
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
    handleFileChange: handleFileChangeWrapped,
    colorOptions,
    fontOptions,
    fontSizeOptions,
    noiseEnabled,
    onNoiseEnabledChange,
    noiseOpacity,
    onNoiseOpacityChange,
    noiseDensity,
    onNoiseDensityChange,
    textStrokeEnabled,
    onTextStrokeEnabledChange,
    textStrokeWidth,
    onTextStrokeWidthChange,
    textStrokeColor,
    onTextStrokeColorChange,
    textFillEnabled,
    onTextFillEnabledChange,
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
              "fixed flex flex-col backdrop-blur-2xl rounded-md bg-zinc-950/70 border border-zinc-800 overflow-hidden"
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
                textStrokeEnabled={textStrokeEnabled}
                textStrokeWidth={textStrokeWidth}
                textStrokeColor={textStrokeColor}
                textFillEnabled={textFillEnabled}
                onLoadPreset={loadPreset}
              />
            </PanelContent>
          </motion.div>
        )}
      </AnimatePresence>

      <TextEditor
        show={editMode}
        text={inputText}
        onTextChange={setInputText}
        onClose={() => exitEditMode()}
        onSubmit={exitEditMode}
        textColor={textColor}
        onColorChange={onColorChange}
        textInputRef={textInputRef as React.RefObject<HTMLTextAreaElement>}
        scrollSpeed={scrollSpeed}
        onScrollSpeedChange={onScrollSpeedChange}
      />
      </div>
    </MotionConfig>
  );
}
