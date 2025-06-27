// API types
export * from './api';

// Feedback types
export type { Feedback, ProcessedFeedback, CreateFeedbackRequest, FeedbackRating } from './feedback';

// Component types
export type { PresetType, PresetManagerProps } from '@/components/ui/settings/preset-manager/types';
export type { ImageSize } from '@/lib/types/common';

// Preset sharing interface
export interface ShareablePreset {
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
  noiseOpacity?: number;
  noiseDensity?: number;
  noiseAnimated?: boolean;
  textStrokeEnabled?: boolean;
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textFillEnabled?: boolean;
}

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
  noiseOpacity: number;
  noiseDensity: number;
  noiseAnimated: boolean;
}

// Base Props interfaces for common UI patterns
export interface BaseDialogProps {
  children: React.ReactNode;
  className?: string;
}

export interface BaseComponentProps {
  className?: string;
}

export interface BaseSettingProps extends BaseComponentProps {
  isOpen?: boolean;
} 