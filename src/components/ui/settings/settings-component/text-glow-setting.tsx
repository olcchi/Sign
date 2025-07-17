"use client";
import { cn } from "@/lib/utils";
import { Circle, Zap, Palette } from "lucide-react";
import { useSettings } from "@/lib/contexts/settings-context";
import { textShadowConfig } from "@/lib/settings-config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs";
import { Slider } from "@/components/ui/inputs";
import { ToggleButton } from "@/components/ui/settings/toggle-button";

interface TextGlowSettingProps {
  colorOptions: Array<{
    name: string;
    value: string;
    bg: string;
    textColor: string;
  }>;
}

export function TextGlowSetting({ colorOptions }: TextGlowSettingProps) {
  const { textSettings, updateTextSettings } = useSettings();

  // Handle glow toggle
  const handleGlowToggle = () => {
    updateTextSettings({ textGlowEnabled: !textSettings.textGlowEnabled });
  };

  // Handle color change
  const handleColorChange = (value: string) => {
    updateTextSettings({ textGlowColor: value });
  };



  // Handle intensity change
  const handleIntensityChange = (value: number[]) => {
    updateTextSettings({ textGlowIntensity: value[0] });
  };

  // Handle blur change
  const handleBlurChange = (value: number[]) => {
    updateTextSettings({ textGlowBlur: value[0] });
  };



  return (
    <div className="border-b overflow-hidden">
      <div className="flex items-center justify-between p-2">
        <span className="text-sm">阴影</span>
        <ToggleButton
          isEnabled={textSettings.textGlowEnabled}
          onToggle={handleGlowToggle}
        />
      </div>
      
      {textSettings.textGlowEnabled && (
        <div className="px-2 pb-2 space-y-2">
          {/* Color Selection */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">颜色</span>
            <Select value={textSettings.textGlowColor} onValueChange={handleColorChange}>
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <Circle className={cn(option.textColor)} size="12" fill="currentColor" />
                  <span>{option.name}</span>
                </div>
              </SelectItem>
            ))}
              </SelectContent>
            </Select>
          </div>
          

          {/* Intensity Slider */}
          <div className="space-y-1 flex gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm whitespace-nowrap text-muted-foreground">强度</span>
            </div>
            <Slider
              value={[textSettings.textGlowIntensity]}
              onValueChange={handleIntensityChange}
              min={textShadowConfig.intensity.min}
              max={textShadowConfig.intensity.max}
              step={textShadowConfig.intensity.step}
              className="w-full"
            />
          </div>
          
          {/* Blur Slider */}
          <div className="space-y-1 flex gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm whitespace-nowrap text-muted-foreground">模糊</span>
            </div>
            <Slider
               value={[textSettings.textGlowBlur]}
               onValueChange={handleBlurChange}
               min={textShadowConfig.blur.min}
               max={textShadowConfig.blur.max}
               step={textShadowConfig.blur.step}
               className="w-full"
             />
          </div>
        </div>
      )}
    </div>
  );
}