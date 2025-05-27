"use client";

import React from "react";
import { OptionButtonGroup } from "@/components/ui/settings/OptionButtonGroup";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface FontSizeSettingProps {
  fontSizeOptions: Array<{
    name: string;
    value: string;
  }>;
}

export function FontSizeSetting({ fontSizeOptions }: FontSizeSettingProps) {
  const { textSettings, updateTextSettings } = useSettings();

  return {
    title: "字体尺寸",
    component: (
      <OptionButtonGroup
        options={fontSizeOptions}
        selectedValue={textSettings.fontSize}
        buttonSize="icon"
        onChange={(size) => updateTextSettings({ fontSize: size })}
      />
    ),
  };
} 