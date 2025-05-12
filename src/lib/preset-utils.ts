import { Preset } from "@/components/ui/settings/PresetManager";

/**
 * Interface for all preset property change handlers
 */
interface PresetHandlers {
  onTextChange: (text: string) => void;
  onColorChange: (color: string) => void;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  onScrollSpeedChange: (speed: number) => void;
  onEdgeBlurEnabledChange: (enabled: boolean) => void;
  onEdgeBlurIntensityChange: (intensity: number) => void;
  onShinyTextEnabledChange: (enabled: boolean) => void;
  onNoiseEnabledChange: (enabled: boolean) => void;
  onNoiseOpacityChange: (opacity: number) => void;
  onNoiseDensityChange: (density: number) => void;
  onTextStrokeEnabledChange: (enabled: boolean) => void;
  onTextStrokeWidthChange: (width: number) => void;
  onTextStrokeColorChange: (color: string) => void;
  onTextFillEnabledChange: (enabled: boolean) => void;
}

/**
 * Applies a configuration preset to the current UI settings
 * 
 * Handles the application of preset values to all supported UI properties
 * with special handling for optional properties. This centralizes the
 * preset application logic to ensure consistent behavior and simplify
 * the preset loading process.
 * 
 * @param preset - The configuration preset to apply
 * @param handlers - Object containing all the setter functions for each property
 */
export function applyPreset(preset: Preset, handlers: PresetHandlers) {
  const {
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
  } = handlers;

  // Apply base properties
  onTextChange(preset.text);
  onColorChange(preset.textColor);
  onFontChange(preset.fontFamily);
  onFontSizeChange(preset.fontSize);
  onScrollSpeedChange(preset.scrollSpeed);
  onEdgeBlurEnabledChange(preset.edgeBlurEnabled);
  onEdgeBlurIntensityChange(preset.edgeBlurIntensity);
  onShinyTextEnabledChange(preset.shinyTextEnabled);
  
  // Apply optional properties conditionally
  if (preset.noiseEnabled !== undefined) {
    onNoiseEnabledChange(preset.noiseEnabled);
  }
  if (preset.noiseOpacity !== undefined) {
    onNoiseOpacityChange(preset.noiseOpacity);
  }
  if (preset.noiseDensity !== undefined) {
    onNoiseDensityChange(preset.noiseDensity);
  }
  
  // Apply text styling properties conditionally
  if (preset.textStrokeEnabled !== undefined) {
    onTextStrokeEnabledChange(preset.textStrokeEnabled);
  }
  if (preset.textStrokeWidth !== undefined) {
    onTextStrokeWidthChange(preset.textStrokeWidth);
  }
  if (preset.textStrokeColor !== undefined) {
    onTextStrokeColorChange(preset.textStrokeColor);
  }
  if (preset.textFillEnabled !== undefined) {
    onTextFillEnabledChange(preset.textFillEnabled);
  }
} 