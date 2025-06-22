"use client";
import { cn } from "@/lib/utils";
import { Baseline } from "lucide-react";
import { ToggleButton } from "@/components/ui/settings/toggle-button";
import { OptionButtonGroup } from "@/components/ui/settings/option-button-group";
import { useSettings } from "@/lib/contexts/settings-context";

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

  return (
    <div className="border-b overflow-hidden">
      <div className="flex justify-between items-center p-2">
        <span className="text-sm ">填充</span>
        <ToggleButton
          isEnabled={textSettings.textFillEnabled}
          onToggle={() => {
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
            !textSettings.textFillEnabled && !textSettings.textStrokeEnabled
          }
        />
      </div>

      {textSettings.textFillEnabled && (
        <div className="p-2 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs whitespace-nowrap">颜色</span>
            <OptionButtonGroup
              options={colorOptions}
              selectedValue={textSettings.textColor}
              onChange={(color) => updateTextSettings({ textColor: color })}
              buttonSize="icon"
              renderOption={(option) => (
                <Baseline className={cn(option.textColor)} size="12" />
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
