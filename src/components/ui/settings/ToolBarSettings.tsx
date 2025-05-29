"use client";

import React from "react";
import {
  ContentSetting,
  FontSizeSetting,
  TextRenderingSetting,
  FontFamilySetting,
  ScrollSpeedSetting,
  BackgroundImageSetting,
  EffectsSetting,
  ShareSetting,
} from "@/components/ui/settings/settingsComponent";
import { Preset } from "@/components/ui/settings/Preset";

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
  activePreset?: Preset | null; // Current active preset
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
  const fontSizeSetting = FontSizeSetting({ fontSizeOptions });
  const textRenderingSetting = TextRenderingSetting({ colorOptions });
  const fontFamilySetting = FontFamilySetting({ fontOptions });
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
  const shareSetting = ShareSetting({ activePreset });

  return [
    {
      id: "content",
      title: contentSetting.title,
      component: contentSetting.component,
    },
    {
      id: "fontSize",
      title: fontSizeSetting.title,
      component: fontSizeSetting.component,
    },
    {
      id: "textRendering",
      title: textRenderingSetting.title,
      component: textRenderingSetting.component,
    },
    {
      id: "fontFamily",
      title: fontFamilySetting.title,
      component: fontFamilySetting.component,
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
    {
      id: "share",
      title: shareSetting.title,
      component: shareSetting.component,
    },
  ];
}
