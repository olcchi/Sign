"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Baseline,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
} from "lucide-react";
import { Slider } from "@/components/ui/inputs/slider";
import { Button } from "@/components/ui/button/button";
import { OptionButtonGroup } from "@/components/ui/settings/OptionButtonGroup";
import Image from "next/image";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Configurable options
interface OptionsConfig {
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

// Text editing interaction properties
interface TextEditHandlingProps {
  enterEditMode?: () => void;
}

// Background image interaction properties
interface BackgroundImageHandlingProps {
  previewImage: string | null;
  previewContainerRef: React.RefObject<HTMLDivElement | null>;
  handlePositionChange: (axis: "x" | "y", value: number[]) => void;
  sliderDisabled: { x: boolean; y: boolean };
  triggerFileUpload: () => void;
  removeBackgroundImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Combines all settings properties for extensibility
export interface ToolBarSettingsProps
  extends BackgroundImageHandlingProps,
    OptionsConfig,
    TextEditHandlingProps {}

// Constructs setting item components for toolbar option rendering
export function ToolBarSettings({
  // Text editing handling
  enterEditMode,

  // Background image handling
  previewImage,
  previewContainerRef,
  handlePositionChange,
  sliderDisabled,
  triggerFileUpload,
  removeBackgroundImage,
  fileInputRef,
  handleFileChange,

  // Configuration options
  colorOptions,
  fontOptions,
  fontSizeOptions,
}: ToolBarSettingsProps) {
  // Get settings from Context
  const {
    textSettings,
    updateTextSettings,
    backgroundSettings,
    updateBackgroundSettings,
    effectsSettings,
    updateEffectsSettings,
  } = useSettings();

  const [localText, setLocalText] = useState(textSettings.text);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // initialize text sync
  useEffect(() => {
    setLocalText(textSettings.text);
  }, [textSettings.text]);

  // adjust text area height function
  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    const newHeight = Math.min(80, element.scrollHeight);
    element.style.height = `${newHeight}px`;
  };

