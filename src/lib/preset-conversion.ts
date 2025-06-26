import { Preset } from "@/components/ui/settings/Preset/types";
import { ShareablePreset } from "@/lib/share-api";

// Font mapping for backward compatibility with old presets
const FONT_MAPPING = {
  "var(--font-noto-serif)": "var(--font-serif)",
  "var(--font-dm-serif-display)": "var(--font-serif)",
  "Noto Serif": "var(--font-serif)",
} as const;

// Map old font values to new ones for backward compatibility
function mapFontFamily(fontFamily: string): string {
  return FONT_MAPPING[fontFamily as keyof typeof FONT_MAPPING] || fontFamily;
}

// Default values for preset properties to ensure consistency
const DEFAULT_PRESET_VALUES = {
  noiseEnabled: false,
  noiseOpacity: 0.1,
  noiseDensity: 0.5,
  noiseAnimated: false,
  textStrokeEnabled: false,
  textStrokeWidth: 1,
  textStrokeColor: "#000000",
  textFillEnabled: true,
} as const;

// Convert Preset to ShareablePreset for sharing/saving
export function presetToShareable(preset: Preset): ShareablePreset {
  return {
    id: preset.id,
    name: preset.name,
    text: preset.text,
    textColor: preset.textColor,
    fontFamily: mapFontFamily(preset.fontFamily),
    fontSize: preset.fontSize,
    fontWeight: preset.fontWeight,
    scrollSpeed: preset.scrollSpeed,
    edgeBlurEnabled: preset.edgeBlurEnabled,
    edgeBlurIntensity: preset.edgeBlurIntensity,
    shinyTextEnabled: preset.shinyTextEnabled,
    noiseEnabled: preset.noiseEnabled ?? DEFAULT_PRESET_VALUES.noiseEnabled,
    noiseOpacity: preset.noiseOpacity ?? DEFAULT_PRESET_VALUES.noiseOpacity,
    noiseDensity: preset.noiseDensity ?? DEFAULT_PRESET_VALUES.noiseDensity,
    noiseAnimated: preset.noiseAnimated ?? DEFAULT_PRESET_VALUES.noiseAnimated,
    textStrokeEnabled: preset.textStrokeEnabled ?? DEFAULT_PRESET_VALUES.textStrokeEnabled,
    textStrokeWidth: preset.textStrokeWidth ?? DEFAULT_PRESET_VALUES.textStrokeWidth,
    textStrokeColor: preset.textStrokeColor ?? DEFAULT_PRESET_VALUES.textStrokeColor,
    textFillEnabled: preset.textFillEnabled ?? DEFAULT_PRESET_VALUES.textFillEnabled,
  };
}

// Convert ShareablePreset to Preset for loading/applying
export function shareableToPreset(shareable: ShareablePreset): Preset {
  return {
    id: shareable.id,
    name: shareable.name,
    text: shareable.text,
    textColor: shareable.textColor,
    fontFamily: mapFontFamily(shareable.fontFamily),
    fontSize: shareable.fontSize,
    fontWeight: shareable.fontWeight,
    scrollSpeed: shareable.scrollSpeed,
    edgeBlurEnabled: shareable.edgeBlurEnabled,
    edgeBlurIntensity: shareable.edgeBlurIntensity,
    shinyTextEnabled: shareable.shinyTextEnabled,
    noiseEnabled: shareable.noiseEnabled ?? DEFAULT_PRESET_VALUES.noiseEnabled,
    noiseOpacity: shareable.noiseOpacity ?? DEFAULT_PRESET_VALUES.noiseOpacity,
    noiseDensity: shareable.noiseDensity ?? DEFAULT_PRESET_VALUES.noiseDensity,
    noiseAnimated: shareable.noiseAnimated ?? DEFAULT_PRESET_VALUES.noiseAnimated,
    textStrokeEnabled: shareable.textStrokeEnabled ?? DEFAULT_PRESET_VALUES.textStrokeEnabled,
    textStrokeWidth: shareable.textStrokeWidth ?? DEFAULT_PRESET_VALUES.textStrokeWidth,
    textStrokeColor: shareable.textStrokeColor ?? DEFAULT_PRESET_VALUES.textStrokeColor,
    textFillEnabled: shareable.textFillEnabled ?? DEFAULT_PRESET_VALUES.textFillEnabled,
  };
}

// Normalize preset with default values to ensure consistency
export function normalizePreset(preset: Partial<Preset>): Preset {
  return {
    id: preset.id || '',
    name: preset.name || '',
    text: preset.text || '',
    textColor: preset.textColor || '#FFFFFF',
    fontFamily: mapFontFamily(preset.fontFamily || 'var(--font-serif)'),
    fontSize: preset.fontSize || '2xl',
    fontWeight: preset.fontWeight || '400',
    scrollSpeed: preset.scrollSpeed ?? 50,
    edgeBlurEnabled: preset.edgeBlurEnabled ?? false,
    edgeBlurIntensity: preset.edgeBlurIntensity ?? 10,
    shinyTextEnabled: preset.shinyTextEnabled ?? false,
    noiseEnabled: preset.noiseEnabled ?? DEFAULT_PRESET_VALUES.noiseEnabled,
    noiseOpacity: preset.noiseOpacity ?? DEFAULT_PRESET_VALUES.noiseOpacity,
    noiseDensity: preset.noiseDensity ?? DEFAULT_PRESET_VALUES.noiseDensity,
    noiseAnimated: preset.noiseAnimated ?? DEFAULT_PRESET_VALUES.noiseAnimated,
    textStrokeEnabled: preset.textStrokeEnabled ?? DEFAULT_PRESET_VALUES.textStrokeEnabled,
    textStrokeWidth: preset.textStrokeWidth ?? DEFAULT_PRESET_VALUES.textStrokeWidth,
    textStrokeColor: preset.textStrokeColor ?? DEFAULT_PRESET_VALUES.textStrokeColor,
    textFillEnabled: preset.textFillEnabled ?? DEFAULT_PRESET_VALUES.textFillEnabled,
  };
}

// Validate preset data integrity
export function validatePreset(preset: any): preset is Preset {
  return (
    typeof preset === 'object' &&
    preset !== null &&
    typeof preset.id === 'string' &&
    typeof preset.name === 'string' &&
    typeof preset.text === 'string' &&
    typeof preset.textColor === 'string' &&
    typeof preset.fontFamily === 'string' &&
    typeof preset.fontSize === 'string' &&
    typeof preset.fontWeight === 'string' &&
    typeof preset.scrollSpeed === 'number' &&
    typeof preset.edgeBlurEnabled === 'boolean' &&
    typeof preset.edgeBlurIntensity === 'number' &&
    typeof preset.shinyTextEnabled === 'boolean'
  );
} 