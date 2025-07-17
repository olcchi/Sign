import { useCallback } from "react";
import { useSettings } from "@/lib/contexts/settings-context";
import { PresetType } from "@/types";
import { applyPreset } from "@/lib/preset-utils";

// Unified preset manager hook to eliminate duplicate preset application logic
export function usePresetManager() {
  const {
    textSettings,
    effectsSettings,
    updateTextSettings,
    updateEffectsSettings,
  } = useSettings();

  // Create preset application handlers
  const createPresetHandlers = useCallback(() => ({
    onTextChange: (text: string) => updateTextSettings({ text }),
    onColorChange: (color: string) => updateTextSettings({ textColor: color }),
    onFontChange: (font: string) => updateTextSettings({ fontFamily: font }),
    onFontSizeChange: (size: string) => updateTextSettings({ fontSize: size }),
    onFontWeightChange: (weight: string) => updateTextSettings({ fontWeight: weight }),
    onFontItalicChange: (italic: boolean) => updateTextSettings({ fontItalic: italic }),
    onScrollSpeedChange: (speed: number) => updateTextSettings({ scrollSpeed: speed }),
    onEdgeBlurEnabledChange: (enabled: boolean) => updateEffectsSettings({ edgeBlurEnabled: enabled }),
    onEdgeBlurIntensityChange: (intensity: number) => updateEffectsSettings({ edgeBlurIntensity: intensity }),
    onShinyTextEnabledChange: (enabled: boolean) => updateEffectsSettings({ shinyTextEnabled: enabled }),
    onNoiseEnabledChange: (enabled: boolean) => updateEffectsSettings({ noiseEnabled: enabled }),
    onNoisePatternSizeChange: (size: number) => updateEffectsSettings({ noisePatternSize: size }),
    onNoisePatternAlphaChange: (alpha: number) => updateEffectsSettings({ noisePatternAlpha: alpha }),
    onTextStrokeEnabledChange: (enabled: boolean) => updateTextSettings({ textStrokeEnabled: enabled }),
    onTextStrokeWidthChange: (width: number) => updateTextSettings({ textStrokeWidth: width }),
    onTextStrokeColorChange: (color: string) => updateTextSettings({ textStrokeColor: color }),
    onTextFillEnabledChange: (enabled: boolean) => updateTextSettings({ textFillEnabled: enabled }),
    onTextGlowEnabledChange: (enabled: boolean) => updateTextSettings({ textGlowEnabled: enabled }),
    onTextGlowColorChange: (color: string) => updateTextSettings({ textGlowColor: color }),
    onTextGlowIntensityChange: (intensity: number) => updateTextSettings({ textGlowIntensity: intensity }),

    onTextGlowBlurChange: (blur: number) => updateTextSettings({ textGlowBlur: blur }),
    onStarFieldEnabledChange: (enabled: boolean) => updateEffectsSettings({ starFieldEnabled: enabled }),
    onStarFieldDensityChange: (density: number) => updateEffectsSettings({ starFieldDensity: density }),
    onStarFieldColorChange: (color: string) => updateEffectsSettings({ starFieldColor: color }),
    onStarFieldSizeChange: (size: number) => updateEffectsSettings({ starFieldSize: size }),
    onStarFieldTwinkleSpeedChange: (speed: number) => updateEffectsSettings({ starFieldTwinkleSpeed: speed }),
  }), [updateTextSettings, updateEffectsSettings]);

  // Unified preset loading function
  const loadPreset = useCallback((preset: PresetType) => {
    const handlers = createPresetHandlers();
    applyPreset(preset, handlers);
  }, [createPresetHandlers]);

  // Get current settings as preset format
  const getCurrentPreset = useCallback((): Omit<PresetType, 'id' | 'name'> => ({
    text: textSettings.text,
    textColor: textSettings.textColor,
    fontFamily: textSettings.fontFamily,
    fontSize: textSettings.fontSize,
    fontWeight: textSettings.fontWeight,
    fontItalic: textSettings.fontItalic,
    scrollSpeed: textSettings.scrollSpeed,
    edgeBlurEnabled: effectsSettings.edgeBlurEnabled,
    edgeBlurIntensity: effectsSettings.edgeBlurIntensity,
    shinyTextEnabled: effectsSettings.shinyTextEnabled,
    noiseEnabled: effectsSettings.noiseEnabled,
    noisePatternSize: effectsSettings.noisePatternSize,
    noisePatternAlpha: effectsSettings.noisePatternAlpha,
    textStrokeEnabled: textSettings.textStrokeEnabled,
    textStrokeWidth: textSettings.textStrokeWidth,
    textStrokeColor: textSettings.textStrokeColor,
    textFillEnabled: textSettings.textFillEnabled,
    textGlowEnabled: textSettings.textGlowEnabled,
    textGlowColor: textSettings.textGlowColor,
    textGlowIntensity: textSettings.textGlowIntensity,
    textGlowBlur: textSettings.textGlowBlur,
    starFieldEnabled: effectsSettings.starFieldEnabled,
    starFieldDensity: effectsSettings.starFieldDensity,
    starFieldColor: effectsSettings.starFieldColor,
    starFieldSize: effectsSettings.starFieldSize,
    starFieldTwinkleSpeed: effectsSettings.starFieldTwinkleSpeed,
  }), [textSettings, effectsSettings]);

  return {
    loadPreset,
    getCurrentPreset,
    textSettings,
    effectsSettings,
  };
}