"use client";

import React, { useRef, useEffect, useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/layout/button";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface ContentSettingProps {
  isOpen?: boolean;
}

export function ContentSetting({ isOpen }: ContentSettingProps) {
  const { textSettings, updateTextSettings } = useSettings();
  
  const [localText, setLocalText] = useState(textSettings.text);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize text sync
  useEffect(() => {
    setLocalText(textSettings.text);
  }, [textSettings.text]);

  // Adjust text area height function
  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    const newHeight = Math.min(80, element.scrollHeight);
    element.style.height = `${newHeight}px`;
  };

  // Initial load adjust height
  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight(textareaRef.current);
    }
  }, [localText]);

  // Force height adjustment when component becomes visible
  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight(textareaRef.current);
    }
  }, [isOpen]);

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
      <button className="w-full rounded-md text-left px-3 py-2 text-sm font-sans relative overflow-hidden border bg-muted">
        <textarea
          ref={textareaRef}
          value={localText}
          onChange={(e) => {
            // Update local state
            setLocalText(e.target.value);
            // Set editing state to true
            setIsEditing(true);
            // Adjust height
            adjustHeight(e.target);
          }}
          className="w-full resize-none bg-transparent outline-none border-none text-sm font-sans min-h-[32px] overflow-y-auto max-h-[80px] custom-scrollbar"
          placeholder="请输入文本内容..."
          onFocus={(e) => {
            adjustHeight(e.target);
            e.stopPropagation();
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </button>
    ),
  };
} 