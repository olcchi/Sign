"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Baseline } from "lucide-react";
import { Slider } from "@/components/ui/inputs/slider";
import { ToggleButton } from "@/components/ui/settings/ToggleButton";
import { OptionButtonGroup } from "@/components/ui/settings/OptionButtonGroup";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { textStrokeConfig } from "@/lib/settings-config";

interface TextStrokeSettingProps {
  colorOptions: Array<{
    name: string;
    value: string;
    bg: string;
    textColor: string;
  }>;
}

export function TextStrokeSetting({ colorOptions }: TextStrokeSettingProps) {
  const { textSettings, updateTextSettings } = useSettings();

  return (
    <div className="border-b overflow-hidden">
      <div className="flex justify-between items-center p-2">
        <span className="text-xs font-bold">边框</span>
        <ToggleButton
          isEnabled={textSettings.textStrokeEnabled}
          onToggle={() => {
            if (
              textSettings.textStrokeEnabled &&
              !textSettings.textFillEnabled
            ) {
              updateTextSettings({ textFillEnabled: true });
            }
            updateTextSettings({
              textStrokeEnabled: !textSettings.textStrokeEnabled,
            });
          }}
          disabled={
            !textSettings.textFillEnabled && !textSettings.textStrokeEnabled
          }
        />
      </div>

      {textSettings.textStrokeEnabled && (
        <div className="p-2 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold whitespace-nowrap">颜色</span>
            <OptionButtonGroup
              options={colorOptions}
              selectedValue={textSettings.textStrokeColor}
              onChange={(color) =>
                updateTextSettings({ textStrokeColor: color })
              }
              buttonSize="icon"
              renderOption={(option) => (
                <Baseline className={cn(option.textColor)} size="12" />
              )}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold whitespace-nowrap">宽度</span>
            <Slider
              defaultValue={[textSettings.textStrokeWidth]}
              value={[textSettings.textStrokeWidth]}
              min={textStrokeConfig.min}
              max={textStrokeConfig.max}
              step={textStrokeConfig.step}
              onValueChange={(value) =>
                updateTextSettings({ textStrokeWidth: value[0] })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
} 