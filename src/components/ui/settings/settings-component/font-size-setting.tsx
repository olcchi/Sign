"use client";

import React from "react";
import { useSettings } from "@/lib/contexts/settings-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/layout/select";

interface FontSizeSettingProps {
  fontSizeOptions: Array<{
    name: string;
    value: string;
  }>;
}

export function FontSizeSetting({ fontSizeOptions }: FontSizeSettingProps) {
  const { textSettings, updateTextSettings } = useSettings();

  return (
    <Select
      value={textSettings.fontSize}
      onValueChange={(size) => updateTextSettings({ fontSize: size })}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {fontSizeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 