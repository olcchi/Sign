"use client";

import React, { useEffect, useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/layout";
import { useSettings } from "@/lib/contexts/settings-context";
import { Textarea } from "@/components/ui/inputs";

interface ContentSettingProps {
  isOpen?: boolean;
}

export function ContentSetting({ isOpen }: ContentSettingProps) {
  const { textSettings, updateTextSettings } = useSettings();

  const [localText, setLocalText] = useState(textSettings.text);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize text sync
  useEffect(() => {
    setLocalText(textSettings.text);
  }, [textSettings.text]);

  // Save text to global state
  const saveText = () => {
    // Ensure save when text is empty
    const finalText = localText.trim() === "" ? "Sign" : localText;
    updateTextSettings({ text: finalText });
    // Update local text
    if (localText.trim() === "") {
      setLocalText("Sign");
    }
    setIsEditing(false);
  };

  // Revert changes
  const revertText = () => {
    setLocalText(textSettings.text);
    setIsEditing(false);
  };

  return {
    title: (
      <div className="flex items-center justify-between w-full">
        <span>内容</span>
        {isEditing && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                saveText();
              }}
            >
              <Save size={12} className="mr-1" />
              保存
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                revertText();
              }}
            >
              <RotateCcw size={12} className="mr-1" />
              撤销
            </Button>
          </div>
        )}
      </div>
    ),
    component: (
      <Textarea
        value={localText}
        onChange={(e) => {
          // Update local state
          setLocalText(e.target.value);
          // Set editing state to true
          setIsEditing(true);
        }}
        className="w-full bg-muted min-h-16 max-h-24 text-xs font-sans overflow-y-auto custom-scrollbar"
        placeholder="请输入文本内容..."
        onFocus={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => e.stopPropagation()}
      />
    ),
  };
}