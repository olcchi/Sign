"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Baseline, Eye, EyeOff } from "lucide-react";
import { Slider } from "@/components/ui/inputs/slider";
import { Button } from "@/components/ui/layout/button";
import { OptionButtonGroup } from "@/components/ui/settings/OptionButtonGroup";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { textStrokeConfig } from "@/lib/settings-config";

interface TextRenderingSettingProps {
  colorOptions: Array<{
    name: string;
    value: string;
    bg: string;
    textColor: string;
  }>;
}

export function TextRenderingSetting({ colorOptions }: TextRenderingSettingProps) {
  const { textSettings, updateTextSettings } = useSettings();

  return {
    title: "字体渲染",
    component: (
      <div className="space-y-2">
        <div className="border-b overflow-hidden">
          <div className="flex justify-between items-center p-2">
            <span className="text-sm ">填充</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (
                  textSettings.textFillEnabled &&
                  !textSettings.textStrokeEnabled
                ) {
                  updateTextSettings({ textStrokeEnabled: true });
                }
                updateTextSettings({
                  textFillEnabled: !textSettings.textFillEnabled,
                });
              }}
              disabled={
                !textSettings.textFillEnabled &&
                !textSettings.textStrokeEnabled
              }
            >
              {textSettings.textFillEnabled ? (
                <Eye size={12} />
              ) : (
                <EyeOff size={12} />
              )}
              {textSettings.textFillEnabled ? "开启" : "关闭"}
            </Button>
          </div>

          {textSettings.textFillEnabled && (
            <div className="p-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap ">颜色</span>
                <OptionButtonGroup
                  options={colorOptions}
                  selectedValue={textSettings.textColor}
                  onChange={(color) =>
                    updateTextSettings({ textColor: color })
                  }
                  buttonSize="icon"
                  renderOption={(option) => (
                    <Baseline className={cn(option.textColor)} size="12" />
                  )}
                />
              </div>
            </div>
          )}
        </div>

        <div className="border-b overflow-hidden">
          <div className="flex justify-between items-center p-2">
            <span className="text-sm ">边框</span>
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
                !textSettings.textFillEnabled &&
                !textSettings.textStrokeEnabled
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
              <div className="flex items-center  gap-2">
                <span className="text-sm whitespace-nowrap ">颜色</span>
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
                <span className="text-sm whitespace-nowrap ">宽度</span>
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
      </div>
    ),
  };
} 