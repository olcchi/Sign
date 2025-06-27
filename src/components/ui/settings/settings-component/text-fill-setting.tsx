"use client";
import { cn } from "@/lib/utils";
import { Baseline } from "lucide-react";
import { useSettings } from "@/lib/contexts/settings-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs/select";

interface TextFillSettingProps {
  colorOptions: Array<{
    name: string;
    value: string;
    bg: string;
    textColor: string;
  }>;
}

export function TextFillSetting({ colorOptions }: TextFillSettingProps) {
  const { textSettings, updateTextSettings } = useSettings();

  // Convert settings to select value
  const getSelectValue = () => {
    if (!textSettings.textFillEnabled) return "off";
    return textSettings.textColor;
  };

  // Handle select change
  const handleValueChange = (value: string) => {
    if (value === "off") {
      // When turning off fill, ensure stroke is enabled to keep text visible
      if (!textSettings.textStrokeEnabled) {
        updateTextSettings({ textStrokeEnabled: true });
      }
      updateTextSettings({ textFillEnabled: false });
    } else {
      updateTextSettings({
        textFillEnabled: true,
        textColor: value,
      });
    }
  };

  return (
    <div className="border-b overflow-hidden">
      <div className="flex items-center justify-between p-2">
        <span className="text-sm">填充</span>
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
    </div>
  );
}
