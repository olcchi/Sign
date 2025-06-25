// API types
export * from './api';

// Feedback types
export type { Feedback, ProcessedFeedback, CreateFeedbackRequest, FeedbackRating } from './feedback';

// Component types
export type { Preset, PresetManagerProps } from '@/components/ui/settings/Preset/types';
export type { ShareablePreset } from '@/lib/share-api';
export type { ImageSize } from '@/lib/types/common';

// Re-export common types
export type { TextSettings, BackgroundSettings, EffectsSettings } from '@/lib/contexts/settings-context';

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