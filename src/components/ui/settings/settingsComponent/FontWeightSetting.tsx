"use client";

import React from "react";
import { ToggleButton } from "@/components/ui/settings/ToggleButton";
import { useSettings } from "@/lib/contexts/SettingsContext";

export function FontWeightSetting() {
  const { textSettings, updateTextSettings } = useSettings();

  // Check if current font weight is bold
  const isBold = textSettings.fontWeight === "700";

  // Toggle between normal and bold
  const toggleBold = () => {
    updateTextSettings({
      fontWeight: isBold ? "400" : "700",
    });
  };

  return (
    <div className="border-b overflow-hidden">
      <div className="flex justify-between items-center p-2">
        <span className="text-sm">粗体</span>
        <ToggleButton
          isEnabled={isBold}
          onToggle={toggleBold}
          variant={isBold ? "default" : "ghost"}
        />
      </div>
    </div>
  );
} 