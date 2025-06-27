import { useCallback } from "react";
import { useSettings } from "@/lib/contexts/settings-context";
import { Preset } from "@/components/ui/settings/preset-manager/types";
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
    onScrollSpeedChange: (speed: number) => updateTextSettings({ scrollSpeed: speed }),
    onEdgeBlurEnabledChange: (enabled: boolean) => updateEffectsSettings({ edgeBlurEnabled: enabled }),
    onEdgeBlurIntensityChange: (intensity: number) => updateEffectsSettings({ edgeBlurIntensity: intensity }),
    onShinyTextEnabledChange: (enabled: boolean) => updateEffectsSettings({ shinyTextEnabled: enabled }),
    onNoiseEnabledChange: (enabled: boolean) => updateEffectsSettings({ noiseEnabled: enabled }),
    onNoiseOpacityChange: (opacity: number) => updateEffectsSettings({ noiseOpacity: opacity }),
    onNoiseDensityChange: (density: number) => updateEffectsSettings({ noiseDensity: density }),
    onNoiseAnimatedChange: (animated: boolean) => updateEffectsSettings({ noiseAnimated: animated }),
    onTextStrokeEnabledChange: (enabled: boolean) => updateTextSettings({ textStrokeEnabled: enabled }),
    onTextStrokeWidthChange: (width: number) => updateTextSettings({ textStrokeWidth: width }),
    onTextStrokeColorChange: (color: string) => updateTextSettings({ textStrokeColor: color }),
    onTextFillEnabledChange: (enabled: boolean) => updateTextSettings({ textFillEnabled: enabled }),
  }), [updateTextSettings, updateEffectsSettings]);

  // Unified preset loading function
  const loadPreset = useCallback((preset: Preset) => {
    const handlers = createPresetHandlers();
    applyPreset(preset, handlers);
  }, [createPresetHandlers]);

  // Get current settings as preset format
  const getCurrentPreset = useCallback((): Omit<Preset, 'id' | 'name'> => ({
    text: textSettings.text,
    textColor: textSettings.textColor,
    fontFamily: textSettings.fontFamily,
    fontSize: textSettings.fontSize,
    fontWeight: textSettings.fontWeight,
    scrollSpeed: textSettings.scrollSpeed,
    edgeBlurEnabled: effectsSettings.edgeBlurEnabled,
    edgeBlurIntensity: effectsSettings.edgeBlurIntensity,
    shinyTextEnabled: effectsSettings.shinyTextEnabled,
    noiseEnabled: effectsSettings.noiseEnabled,
    noiseOpacity: effectsSettings.noiseOpacity,
    noiseDensity: effectsSettings.noiseDensity,
    noiseAnimated: effectsSettings.noiseAnimated,
    textStrokeEnabled: textSettings.textStrokeEnabled,
    textStrokeWidth: textSettings.textStrokeWidth,
    textStrokeColor: textSettings.textStrokeColor,
    textFillEnabled: textSettings.textFillEnabled,
  }), [textSettings, effectsSettings]);

  return {
    loadPreset,
    getCurrentPreset,
    textSettings,
    effectsSettings,
  };
} 