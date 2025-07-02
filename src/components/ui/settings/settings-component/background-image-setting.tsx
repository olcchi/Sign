"use client";
import { ImagePlus, Trash2 } from "lucide-react";
import { Slider } from "@/components/ui/inputs";
import { Button } from "@/components/ui/layout";
import Image from "next/image";
import { useSettings } from "@/lib/contexts/settings-context";
import { ToggleButton } from "../toggle-button";

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
          <Button onClick={triggerFileUpload} variant="outline">
            <ImagePlus size={12} />
            <p className="text-xs whitespace-nowrap">上传图片</p>
          </Button>
          {backgroundSettings.backgroundImage && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={removeBackgroundImage}>
                <Trash2 size={12} />
                <p className="text-xs whitespace-nowrap">移除</p>
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
              <div className="absolute bg-black/30 flex-center opacity-0 hover:opacity-100 z-30 inset-0">
                <Button
                  variant="ghost"
                  onClick={triggerFileUpload}
                  className="text-xs text-white"
                >
                  <ImagePlus size={12} />
                  <p className="text-xs whitespace-nowrap">更换图片</p>
                </Button>
              </div>
              <Image
                src={previewImage || backgroundSettings.backgroundImage}
                alt="Background preview"
                fill
                sizes="50px"
                quality={90}
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="space-y-2 py-2 border-b border-border">
              {backgroundSettings.backgroundImage && (
                <div className="flex justify-between items-center px-2">
                  <p className="text-xs whitespace-nowrap">弱化背景</p>
                  <ToggleButton
                    isEnabled={backgroundSettings.overlayEnabled}
                    onToggle={() =>
                      updateBackgroundSettings({
                        overlayEnabled: !backgroundSettings.overlayEnabled,
                      })
                    }
                  />
                </div>
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
            </div>
          </>
        )}
      </div>
    )
  };
}
