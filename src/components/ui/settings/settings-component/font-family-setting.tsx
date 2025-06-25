"use client";

import React from "react";
import { OptionButtonGroup } from "@/components/ui/settings/option-button-group";
import { useSettings } from "@/lib/contexts/settings-context";

interface FontFamilySettingProps {
  fontOptions: Array<{
    name: string;
    value: string;
    fontFamily: string;
  }>;
}

export function FontFamilySetting({ fontOptions }: FontFamilySettingProps) {
  const { textSettings, updateTextSettings } = useSettings();

  return (
    <div className="border-b overflow-hidden">
      <div className="flex items-center justify-between p-2">
        <span className="text-sm">样式</span>
      </div>
      <div className="p-2">
        <OptionButtonGroup
          options={fontOptions}
          selectedValue={textSettings.fontFamily}
          onChange={(font) => updateTextSettings({ fontFamily: font })}
          renderOption={(option) => (
            <span style={{ fontFamily: option.value }}>{option.name}</span>
          )}
        />
      </div>
    </div>
  );
} 