"use client";

import React from "react";
import { Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { Slider } from "@/components/ui/inputs/slider";
import { Button } from "@/components/ui/layout/button";
import Image from "next/image";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface BackgroundImageSettingProps {
  previewImage: string | null;
  previewContainerRef: React.RefObject<HTMLDivElement | null>;
  handlePositionChange: (axis: "x" | "y", value: number[]) => void;
  sliderDisabled: { x: boolean; y: boolean };
  triggerFileUpload: () => void;
  removeBackgroundImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BackgroundImageSetting({
  previewImage,
  previewContainerRef,
  handlePositionChange,
  sliderDisabled,
  triggerFileUpload,
  removeBackgroundImage,
  fileInputRef,
  handleFileChange,
}: BackgroundImageSettingProps) {
  const { backgroundSettings, updateBackgroundSettings } = useSettings();

  return {
    title: "背景",
    component: (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button onClick={triggerFileUpload} variant="secondary">
            <ImageIcon size={14} />
            <p className="text-xs whitespace-nowrap">上传图片</p>
          </Button>
          {backgroundSettings.backgroundImage && (
            <div className="flex items-center gap-2">
              <Button variant="destructive" onClick={removeBackgroundImage}>
                <p className="text-xs whitespace-nowrap">移除图片</p>
              </Button>
            </div>
          )}
        </div>
        {backgroundSettings.backgroundImage && (
          <>
            <div
              className="relative w-full h-20 rounded-md overflow-hidden border"
              ref={previewContainerRef}
            >
              <Image
                src={previewImage || backgroundSettings.backgroundImage}
                alt="Background preview"
                fill
                sizes="50px"
                style={{
                  objectFit: "cover",
                  // objectPosition: `${backgroundSettings.backgroundPosition.x}% ${backgroundSettings.backgroundPosition.y}%`,
                  // transform: `scale(${backgroundSettings.backgroundZoom})`,
                  // transformOrigin: "50% 50%",
                }}
              />
            </div>
            <div className="space-y-2">
              {backgroundSettings.backgroundImage && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateBackgroundSettings({
                      overlayEnabled: !backgroundSettings.overlayEnabled,
                    })
                  }
                >
                  {backgroundSettings.overlayEnabled ? (
                    <Eye size={12} />
                  ) : (
                    <EyeOff size={12} />
                  )}
                  <p className="text-xs whitespace-nowrap">弱化背景</p>
                </Button>
              )}
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs whitespace-nowrap ">水平</p>
                <Slider
                  defaultValue={[backgroundSettings.backgroundPosition.x]}
                  value={[backgroundSettings.backgroundPosition.x]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handlePositionChange("x", value)}
                  disabled={sliderDisabled.x}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs whitespace-nowrap ">垂直</p>
                <Slider
                  defaultValue={[backgroundSettings.backgroundPosition.y]}
                  value={[backgroundSettings.backgroundPosition.y]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handlePositionChange("y", value)}
                  disabled={sliderDisabled.y}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs whitespace-nowrap ">缩放</p>
                <Slider
                  defaultValue={[backgroundSettings.backgroundZoom]}
                  value={[backgroundSettings.backgroundZoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={(value) =>
                    updateBackgroundSettings({ backgroundZoom: value[0] })
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    ),
  };
}
