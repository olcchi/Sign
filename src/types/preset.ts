/**
 * Preset interface defining the structure of saved presets
 */
export interface PresetType {
  id: string;
  name: string;
  text: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontItalic: boolean;
  scrollSpeed: number;
  edgeBlurEnabled: boolean;
  edgeBlurIntensity: number;
  shinyTextEnabled: boolean;
  noiseEnabled?: boolean;
  noisePatternSize?: number;
  noisePatternAlpha?: number;
  textStrokeEnabled?: boolean;
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textFillEnabled?: boolean;
  textGlowEnabled?: boolean;
  textGlowColor?: string;
  textGlowIntensity?: number;
  textGlowBlur?: number;
  starFieldEnabled?: boolean;
  starFieldDensity?: number;
  starFieldColor?: string;
  starFieldSize?: number;
  starFieldTwinkleSpeed?: number;
  isNewImport?: boolean; // Mark newly imported presets that haven't been used yet
}

/**
 * Props for the PresetManager component
 */
export interface PresetManagerProps {
  text: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontItalic: boolean;
  scrollSpeed: number;
  edgeBlurEnabled: boolean;
  edgeBlurIntensity: number;
  shinyTextEnabled: boolean;
  noiseEnabled?: boolean;
  noisePatternSize?: number;
  noisePatternAlpha?: number;
  textStrokeEnabled?: boolean;
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textFillEnabled?: boolean;
  textGlowEnabled?: boolean;
  textGlowColor?: string;
  textGlowIntensity?: number;
  textGlowBlur?: number;
  starFieldEnabled?: boolean;
  starFieldDensity?: number;
  starFieldColor?: string;
  starFieldSize?: number;
  starFieldTwinkleSpeed?: number;
  onLoadPreset: (preset: PresetType) => void;
  onActivePresetChange?: (preset: PresetType | null) => void; // Callback for active preset changes
}