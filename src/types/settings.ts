// Settings interfaces
export interface TextSettings {
  text: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  scrollSpeed: number;
  textStrokeEnabled: boolean;
  textStrokeWidth: number;
  textStrokeColor: string;
  textFillEnabled: boolean;
}

export interface BackgroundSettings {
  backgroundColor: string;
  backgroundImage: string | null;
  backgroundPosition: { x: number; y: number };
  backgroundZoom: number;
  overlayEnabled: boolean;
}

export interface EffectsSettings {
  edgeBlurEnabled: boolean;
  edgeBlurIntensity: number;
  shinyTextEnabled: boolean;
  noiseEnabled: boolean;
  noisePatternSize: number;
  noisePatternAlpha: number;
  starFieldEnabled: boolean;
  starFieldDensity: number;
  starFieldColor: string;
  starFieldSize: number;
  starFieldTwinkleSpeed: number;
} 