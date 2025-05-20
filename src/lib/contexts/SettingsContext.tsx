"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Text settings interface for managing text content and styles
interface TextSettings {
  text: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  scrollSpeed: number;
  textStrokeEnabled: boolean;
  textStrokeWidth: number;
  textStrokeColor: string;
  textFillEnabled: boolean;
}

// Background settings interface for controlling page background appearance
interface BackgroundSettings {
  backgroundColor: string;
  backgroundImage: string | null;
  backgroundPosition: { x: number; y: number };
  backgroundZoom: number;
  overlayEnabled: boolean;
}

// Visual effects settings interface for managing effect parameters
interface EffectsSettings {
  edgeBlurEnabled: boolean;
  edgeBlurIntensity: number;
  shinyTextEnabled: boolean;
  noiseEnabled: boolean;
  noiseOpacity: number;
  noiseDensity: number;
}

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

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Default values for initial text settings
const defaultTextSettings: TextSettings = {
  text: "Sign",
  textColor: "#FFFFFB",
  fontFamily: "var(--font-geist-sans)",
  fontSize: "10rem",
  scrollSpeed: 10,
  textStrokeEnabled: false,
  textStrokeWidth: 2,
  textStrokeColor: "#FFFFFB",
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
  edgeBlurIntensity: 4,
  shinyTextEnabled: true,
  noiseEnabled: false,
  noiseOpacity: 0.1,
  noiseDensity: 0.3,
};

// Settings provider that improves code maintainability through grouped management
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [textSettings, setTextSettings] = useState<TextSettings>(defaultTextSettings);
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>(defaultBackgroundSettings);
  const [effectsSettings, setEffectsSettings] = useState<EffectsSettings>(defaultEffectsSettings);
  const [isTextScrolling, setIsTextScrolling] = useState(false);

  // Support partial updates for text settings
  const updateTextSettings = (newSettings: Partial<TextSettings>) => {
    setTextSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Support partial updates for background settings
  const updateBackgroundSettings = (newSettings: Partial<BackgroundSettings>) => {
    setBackgroundSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Support partial updates for effect settings
  const updateEffectsSettings = (newSettings: Partial<EffectsSettings>) => {
    setEffectsSettings(prev => ({ ...prev, ...newSettings }));
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