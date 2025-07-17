"use client";
import { Slider } from "@/components/ui/inputs";
import { ToggleButton } from "@/components/ui/settings";
import { useSettings } from "@/lib/contexts/settings-context";
import { edgeBlurConfig, noiseConfig, starFieldConfig, colorOptions } from "@/lib/settings-config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/inputs";

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
                <p className="text-sm  whitespace-nowrap text-muted-foreground">强度</p>
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
                <span className="text-sm whitespace-nowrap text-muted-foreground">尺寸</span>
                <Slider
                  defaultValue={[effectsSettings.noisePatternSize]}
                  value={[effectsSettings.noisePatternSize]}
                  min={noiseConfig.patternSize.min}
                  max={noiseConfig.patternSize.max}
                  step={noiseConfig.patternSize.step}
                  onValueChange={(value) =>
                    updateEffectsSettings({ noisePatternSize: value[0] })
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm whitespace-nowrap text-muted-foreground">透明度</span>
                <Slider
                  defaultValue={[effectsSettings.noisePatternAlpha]}
                  value={[effectsSettings.noisePatternAlpha]}
                  min={noiseConfig.patternAlpha.min}
                  max={noiseConfig.patternAlpha.max}
                  step={noiseConfig.patternAlpha.step}
                  onValueChange={(value) =>
                    updateEffectsSettings({ noisePatternAlpha: value[0] })
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

        <div className="border-b overflow-hidden">
          <div className="flex justify-between items-center p-2">
            <span className="text-sm ">闪点</span>
            <ToggleButton
              isEnabled={effectsSettings.starFieldEnabled}
              onToggle={() =>
                updateEffectsSettings({
                  starFieldEnabled: !effectsSettings.starFieldEnabled,
                })
              }
            />
          </div>

          {effectsSettings.starFieldEnabled && (
            <div className="p-2 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm whitespace-nowrap text-muted-foreground">密度</span>
                <Slider
                  defaultValue={[effectsSettings.starFieldDensity]}
                  value={[effectsSettings.starFieldDensity]}
                  min={starFieldConfig.density.min}
                  max={starFieldConfig.density.max}
                  step={starFieldConfig.density.step}
                  onValueChange={(value) =>
                    updateEffectsSettings({ starFieldDensity: value[0] })
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm whitespace-nowrap text-muted-foreground">大小</span>
                <Slider
                  defaultValue={[effectsSettings.starFieldSize]}
                  value={[effectsSettings.starFieldSize]}
                  min={starFieldConfig.size.min}
                  max={starFieldConfig.size.max}
                  step={starFieldConfig.size.step}
                  onValueChange={(value) =>
                    updateEffectsSettings({ starFieldSize: value[0] })
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm whitespace-nowrap text-muted-foreground">速度</span>
                <Slider
                  defaultValue={[effectsSettings.starFieldTwinkleSpeed]}
                  value={[effectsSettings.starFieldTwinkleSpeed]}
                  min={starFieldConfig.twinkleSpeed.min}
                  max={starFieldConfig.twinkleSpeed.max}
                  step={starFieldConfig.twinkleSpeed.step}
                  onValueChange={(value) =>
                    updateEffectsSettings({ starFieldTwinkleSpeed: value[0] })
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <Select
                  value={effectsSettings.starFieldColor}
                  onValueChange={(value) =>
                    updateEffectsSettings({ starFieldColor: value })
                  }
                >
                  <SelectTrigger className="w-full h-6">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.value }}
                          />
                          <span>{color.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
  };
}