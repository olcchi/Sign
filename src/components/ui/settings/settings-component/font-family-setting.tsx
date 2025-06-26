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
    <Select
      value={textSettings.fontFamily}
      onValueChange={(font) => updateTextSettings({ fontFamily: font })}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {fontOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span>{option.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 