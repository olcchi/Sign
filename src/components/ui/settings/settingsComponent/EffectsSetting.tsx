"use client";

import React from "react";
import { Slider } from "@/components/ui/inputs/slider";
import { ToggleButton } from "@/components/ui/settings/ToggleButton";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { edgeBlurConfig, noiseConfig } from "@/lib/settings-config";

export function EffectsSetting() {
  const { effectsSettings, updateEffectsSettings } = useSettings();

  return {
    title: "特效",
    component: (
      <div className="space-y-2">
        <div className="border-b overflow-hidden">
          <div className="flex justify-between items-center p-2">
            <span className="text-sm ">聚焦</span>
            <ToggleButton
              isEnabled={effectsSettings.edgeBlurEnabled}
              onToggle={() =>
                updateEffectsSettings({
                  edgeBlurEnabled: !effectsSettings.edgeBlurEnabled,
                })
              }
            />
          </div>

          {effectsSettings.edgeBlurEnabled && (
            <div className="p-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm whitespace-nowrap ">强度</p>
                <Slider
                  defaultValue={[effectsSettings.edgeBlurIntensity]}
                  value={[effectsSettings.edgeBlurIntensity]}
                  min={edgeBlurConfig.min}
                  max={edgeBlurConfig.max}
                  step={edgeBlurConfig.step}
                  onValueChange={(value) =>
                    updateEffectsSettings({ edgeBlurIntensity: value[0] })
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-b overflow-hidden">
          <div className="flex justify-between items-center p-2">
            <span className="text-sm ">噪点</span>
            <ToggleButton
              isEnabled={effectsSettings.noiseEnabled}
              onToggle={() =>
                updateEffectsSettings({
                  noiseEnabled: !effectsSettings.noiseEnabled,
                })
              }
            />
          </div>

          {effectsSettings.noiseEnabled && (
            <div className="p-2 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm whitespace-nowrap ">亮度</span>
                <Slider
                  defaultValue={[effectsSettings.noiseOpacity]}
                  value={[effectsSettings.noiseOpacity]}
                  min={noiseConfig.opacity.min}
                  max={noiseConfig.opacity.max}
                  step={noiseConfig.opacity.step}
                  onValueChange={(value) =>
                    updateEffectsSettings({ noiseOpacity: value[0] })
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm whitespace-nowrap ">密度</span>
                <Slider
                  defaultValue={[effectsSettings.noiseDensity]}
                  value={[effectsSettings.noiseDensity]}
                  min={noiseConfig.density.min}
                  max={noiseConfig.density.max}
                  step={noiseConfig.density.step}
                  onValueChange={(value) =>
                    updateEffectsSettings({ noiseDensity: value[0] })
                  }
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">动画</span>
                <ToggleButton
                  isEnabled={effectsSettings.noiseAnimated}
                  onToggle={() =>
                    updateEffectsSettings({
                      noiseAnimated: !effectsSettings.noiseAnimated,
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-b overflow-hidden">
          <div className="flex justify-between items-center p-2">
            <span className="text-sm ">闪光</span>
            <ToggleButton
              isEnabled={effectsSettings.shinyTextEnabled}
              onToggle={() =>
                updateEffectsSettings({
                  shinyTextEnabled: !effectsSettings.shinyTextEnabled,
                })
              }
            />
          </div>
        </div>
      </div>
    ),
  };
} 