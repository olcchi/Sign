import { PresetType, ShareablePreset } from "@/types";

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
  noisePatternSize: 250,
  noisePatternAlpha: 15,
  textStrokeEnabled: false,
  textStrokeWidth: 0.03,
  textStrokeColor: "#000000",
  textFillEnabled: true,
  starFieldEnabled: false,
  starFieldDensity: 0.5,
  starFieldColor: "#FFFFFB",
  starFieldSize: 2,
  starFieldTwinkleSpeed: 1.0,
  isNewImport: false,
} as const;

// Normalize and prepare preset for sharing/saving
export function presetToShareable(preset: PresetType): ShareablePreset {
  return normalizePreset(preset);
}

// Convert shareable preset back to full preset format
export function shareableToPreset(shareable: ShareablePreset): PresetType {
  return normalizePreset(shareable);
}

// Normalize preset with default values to ensure consistency
export function normalizePreset(preset: Partial<PresetType>): PresetType {
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
    noisePatternSize: preset.noisePatternSize ?? DEFAULT_PRESET_VALUES.noisePatternSize,
    noisePatternAlpha: preset.noisePatternAlpha ?? DEFAULT_PRESET_VALUES.noisePatternAlpha,
    textStrokeEnabled: preset.textStrokeEnabled ?? DEFAULT_PRESET_VALUES.textStrokeEnabled,
    textStrokeWidth: preset.textStrokeWidth ?? DEFAULT_PRESET_VALUES.textStrokeWidth,
    textStrokeColor: preset.textStrokeColor ?? DEFAULT_PRESET_VALUES.textStrokeColor,
    textFillEnabled: preset.textFillEnabled ?? DEFAULT_PRESET_VALUES.textFillEnabled,
    starFieldEnabled: preset.starFieldEnabled ?? DEFAULT_PRESET_VALUES.starFieldEnabled,
    starFieldDensity: preset.starFieldDensity ?? DEFAULT_PRESET_VALUES.starFieldDensity,
    starFieldColor: preset.starFieldColor ?? DEFAULT_PRESET_VALUES.starFieldColor,
    starFieldSize: preset.starFieldSize ?? DEFAULT_PRESET_VALUES.starFieldSize,
    starFieldTwinkleSpeed: preset.starFieldTwinkleSpeed ?? DEFAULT_PRESET_VALUES.starFieldTwinkleSpeed,
    isNewImport: preset.isNewImport ?? DEFAULT_PRESET_VALUES.isNewImport,
  };
}

// Validate preset data integrity
export function validatePreset(preset: any): preset is PresetType {
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

/**
 * Load and normalize presets from localStorage
 * This function handles all the common logic for reading presets from localStorage,
 * parsing them, and applying default values for backward compatibility.
 * 
 * @returns Array of normalized PresetType objects
 */
export function loadPresetsFromLocalStorage(): PresetType[] {
  try {
    const savedPresets = localStorage.getItem("sign-presets");
    if (!savedPresets) {
      return [];
    }

    const parsedPresets = JSON.parse(savedPresets);
    if (!Array.isArray(parsedPresets)) {
      console.error("Invalid presets data format in localStorage");
      return [];
    }

    // Normalize each preset to ensure all properties have default values
    return parsedPresets.map((preset: Partial<PresetType>) => normalizePreset(preset));
  } catch (error) {
    console.error("Failed to parse saved presets from localStorage:", error);
    return [];
  }
}

/**
 * Save presets to localStorage
 * This function handles saving an array of presets to localStorage.
 * 
 * @param presets Array of PresetType objects to save
 */
export function savePresetsToLocalStorage(presets: PresetType[]): void {
  try {
    localStorage.setItem("sign-presets", JSON.stringify(presets));
  } catch (error) {
    console.error("Failed to save presets to localStorage:", error);
  }
} 