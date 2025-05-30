"use client";

import React from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Preset } from "@/components/ui/settings/Preset";
import { applyPreset } from "@/lib/preset-utils";
import SharePresetDialog from "@/components/ui/share/ShareConfigDialog";
import PinCodeInput from "@/components/ui/share/PinCodeInput";
import { Button } from "@/components/ui/layout/button";
import { Share2, CloudDownload, AlertCircle } from "lucide-react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/layout/alert";

interface ShareSettingProps {
  activePreset?: Preset | null; // Current active preset from preset manager
}

// Share setting component for preset sharing functionality
export function ShareSetting({ activePreset }: ShareSettingProps) {
  const {
    updateTextSettings,
    updateBackgroundSettings,
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

  const component = (
    <div className="space-y-3 flex-col gap-2">
      <div className="flex gap-2">
        {/* Share current active preset */}
        <SharePresetDialog activePreset={activePreset}>
          <Button variant="outline" className=" justify-start">
            <Share2 className="mr-2 h-4 w-4" />
            分享预设
          </Button>
        </SharePresetDialog>

        {/* Load shared preset */}
        <PinCodeInput onPresetLoaded={handlePresetLoaded}>
          <Button variant="outline" className="justify-start">
            <CloudDownload className="mr-2 h-4 w-4" />
            加载预设
          </Button>
        </PinCodeInput>
      </div>
      <Alert className="text-xs">
        <AlertCircle />
        <AlertTitle>提示</AlertTitle>
        <AlertDescription className="text-xs">
          <p>PIN码有效期24小时</p>
        </AlertDescription>
      </Alert>
    </div>
  );

  return {
    title: "分享预设",
    component,
  };
}
