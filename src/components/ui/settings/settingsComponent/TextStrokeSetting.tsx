"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Baseline, Eye, EyeOff } from "lucide-react";
import { Slider } from "@/components/ui/inputs/slider";
import { Button } from "@/components/ui/layout/button";
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
        <span className="text-sm">边框</span>
        <Button
          size="sm"
          variant={"ghost"}
          onClick={() => {
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
        >
          {textSettings.textStrokeEnabled ? (
            <Eye size={12} />
          ) : (
            <EyeOff size={12} />
          )}
          {textSettings.textStrokeEnabled ? "开启" : "关闭"}
        </Button>
      </div>

      {textSettings.textStrokeEnabled && (
        <div className="p-2 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">颜色</span>
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
            <span className="text-sm whitespace-nowrap">宽度</span>
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