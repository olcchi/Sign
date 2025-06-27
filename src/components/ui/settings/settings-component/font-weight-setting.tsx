"use client";

import React from "react";
import { useSettings } from "@/lib/contexts/settings-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs/select";

export function FontWeightSetting() {
  const { textSettings, updateTextSettings } = useSettings();

  // Convert font weight to select value
  const getSelectValue = () => {
    return textSettings.fontWeight === "700" ? "bold" : "normal";
  };

  // Handle select change
  const handleValueChange = (value: string) => {
    updateTextSettings({
      fontWeight: value === "bold" ? "700" : "400",
    });
  };

  return (
    <Select value={getSelectValue()} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="normal">正常</SelectItem>
        <SelectItem value="bold">粗体</SelectItem>
      </SelectContent>
    </Select>
  );
} 