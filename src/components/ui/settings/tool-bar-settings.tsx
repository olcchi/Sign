"use client";
import { Card } from "@/components/ui/layout/card";
import {
  ContentSetting,
  TextRenderingSetting,
  ScrollSpeedSetting,
  TextFillSetting,
  EffectsSetting,
  BackgroundImageSetting,
} from "@/components/ui/settings/settings-component";
import { PresetType } from "@/types";

// Configurable options
interface OptionsConfig {
  colorOptions: Array<{
    name: string;
    value: string;
    bg: string;
    textColor: string;
  }>;
  fontOptions: Array<{
    name: string;
    value: string;
    fontFamily: string;
  }>;
  fontSizeOptions: Array<{
    name: string;
    value: string;
  }>;
}

// Background image interaction properties
interface BackgroundImageHandlingProps {
  previewImage: string | null;
  previewContainerRef: React.RefObject<HTMLDivElement | null>;
  handlePositionChange: (axis: "x" | "y", value: number[]) => void;
  sliderDisabled: { x: boolean; y: boolean };
  triggerFileUpload: () => void;
  removeBackgroundImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Combines all settings properties for extensibility
export interface ToolBarSettingsProps
  extends BackgroundImageHandlingProps,
    OptionsConfig {
  isOpen?: boolean;
  activePreset?: PresetType | null; // Current active preset
}

// Constructs setting item components for toolbar option rendering
export function ToolBarSettings({
  // Background image handling
  previewImage,
  previewContainerRef,
  handlePositionChange,
  sliderDisabled,
  triggerFileUpload,
  removeBackgroundImage,
  fileInputRef,
  handleFileChange,

  // Configuration options
  colorOptions,
  fontOptions,
  fontSizeOptions,

  // Panel state
  isOpen,
  activePreset,
}: ToolBarSettingsProps) {
  // Create setting components using the extracted components
  const contentSetting = ContentSetting({ isOpen });
  const textRenderingSetting = TextRenderingSetting({
    colorOptions,
    fontOptions,
    fontSizeOptions,
  });
  const scrollSpeedSetting = ScrollSpeedSetting();
  const backgroundImageSetting = BackgroundImageSetting({
    previewImage,
    previewContainerRef,
    handlePositionChange,
    sliderDisabled,
    triggerFileUpload,
    removeBackgroundImage,
    fileInputRef,
    handleFileChange,
  });
  const effectsSetting = EffectsSetting();

  return [
    {
      id: "content",
      title: contentSetting.title,
      component: contentSetting.component,
    },
    {
      id: "textRendering",
      title: textRenderingSetting.title,
      component: textRenderingSetting.component,
    },
    {
      id: "scrollSpeed",
      title: scrollSpeedSetting.title,
      component: scrollSpeedSetting.component,
    },
    {
      id: "backgroundImage",
      title: backgroundImageSetting.title,
      component: backgroundImageSetting.component,
    },
    {
      id: "edgeBlurEffect",
      title: effectsSetting.title,
      component: effectsSetting.component,
    },
  ];
}
