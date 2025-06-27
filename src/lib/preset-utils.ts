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
  onNoiseOpacityChange: (opacity: number) => void;
  onNoiseDensityChange: (density: number) => void;
  onNoiseAnimatedChange: (animated: boolean) => void;
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
    onNoiseOpacityChange,
    onNoiseDensityChange,
    onNoiseAnimatedChange,
    onTextStrokeEnabledChange,
    onTextStrokeWidthChange,
    onTextStrokeColorChange,
    onTextFillEnabledChange,
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
  if (preset.noiseOpacity !== undefined) {
    onNoiseOpacityChange(preset.noiseOpacity);
  }
  if (preset.noiseDensity !== undefined) {
    onNoiseDensityChange(preset.noiseDensity);
  }
  if (preset.noiseAnimated !== undefined) {
    onNoiseAnimatedChange(preset.noiseAnimated);
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
    noiseOpacity: effectsSettings.noiseOpacity,
    noiseDensity: effectsSettings.noiseDensity,
    noiseAnimated: effectsSettings.noiseAnimated,
    textStrokeEnabled: textSettings.textStrokeEnabled,
    textStrokeWidth: textSettings.textStrokeWidth,
    textStrokeColor: textSettings.textStrokeColor,
    textFillEnabled: textSettings.textFillEnabled,
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
  details.push(`填充: ${preset.textFillEnabled ? "开启" : "关闭"}`);
  details.push(`边框: ${preset.textStrokeEnabled ? "开启" : "关闭"}`);

  return details;
}

/**
 * Local preset storage management utilities
 */
export class LocalPresetManager {
  private static readonly STORAGE_KEY = "sign-presets";

  /**
   * Get all local presets from localStorage
   */
  static getLocalPresets(): PresetType[] {
    try {
      const savedPresets = localStorage.getItem(this.STORAGE_KEY);
      if (!savedPresets) return [];
      
      const parsedPresets = JSON.parse(savedPresets);
      return Array.isArray(parsedPresets) ? parsedPresets : [];
    } catch (error) {
      console.error("Failed to load local presets:", error);
      return [];
    }
  }

  /**
   * Save presets to localStorage
   */
  static saveLocalPresets(presets: PresetType[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(presets));
    } catch (error) {
      console.error("Failed to save local presets:", error);
    }
  }

  /**
   * Add a new preset to the top of the local presets list
   */
  static addPresetToTop(preset: PresetType): PresetType[] {
    const existingPresets = this.getLocalPresets();
    
    // Check if preset with same name already exists
    const existingIndex = existingPresets.findIndex(p => p.name === preset.name);
    
    let updatedPresets: PresetType[];
    if (existingIndex >= 0) {
      // Replace existing preset with same name
      updatedPresets = [...existingPresets];
      updatedPresets[existingIndex] = preset;
      // Move to top
      updatedPresets.unshift(updatedPresets.splice(existingIndex, 1)[0]);
    } else {
      // Add new preset to top
      updatedPresets = [preset, ...existingPresets];
    }
    
    this.saveLocalPresets(updatedPresets);
    return updatedPresets;
  }

  /**
   * Create a preset from imported data and add to local storage
   */
  static saveImportedPreset(preset: PresetType, customName?: string): PresetType[] {
    const presetToSave: PresetType = {
      ...preset,
      id: Date.now().toString(), // Generate new ID for local storage
      name: customName || preset.name || "导入的预设",
    };
    
    return this.addPresetToTop(presetToSave);
  }
}
