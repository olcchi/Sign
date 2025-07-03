"use client";
import { useSettings } from "@/lib/contexts/settings-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/inputs";

export function FontItalicSetting() {
  const { textSettings, updateTextSettings } = useSettings();

  // Convert font italic boolean to select value
  const getSelectValue = () => {
    return textSettings.fontItalic ? "italic" : "normal";
  };

  // Handle select change
  const handleValueChange = (value: string) => {
    updateTextSettings({
      fontItalic: value === "italic",
    });
  };

  return (
    <Select value={getSelectValue()} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="normal">正常</SelectItem>
        <SelectItem value="italic">斜体</SelectItem>
      </SelectContent>
    </Select>
  );
} 