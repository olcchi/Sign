"use client";

import React from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Preset } from "@/components/ui/settings/Preset";
import { applyPreset } from "@/lib/preset-utils";
import ShareDialog from "@/components/ui/share/ShareDialog";
import ImportDialog from "@/components/ui/share/ImportDialog";
import { Button } from "@/components/ui/layout/button";
import { CloudUpload, CloudDownload, AlertCircle } from "lucide-react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/layout/alert";

interface ShareSettingProps {
  activePreset?: Preset | null; // Current active preset from preset manager
  savedPresets?: Preset[]; // All saved presets for matching
}

// Share setting component for preset sharing functionality
export function ShareSetting({ activePreset, savedPresets = [] }: ShareSettingProps) {
  const {
    textSettings,
    effectsSettings,
    updateTextSettings,
    updateEffectsSettings,
  } = useSettings();

  // Handle loading shared preset
  const handlePresetLoaded = (preset: Preset) => {
    // Apply preset using the preset utility function
    applyPreset(preset, {
      onTextChange: (text) => updateTextSettings({ text }),
      onColorChange: (color) => updateTextSettings({ textColor: color }),
      onFontChange: (font) => updateTextSettings({ fontFamily: font }),
      onFontSizeChange: (size) => updateTextSettings({ fontSize: size }),
      onScrollSpeedChange: (speed) =>
        updateTextSettings({ scrollSpeed: speed }),
      onEdgeBlurEnabledChange: (enabled) =>
        updateEffectsSettings({ edgeBlurEnabled: enabled }),
      onEdgeBlurIntensityChange: (intensity) =>
        updateEffectsSettings({ edgeBlurIntensity: intensity }),
      onShinyTextEnabledChange: (enabled) =>
        updateEffectsSettings({ shinyTextEnabled: enabled }),
      onNoiseEnabledChange: (enabled) =>
        updateEffectsSettings({ noiseEnabled: enabled }),
      onNoiseOpacityChange: (opacity) =>
        updateEffectsSettings({ noiseOpacity: opacity }),
      onNoiseDensityChange: (density) =>
        updateEffectsSettings({ noiseDensity: density }),
      onTextStrokeEnabledChange: (enabled) =>
        updateTextSettings({ textStrokeEnabled: enabled }),
      onTextStrokeWidthChange: (width) =>
        updateTextSettings({ textStrokeWidth: width }),
      onTextStrokeColorChange: (color) =>
        updateTextSettings({ textStrokeColor: color }),
      onTextFillEnabledChange: (enabled) =>
        updateTextSettings({ textFillEnabled: enabled }),
    });
  };

  return (
    <div className="space-y-3 flex-col gap-2">
      <div className="flex gap-2">
        {/* Share current settings */}
        <ShareDialog 
          activePreset={activePreset}
          currentTextSettings={textSettings}
          currentEffectsSettings={effectsSettings}
          savedPresets={savedPresets}
        >
          <Button variant="secondary" size="sm" className="flex-1 justify-center text-xs">
            <CloudUpload className="mr-2 h-3 w-3" />
            分享预设
          </Button>
        </ShareDialog>

        {/* Load shared preset */}
        <ImportDialog onPresetLoaded={handlePresetLoaded}>
          <Button variant="secondary" size="sm" className="flex-1 justify-center text-xs">
            <CloudDownload className="mr-2 h-3 w-3" />
            加载预设
          </Button>
        </ImportDialog>
      </div>
    </div>
  );
}
