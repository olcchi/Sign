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
  starFieldEnabled?: boolean;
  starFieldDensity?: number;
  starFieldColor?: string;
  starFieldSize?: number;
  starFieldTwinkleSpeed?: number;
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
  starFieldEnabled?: boolean;
  starFieldDensity?: number;
  starFieldColor?: string;
  starFieldSize?: number;
  starFieldTwinkleSpeed?: number;
  onLoadPreset: (preset: PresetType) => void;
  onActivePresetChange?: (preset: PresetType | null) => void; // Callback for active preset changes
}

// Type alias for sharing - same as PresetType but with semantic meaning
export type ShareablePreset = PresetType; 