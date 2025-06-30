import { PresetType } from "@/types";
import type { TextSettings, EffectsSettings } from "@/types";
import {
  colorOptions,
  fontOptions,
  fontSizeOptions,
  scrollSpeedOptions,
} from "@/lib/settings-config";

/**
 * Interface for all preset property change handlers
 */
interface PresetHandlers {
  onTextChange: (text: string) => void;
  onColorChange: (color: string) => void;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: string) => void;
  onFontWeightChange: (weight: string) => void;
  onScrollSpeedChange: (speed: number) => void;
  onEdgeBlurEnabledChange: (enabled: boolean) => void;
  onEdgeBlurIntensityChange: (intensity: number) => void;
  onShinyTextEnabledChange: (enabled: boolean) => void;
  onNoiseEnabledChange: (enabled: boolean) => void;
  onNoisePatternSizeChange: (size: number) => void;
  onNoisePatternAlphaChange: (alpha: number) => void;
  onTextStrokeEnabledChange: (enabled: boolean) => void;
  onTextStrokeWidthChange: (width: number) => void;
  onTextStrokeColorChange: (color: string) => void;
  onTextFillEnabledChange: (enabled: boolean) => void;
  onStarFieldEnabledChange: (enabled: boolean) => void;
  onStarFieldDensityChange: (density: number) => void;
  onStarFieldColorChange: (color: string) => void;
  onStarFieldSizeChange: (size: number) => void;
  onStarFieldTwinkleSpeedChange: (speed: number) => void;
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
export function applyPreset(preset: PresetType, handlers: PresetHandlers) {
  const {
    onTextChange,
    onColorChange,
    onFontChange,
    onFontSizeChange,
    onFontWeightChange,
    onScrollSpeedChange,
    onEdgeBlurEnabledChange,
    onEdgeBlurIntensityChange,
    onShinyTextEnabledChange,
    onNoiseEnabledChange,
    onNoisePatternSizeChange,
    onNoisePatternAlphaChange,
    onTextStrokeEnabledChange,
    onTextStrokeWidthChange,
    onTextStrokeColorChange,
    onTextFillEnabledChange,
    onStarFieldEnabledChange,
    onStarFieldDensityChange,
    onStarFieldColorChange,
    onStarFieldSizeChange,
    onStarFieldTwinkleSpeedChange,
  } = handlers;

  // Apply base properties
  onTextChange(preset.text);
  onColorChange(preset.textColor);
  onFontChange(preset.fontFamily);
  onFontSizeChange(preset.fontSize);
  onFontWeightChange(preset.fontWeight);
  onScrollSpeedChange(preset.scrollSpeed);
  onEdgeBlurEnabledChange(preset.edgeBlurEnabled);
  onEdgeBlurIntensityChange(preset.edgeBlurIntensity);
  onShinyTextEnabledChange(preset.shinyTextEnabled);

  // Apply optional properties conditionally
  if (preset.noiseEnabled !== undefined) {
    onNoiseEnabledChange(preset.noiseEnabled);
  }
  if (preset.noisePatternSize !== undefined) {
    onNoisePatternSizeChange(preset.noisePatternSize);
  }
  if (preset.noisePatternAlpha !== undefined) {
    onNoisePatternAlphaChange(preset.noisePatternAlpha);
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

  // Apply star field properties conditionally
  if (preset.starFieldEnabled !== undefined) {
    onStarFieldEnabledChange(preset.starFieldEnabled);
  }
  if (preset.starFieldDensity !== undefined) {
    onStarFieldDensityChange(preset.starFieldDensity);
  }
  if (preset.starFieldColor !== undefined) {
    onStarFieldColorChange(preset.starFieldColor);
  }
  if (preset.starFieldSize !== undefined) {
    onStarFieldSizeChange(preset.starFieldSize);
  }
  if (preset.starFieldTwinkleSpeed !== undefined) {
    onStarFieldTwinkleSpeedChange(preset.starFieldTwinkleSpeed);
  }
}

/**
 * Convert current settings to Preset format
 */
export function createPresetFromCurrentSettings(
  textSettings: TextSettings,
  effectsSettings: EffectsSettings,
  name: string = "当前设置"
): PresetType {
  return {
    id: `temp-${Date.now()}`, // Temporary ID for current settings
    name,
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
    noisePatternSize: effectsSettings.noisePatternSize,
    noisePatternAlpha: effectsSettings.noisePatternAlpha,
    textStrokeEnabled: textSettings.textStrokeEnabled,
    textStrokeWidth: textSettings.textStrokeWidth,
    textStrokeColor: textSettings.textStrokeColor,
    textFillEnabled: textSettings.textFillEnabled,
    starFieldEnabled: effectsSettings.starFieldEnabled,
    starFieldDensity: effectsSettings.starFieldDensity,
    starFieldColor: effectsSettings.starFieldColor,
    starFieldSize: effectsSettings.starFieldSize,
    starFieldTwinkleSpeed: effectsSettings.starFieldTwinkleSpeed,
  };
}

/**
 * Get detailed preset information as an array of strings for vertical display
 * Reuses the same display logic as Preset.tsx AccordionContent
 */
export function getPresetDetailedInfo(preset: PresetType): string[] {
  const details = [];

  // Text content (truncated)
  const textContent =
    preset.text.substring(0, 30) + (preset.text.length > 30 ? "..." : "");
  details.push(`内容: ${textContent}`);

  // Font family
  const fontName =
    fontOptions.find((opt) => opt.value === preset.fontFamily)?.name ||
    preset.fontFamily;
  details.push(`字体: ${fontName}`);

  // Color
  const colorName =
    colorOptions.find((opt) => opt.value === preset.textColor)?.name ||
    preset.textColor;
  details.push(`颜色: ${colorName}`);

  // Font size
  const sizeName =
    fontSizeOptions.find((opt) => opt.value === preset.fontSize)?.name ||
    preset.fontSize;
  details.push(`字号: ${sizeName}`);

  // Font weight - simplified to bold/normal
  const weightName = preset.fontWeight === "700" ? "粗体" : "正常";
  details.push(`粗体: ${weightName}`);

  // Scroll speed
  const speedName =
    scrollSpeedOptions.find((opt) => parseInt(opt.value) === preset.scrollSpeed)
      ?.name || `${preset.scrollSpeed}x`;
  details.push(`滚动速度: ${speedName}`);

  // Effects
  details.push(`聚焦: ${preset.edgeBlurEnabled ? "开启" : "关闭"}`);
  details.push(`闪光: ${preset.shinyTextEnabled ? "开启" : "关闭"}`);
  details.push(`噪点: ${preset.noiseEnabled ? "开启" : "关闭"}`);
  details.push(`闪点: ${preset.starFieldEnabled ? "开启" : "关闭"}`);
  details.push(`填充: ${preset.textFillEnabled ? "开启" : "关闭"}`);
  details.push(`边框: ${preset.textStrokeEnabled ? "开启" : "关闭"}`);

  return details;
}
