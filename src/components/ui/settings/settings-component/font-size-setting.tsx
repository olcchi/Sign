"use client";

import React from "react";
import { OptionButtonGroup } from "@/components/ui/settings/option-button-group";
import { useSettings } from "@/lib/contexts/settings-context";

interface FontSizeSettingProps {
  fontSizeOptions: Array<{
    name: string;
    value: string;
  }>;
}

export function FontSizeSetting({ fontSizeOptions }: FontSizeSettingProps) {
  const { textSettings, updateTextSettings } = useSettings();

  return (
    <div className="border-b overflow-hidden">
      <div className="flex items-center p-2">
        <span className="text-sm">尺寸</span>
      <div className="p-2">
        <OptionButtonGroup
          options={fontSizeOptions}
          selectedValue={textSettings.fontSize}
          buttonSize="icon"
          onChange={(size) => updateTextSettings({ fontSize: size })}
        />
      </div>
      </div>
    </div>
  );
} 