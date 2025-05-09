'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Baseline,
  Image as ImageIcon,
  EyeOff,
  Eye,
  MoveHorizontal,
  MoveVertical,
} from 'lucide-react';
import { Slider } from '@/components/ui/inputs/slider';
import { Button } from '@/components/ui/button/button';
import { OptionButtonGroup } from '@/components/ui/settings/OptionButtonGroup';
import Image from 'next/image';

// Interface for toolbar settings parameters
export interface ToolBarSettingsProps {
  text: string;
  enterEditMode: () => void;
  fontSize: string;
  onFontSizeChange: (size: string) => void;
  textColor: string;
  onColorChange: (color: string) => void;
  fontFamily: string;
  onFontChange: (font: string) => void;
  scrollSpeed: number;
  onScrollSpeedChange: (speed: number) => void;
  backgroundImage: string | null;
  triggerFileUpload: () => void;
  removeBackgroundImage: () => void;
  previewImage: string | null;
  previewContainerRef: React.RefObject<HTMLDivElement | null>;
  backgroundPosition: { x: number; y: number };
  handlePositionChange: (axis: "x" | "y", value: number[]) => void;
  sliderDisabled: { x: boolean; y: boolean };
  backgroundZoom: number;
  onBackgroundZoomChange: (zoom: number) => void;
  overlayEnabled: boolean;
  onOverlayEnabledChange: (enabled: boolean) => void;
  edgeBlurEnabled: boolean;
  onEdgeBlurEnabledChange: (enabled: boolean) => void;
  edgeBlurIntensity: number;
  onEdgeBlurIntensityChange: (intensity: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorOptions: Array<{
    name: string;
    value: string;
    bg: string;
    textColor: string;
  }>;
  fontOptions: Array<{
    name: string;
    value: string;
    fontFamily: string;
  }>;
  fontSizeOptions: Array<{
    name: string;
    value: string;
  }>;
}

// Generate and export settings items list function
export function getSettingItems({
  text,
  enterEditMode,
  fontSize,
  onFontSizeChange,
  textColor,
  onColorChange,
  fontFamily,
  onFontChange,
  scrollSpeed,
  onScrollSpeedChange,
  backgroundImage,
  triggerFileUpload,
  removeBackgroundImage,
  previewImage,
  previewContainerRef,
  backgroundPosition,
  handlePositionChange,
  sliderDisabled,
  backgroundZoom,
  onBackgroundZoomChange,
  overlayEnabled,
  onOverlayEnabledChange,
  edgeBlurEnabled,
  onEdgeBlurEnabledChange,
  edgeBlurIntensity,
  onEdgeBlurIntensityChange,
  fileInputRef,
  handleFileChange,
  colorOptions,
  fontOptions,
  fontSizeOptions,
}: ToolBarSettingsProps) {
  return [
    {
      id: "content",
      title: "内容",
      component: (
        <button
          onClick={enterEditMode}
          className="w-full text-left px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-md text-zinc-200 text-sm font-sans transition-colors"
        >
          {text.length > 30 ? text.substring(0, 30) + "..." : text}
        </button>
      ),
    },
    {
      id: "fontSize",
      title: "字体尺寸",
      component: (
        <OptionButtonGroup
          options={fontSizeOptions}
          selectedValue={fontSize}
          onChange={onFontSizeChange}
        />
      ),
    },
    {
      id: "textColor",
      title: "字体颜色",
      component: (
        <OptionButtonGroup
          options={colorOptions}
          selectedValue={textColor}
          onChange={onColorChange}
          buttonSize="icon"
          renderOption={(option) => (
            <Baseline className={cn(option.textColor)} size="12" />
          )}
        />
      ),
    },
    {
      id: "fontFamily",
      title: "字体样式",
      component: (
        <OptionButtonGroup
          options={fontOptions}
          selectedValue={fontFamily}
          onChange={onFontChange}
          renderOption={(option) => (
            <span style={{ fontFamily: option.value }}>{option.name}</span>
          )}
        />
      ),
    },
    {
      id: "scrollSpeed",
      title: "滚动速度",
      component: (
        <OptionButtonGroup<{ name: string; value: string }>
          options={[
            { name: "0.3x", value: "3" },
            { name: "0.5x", value: "5" },
            { name: "1x", value: "10" },
            { name: "1.5x", value: "15" },
            { name: "2x", value: "20" },
          ]}
          selectedValue={scrollSpeed.toString()}
          onChange={(value) => onScrollSpeedChange(parseInt(value, 10))}
        />
      ),
    },
    {
      id: "backgroundImage",
      title: "背景图片",
      component: (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex gap-2">
            <Button
              onClick={triggerFileUpload}
              className={cn(
                backgroundImage
                  ? "bg-zinc-800 text-zinc-100"
                  : "bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300",
                "bg-zinc-900 flex items-center gap-1 text-xs hover:bg-zinc-800"
              )}
              size="sm"
            >
              <ImageIcon size={14} />
              上传图片
            </Button>
            {backgroundImage && (
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="destructive"
                  onClick={removeBackgroundImage}
                  size="sm"
                  className="text-xs hover:bg-red-400"
                >
                  移除图片
                </Button>
              </div>
            )}
          </div>
          {backgroundImage && (
            <>
              <div
                className="mt-2 relative w-full h-20 rounded-md overflow-hidden"
                ref={previewContainerRef}
              >
                <Image
                  src={previewImage || backgroundImage}
                  alt="Background preview"
                  fill
                  sizes="100px"
                  style={{
                    objectFit: "cover",
                    objectPosition: `${backgroundPosition.x}% ${backgroundPosition.y}%`,
                    transform: `scale(${backgroundZoom})`,
                    transformOrigin: `${backgroundPosition.x}% ${backgroundPosition.y}%`,
                  }}
                />
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <MoveHorizontal
                    size={14}
                    className={cn(
                      "text-zinc-400",
                      sliderDisabled.x && "text-zinc-600"
                    )}
                  />
                  <Slider
                    defaultValue={[backgroundPosition.x]}
                    value={[backgroundPosition.x]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handlePositionChange("x", value)}
                    className="w-full"
                    disabled={sliderDisabled.x}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <MoveVertical
                    size={14}
                    className={cn(
                      "text-zinc-400",
                      sliderDisabled.y && "text-zinc-600"
                    )}
                  />
                  <Slider
                    defaultValue={[backgroundPosition.y]}
                    value={[backgroundPosition.y]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handlePositionChange("y", value)}
                    className="w-full"
                    disabled={sliderDisabled.y}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-zinc-400"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                  <Slider
                    defaultValue={[backgroundZoom]}
                    value={[backgroundZoom]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={(value) => onBackgroundZoomChange(value[0])}
                    className="w-full"
                  />
                </div>
              </div>
              <Button
                size="sm"
                className="bg-zinc-900 hover:bg-zinc-800 px-2 flex items-center gap-1 text-xs"
                onClick={() => onOverlayEnabledChange(!overlayEnabled)}
              >
                {overlayEnabled ? (
                  <>
                    <Eye size={12} />
                  </>
                ) : (
                  <>
                    <EyeOff size={12} />
                  </>
                )}
                弱化背景
              </Button>
            </>
          )}
        </div>
      ),
    },
    {
      id: "edgeBlurEffect",
      title: "特效",
      component: (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">聚焦</span>
            <Button
              size="sm"
              className="bg-zinc-900 hover:bg-zinc-800 px-2 flex items-center gap-1 text-xs"
              onClick={() => onEdgeBlurEnabledChange(!edgeBlurEnabled)}
            >
              {edgeBlurEnabled ? (
                <>
                  <Eye size={12} />
                </>
              ) : (
                <>
                  <EyeOff size={12} />
                </>
              )}
              {edgeBlurEnabled ? "开启" : "关闭"}
            </Button>
          </div>
          
          {edgeBlurEnabled && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-zinc-400"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <Slider
                  defaultValue={[edgeBlurIntensity]}
                  value={[edgeBlurIntensity]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(value) => onEdgeBlurIntensityChange(value[0])}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];
} 