  // initial load adjust height
  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight(textareaRef.current);
    }
  }, [localText]);

  // save text to global state
  const saveText = () => {
    // ensure save when text is empty
    const finalText = localText.trim() === "" ? "Sign" : localText;
    updateTextSettings({ text: finalText });
    setIsEditing(false);
  };

  // revert changes
  const revertText = () => {
    setLocalText(textSettings.text);
    setIsEditing(false);
  };

  // default text
  useEffect(() => {
    if (textSettings.text === "") {
      updateTextSettings({ text: "Sign" });
    }
  }, []);

  return [
    {
      id: "content",
      title: (
        <div className="flex items-center justify-between w-full">
          <span>内容</span>
          {isEditing && (
            <div className="flex space-x-1">
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
              // update local state
              setLocalText(e.target.value);
              // set editing state to true
              setIsEditing(true);
              // adjust height
              adjustHeight(e.target);
              // if text is empty, set to "Sign"
              if (e.target.value.trim() === "") {
                setLocalText("Sign");
                adjustHeight(e.target);
              }
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
    },
    {
      id: "fontSize",
      title: "字体尺寸",
      component: (
        <OptionButtonGroup
          options={fontSizeOptions}
          selectedValue={textSettings.fontSize}
          buttonSize="icon"
          onChange={(size) => updateTextSettings({ fontSize: size })}
        />
      ),
    },
    {
      id: "textRendering",
      title: "字体渲染",
      component: (
        <div className="space-y-2">
          <div className="border-b overflow-hidden">
            <div className="flex justify-between items-center p-2">
              <span className="text-sm ">填充</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (
                    textSettings.textFillEnabled &&
                    !textSettings.textStrokeEnabled
                  ) {
                    updateTextSettings({ textStrokeEnabled: true });
                  }
                  updateTextSettings({
                    textFillEnabled: !textSettings.textFillEnabled,
                  });
                }}
                disabled={
                  !textSettings.textFillEnabled &&
                  !textSettings.textStrokeEnabled
                }
              >
                {textSettings.textFillEnabled ? (
                  <Eye size={12} />
                ) : (
                  <EyeOff size={12} />
                )}
                {textSettings.textFillEnabled ? "开启" : "关闭"}
              </Button>
            </div>

            {textSettings.textFillEnabled && (
              <div className="p-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap ">颜色</span>
                  <OptionButtonGroup
                    options={colorOptions}
                    selectedValue={textSettings.textColor}
                    onChange={(color) =>
                      updateTextSettings({ textColor: color })
                    }
                    buttonSize="icon"
                    renderOption={(option) => (
                      <Baseline className={cn(option.textColor)} size="12" />
                    )}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-b overflow-hidden">
            <div className="flex justify-between items-center p-2">
              <span className="text-sm ">边框</span>
              <Button
                size="sm"
                variant={"ghost"}
                onClick={() => {
                  if (
                    textSettings.textStrokeEnabled &&
                    !textSettings.textFillEnabled
                  ) {
                    updateTextSettings({ textFillEnabled: true });
                  }
                  updateTextSettings({
                    textStrokeEnabled: !textSettings.textStrokeEnabled,
                  });
                }}
                disabled={
                  !textSettings.textFillEnabled &&
                  !textSettings.textStrokeEnabled
                }
              >
                {textSettings.textStrokeEnabled ? (
                  <Eye size={12} />
                ) : (
                  <EyeOff size={12} />
                )}
                {textSettings.textStrokeEnabled ? "开启" : "关闭"}
              </Button>
            </div>

            {textSettings.textStrokeEnabled && (
              <div className="p-2 space-y-2">
                <div className="flex items-center  gap-2">
                  <span className="text-sm whitespace-nowrap ">颜色</span>
                  <OptionButtonGroup
                    options={colorOptions}
                    selectedValue={textSettings.textStrokeColor}
                    onChange={(color) =>
                      updateTextSettings({ textStrokeColor: color })
                    }
                    buttonSize="icon"
                    renderOption={(option) => (
                      <Baseline className={cn(option.textColor)} size="12" />
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap ">宽度</span>
                  <Slider
                    defaultValue={[textSettings.textStrokeWidth]}
                    value={[textSettings.textStrokeWidth]}
                    min={1}
                    max={3}
                    step={0.5}
                    onValueChange={(value) =>
                      updateTextSettings({ textStrokeWidth: value[0] })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "fontFamily",
      title: "字体样式",
      component: (
        <OptionButtonGroup
          options={fontOptions}
          selectedValue={textSettings.fontFamily}
          onChange={(font) => updateTextSettings({ fontFamily: font })}
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
          selectedValue={textSettings.scrollSpeed.toString()}
          onChange={(value) =>
            updateTextSettings({ scrollSpeed: parseInt(value, 10) })
          }
        />
      ),
    },
    {
      id: "backgroundImage",
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
            <Button onClick={triggerFileUpload} variant="secondary" >
              <p className="text-xs whitespace-nowrap">上传图片</p>
              <ImageIcon size={14} />
            </Button>
            {backgroundSettings.backgroundImage && (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={removeBackgroundImage}
                >
                  <p className="text-xs whitespace-nowrap">移除图片</p>
                </Button>
              </div>
            )}
          </div>
          {backgroundSettings.backgroundImage && (
            <>
              <div
                className="relative w-full h-20 overflow-hidden border"
                ref={previewContainerRef}
              >
                <Image
                  src={previewImage || backgroundSettings.backgroundImage}
                  alt="Background preview"
                  fill
                  sizes="100px"
                  style={{
                    objectFit: "cover",
                    objectPosition: `${backgroundSettings.backgroundPosition.x}% ${backgroundSettings.backgroundPosition.y}%`,
                    transform: `scale(${backgroundSettings.backgroundZoom})`,
                    transformOrigin: `${backgroundSettings.backgroundPosition.x}% ${backgroundSettings.backgroundPosition.y}%`,
                  }}
                />
              </div>
              <div className="space-y-2">
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
          <div className="border-b overflow-hidden">
            <div className="flex justify-between items-center p-2">
              <span className="text-sm ">聚焦</span>
              <Button
                size="sm"
                variant={"ghost"}
                onClick={() =>
                  updateEffectsSettings({
                    edgeBlurEnabled: !effectsSettings.edgeBlurEnabled,
                  })
                }
              >
                {effectsSettings.edgeBlurEnabled ? (
                  <Eye size={12} />
                ) : (
                  <EyeOff size={12} />
                )}
                {effectsSettings.edgeBlurEnabled ? "开启" : "关闭"}
              </Button>
            </div>

            {effectsSettings.edgeBlurEnabled && (
              <div className="p-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm whitespace-nowrap ">强度</p>
                  <Slider
                    defaultValue={[effectsSettings.edgeBlurIntensity]}
                    value={[effectsSettings.edgeBlurIntensity]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) =>
                      updateEffectsSettings({ edgeBlurIntensity: value[0] })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-b overflow-hidden">
            <div className="flex justify-between items-center p-2">
              <span className="text-sm ">噪点</span>
              <Button
                size="sm"
                variant={"ghost"}
                onClick={() =>
                  updateEffectsSettings({
                    noiseEnabled: !effectsSettings.noiseEnabled,
                  })
                }
              >
                {effectsSettings.noiseEnabled ? (
                  <Eye size={12} />
                ) : (
                  <EyeOff size={12} />
                )}
                {effectsSettings.noiseEnabled ? "开启" : "关闭"}
              </Button>
            </div>

            {effectsSettings.noiseEnabled && (
              <div className="p-2 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm whitespace-nowrap ">亮度</span>
                  <Slider
                    defaultValue={[effectsSettings.noiseOpacity]}
                    value={[effectsSettings.noiseOpacity]}
                    min={0.01}
                    max={0.3}
                    step={0.01}
                    onValueChange={(value) =>
                      updateEffectsSettings({ noiseOpacity: value[0] })
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm whitespace-nowrap ">密度</span>
                  <Slider
                    defaultValue={[effectsSettings.noiseDensity]}
                    value={[effectsSettings.noiseDensity]}
                    min={0.1}
                    max={0.6}
                    step={0.05}
                    onValueChange={(value) =>
                      updateEffectsSettings({ noiseDensity: value[0] })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-b overflow-hidden">
            <div className="flex justify-between items-center p-2">
              <span className="text-sm ">闪光</span>
              <Button
                size="sm"
                variant={"ghost"}
                onClick={() =>
                  updateEffectsSettings({
                    shinyTextEnabled: !effectsSettings.shinyTextEnabled,
                  })
                }
              >
                {effectsSettings.shinyTextEnabled ? (
                  <Eye size={12} />
                ) : (
                  <EyeOff size={12} />
                )}
                {effectsSettings.shinyTextEnabled ? "开启" : "关闭"}
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];
}
