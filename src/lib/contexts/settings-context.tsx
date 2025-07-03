"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  colorOptions,
  fontOptions,
  fontSizeOptions,
  scrollSpeedOptions,
  edgeBlurConfig,
  noiseConfig,
  textStrokeConfig,
  starFieldConfig,
} from "@/lib/settings-config";
import type { TextSettings, BackgroundSettings, EffectsSettings } from "@/types";

// Global settings context definition, providing access to grouped settings
interface SettingsContextType {
  textSettings: TextSettings;
  updateTextSettings: (settings: Partial<TextSettings>) => void;
  backgroundSettings: BackgroundSettings;
  updateBackgroundSettings: (settings: Partial<BackgroundSettings>) => void;
  effectsSettings: EffectsSettings;
  updateEffectsSettings: (settings: Partial<EffectsSettings>) => void;
  isTextScrolling: boolean;
  setIsTextScrolling: (scrolling: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

// Default values for initial text settings
const defaultTextSettings: TextSettings = {
  text: "Sign",
  textColor: colorOptions[0].value, // Use first color option
  fontFamily: fontOptions[1].value, // Use second font option (DM Serif Display)
  fontSize: fontSizeOptions[3].value, // Use "XL" size (10rem)
  fontWeight: "400",
      fontItalic: false,
  scrollSpeed: parseInt(scrollSpeedOptions[2].value), // Use "1x" speed (10)
  textStrokeEnabled: false,
  textStrokeWidth: textStrokeConfig.defaultValue,
  textStrokeColor: colorOptions[0].value, // Use first color option
  textFillEnabled: true,
};

// Default values for initial background settings
const defaultBackgroundSettings: BackgroundSettings = {
  backgroundColor: "#000000",
  backgroundImage: null,
  backgroundPosition: { x: 50, y: 50 },
  backgroundZoom: 1,
  overlayEnabled: true,
};

// Default values for initial effect settings
const defaultEffectsSettings: EffectsSettings = {
  edgeBlurEnabled: false,
  edgeBlurIntensity: edgeBlurConfig.defaultValue,
  shinyTextEnabled: false,
  noiseEnabled: false,
  noisePatternSize: noiseConfig.patternSize.defaultValue,
  noisePatternAlpha: noiseConfig.patternAlpha.defaultValue,
  starFieldEnabled: false,
  starFieldDensity: starFieldConfig.density.defaultValue,
  starFieldColor: colorOptions[0].value,
  starFieldSize: starFieldConfig.size.defaultValue,
  starFieldTwinkleSpeed: starFieldConfig.twinkleSpeed.defaultValue,
};

// Settings provider that improves code maintainability through grouped management
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [textSettings, setTextSettings] =
    useState<TextSettings>(defaultTextSettings);
  const [backgroundSettings, setBackgroundSettings] =
    useState<BackgroundSettings>(defaultBackgroundSettings);
  const [effectsSettings, setEffectsSettings] = useState<EffectsSettings>(
    defaultEffectsSettings
  );
  const [isTextScrolling, setIsTextScrolling] = useState(false);

  // Support partial updates for text settings
  const updateTextSettings = (newSettings: Partial<TextSettings>) => {
    setTextSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Support partial updates for background settings
  const updateBackgroundSettings = (
    newSettings: Partial<BackgroundSettings>
  ) => {
    setBackgroundSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Support partial updates for effect settings
  const updateEffectsSettings = (newSettings: Partial<EffectsSettings>) => {
    setEffectsSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider
      value={{
        textSettings,
        updateTextSettings,
        backgroundSettings,
        updateBackgroundSettings,
        effectsSettings,
        updateEffectsSettings,
        isTextScrolling,
        setIsTextScrolling,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// Ensure settings are only used within a Provider context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
