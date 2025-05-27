"use client";

import React from "react";
import { OptionButtonGroup } from "@/components/ui/settings/OptionButtonGroup";
import { useSettings } from "@/lib/contexts/SettingsContext";

export function ScrollSpeedSetting() {
  const { textSettings, updateTextSettings } = useSettings();

  return {
    title: "滚动速度",
    component: (
      <OptionButtonGroup<{ name: string; value: string }>
        options={[
          { name: "0.3x", value: "3" },
          { name: "0.5x", value: "5" },
          { name: "1x", value: "10" },
          { name: "1.5x", value: "15" },
          { name: "2x", value: "20" },
        ]}
        selectedValue={textSettings.scrollSpeed.toString()}
        onChange={(value) =>
          updateTextSettings({ scrollSpeed: parseInt(value, 10) })
        }
      />
    ),
  };
} 