/**
 * Preset interface defining the structure of saved presets
 */
export interface Preset {
  id: string;
  name: string;
  text: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  scrollSpeed: number;
  // backgroundColor?: string;
  edgeBlurEnabled: boolean;
  edgeBlurIntensity: number;
  shinyTextEnabled: boolean;
  noiseEnabled?: boolean;
  noiseOpacity?: number;
  noiseDensity?: number;
  noiseAnimated?: boolean;
  textStrokeEnabled?: boolean;
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textFillEnabled?: boolean;
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
  noiseOpacity?: number;
  noiseDensity?: number;
  noiseAnimated?: boolean;
  textStrokeEnabled?: boolean;
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textFillEnabled?: boolean;
  onLoadPreset: (preset: Preset) => void;
  onActivePresetChange?: (preset: Preset | null) => void; // Callback for active preset changes
} 