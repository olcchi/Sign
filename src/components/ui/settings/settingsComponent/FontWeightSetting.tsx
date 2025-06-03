"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/layout/button";
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
        <Button
          size="sm"
          variant={isBold ? "default" : "ghost"}
          onClick={toggleBold}
        >
          {isBold ? <Eye size={12} /> : <EyeOff size={12} />}
          {isBold ? "开启" : "关闭"}
        </Button>
      </div>
    </div>
  );
} 