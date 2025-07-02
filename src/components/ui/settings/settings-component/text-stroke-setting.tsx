"use client";
import { cn } from "@/lib/utils";
import { Baseline } from "lucide-react";
import { Slider } from "@/components/ui/inputs";
import { useSettings } from "@/lib/contexts/settings-context";
import { textStrokeConfig } from "@/lib/settings-config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs";

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

  // Convert settings to select value
  const getSelectValue = () => {
    if (!textSettings.textStrokeEnabled) return "off";
    return textSettings.textStrokeColor;
  };

  // Handle select change
  const handleValueChange = (value: string) => {
    if (value === "off") {
      // When turning off stroke, ensure fill is enabled to keep text visible
      if (!textSettings.textFillEnabled) {
        updateTextSettings({ textFillEnabled: true });
      }
      updateTextSettings({ textStrokeEnabled: false });
    } else {
      updateTextSettings({
        textStrokeEnabled: true,
        textStrokeColor: value,
      });
    }
  };

  return (
    <div className="border-b overflow-hidden">
      <div className="flex items-center justify-between p-2">
        <span className="text-sm">边框</span>
        <Select value={getSelectValue()} onValueChange={handleValueChange}>
          <SelectTrigger className="w-fit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="off">关闭</SelectItem>
            {colorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <Baseline className={cn(option.textColor)} size="12" />
                  <span>{option.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {textSettings.textStrokeEnabled && (
        <div className="p-2">
          <div className="flex items-center gap-2">
            <span className="text-xs whitespace-nowrap">宽度</span>
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