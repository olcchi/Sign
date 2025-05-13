import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button/button";
import { Save, Download, Trash2, ChevronDown, RefreshCw } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/layout/accordion";
import { cn } from "@/lib/utils";

/**
 * Preset interface defining the structure of saved presets
 */
export interface Preset {
  id: string;
  name: string;
  text: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  scrollSpeed: number;
  // backgroundColor?: string;
  edgeBlurEnabled: boolean;
  edgeBlurIntensity: number;
  shinyTextEnabled: boolean;
  noiseEnabled?: boolean;
  noiseOpacity?: number;
  noiseDensity?: number;
  textStrokeEnabled?: boolean;
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textFillEnabled?: boolean;
}

/**
 * Props for the PresetManager component
 */
interface PresetManagerProps {
  text: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  scrollSpeed: number;
  edgeBlurEnabled: boolean;
  edgeBlurIntensity: number;
  shinyTextEnabled: boolean;
  noiseEnabled?: boolean;
  noiseOpacity?: number;
  noiseDensity?: number;
  textStrokeEnabled?: boolean;
  textStrokeWidth?: number;
  textStrokeColor?: string;
  textFillEnabled?: boolean;
  onLoadPreset: (preset: Preset) => void;
}

/**
 * Component for managing text display presets
 * Handles saving, loading, and deleting presets
 */
export function PresetManager({
  text,
  textColor,
  fontFamily,
  fontSize,
  scrollSpeed,
  edgeBlurEnabled,
  edgeBlurIntensity,
  shinyTextEnabled,
  noiseEnabled,
  noiseOpacity,
  noiseDensity,
  textStrokeEnabled,
  textStrokeWidth,
  textStrokeColor,
  textFillEnabled,
  onLoadPreset,
}: PresetManagerProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const presetInputRef = useRef<HTMLInputElement>(null);

  // value to label
  const getFontSizeLabel = (size: string) => {
    switch (size) {
      case "5rem":
        return "S";
      case "8rem":
        return "M";
      case "10rem":
        return "L";
      case "16rem":
        return "XL";
      default:
        return size;
    }
  };

  const getScrollSpeedLabel = (speed: number) => {
    switch (speed) {
      case 3:
        return "0.3x";
      case 5:
        return "0.5x";
      case 10:
        return "1x";
      case 15:
        return "1.5x";
      case 20:
        return "2x";
    }
  };

  const getFontFamilyLabel = (font: string) => {
    if (font.includes("sans")) return "Sans";
    if (font.includes("serif")) return "Serif";
  };

  const getFontColorLabel = (color: string) => {
    return color;
  };

  // Load saved presets
  useEffect(() => {
    const savedPresets = localStorage.getItem("soulsign-presets");
    if (savedPresets) {
      try {
        const parsedPresets = JSON.parse(savedPresets);
        const updatedPresets = parsedPresets.map((preset: any) => ({
          ...preset,
          edgeBlurEnabled:
            preset.edgeBlurEnabled !== undefined
              ? preset.edgeBlurEnabled
              : false,
          edgeBlurIntensity:
            preset.edgeBlurIntensity !== undefined
              ? preset.edgeBlurIntensity
              : 10,
          shinyTextEnabled:
            preset.shinyTextEnabled !== undefined
              ? preset.shinyTextEnabled
              : false,
          noiseEnabled:
            preset.noiseEnabled !== undefined ? preset.noiseEnabled : false,
          noiseOpacity:
            preset.noiseOpacity !== undefined ? preset.noiseOpacity : 0.5,
          noiseDensity:
            preset.noiseDensity !== undefined ? preset.noiseDensity : 0.5,
          textStrokeEnabled:
            preset.textStrokeEnabled !== undefined
              ? preset.textStrokeEnabled
              : true,
          textStrokeWidth:
            preset.textStrokeWidth !== undefined ? preset.textStrokeWidth : 1,
          textStrokeColor:
            preset.textStrokeColor !== undefined
              ? preset.textStrokeColor
              : "#000000",
          textFillEnabled:
            preset.textFillEnabled !== undefined
              ? preset.textFillEnabled
              : true,
        }));

        setPresets(updatedPresets);
        // update
        localStorage.setItem(
          "soulsign-presets",
          JSON.stringify(updatedPresets)
        );
      } catch (e) {
        console.error("Failed to parse saved presets", e);
      }
    }
  }, []);

  // Check if current settings match the active preset
  useEffect(() => {
    if (!activePresetId) return;

    // Check if settings changed for active preset
    const activePreset = presets.find((p) => p.id === activePresetId);
    if (activePreset) {
      const settingsChanged =
        activePreset.text !== text ||
        activePreset.textColor !== textColor ||
        activePreset.fontFamily !== fontFamily ||
        activePreset.fontSize !== fontSize ||
        activePreset.scrollSpeed !== scrollSpeed ||
        activePreset.edgeBlurEnabled !== edgeBlurEnabled ||
        activePreset.edgeBlurIntensity !== edgeBlurIntensity ||
        activePreset.shinyTextEnabled !== shinyTextEnabled ||
        activePreset.noiseEnabled !== noiseEnabled ||
        activePreset.noiseOpacity !== noiseOpacity ||
        activePreset.noiseDensity !== noiseDensity ||
        activePreset.textStrokeEnabled !== textStrokeEnabled ||
        activePreset.textStrokeWidth !== textStrokeWidth ||
        activePreset.textStrokeColor !== textStrokeColor ||
        activePreset.textFillEnabled !== textFillEnabled;
    }
  }, [
    activePresetId,
    text,
    textColor,
    fontFamily,
    fontSize,
    scrollSpeed,
    edgeBlurEnabled,
    edgeBlurIntensity,
    shinyTextEnabled,
    noiseEnabled,
    noiseOpacity,
    noiseDensity,
    textStrokeEnabled,
    textStrokeWidth,
    textStrokeColor,
    textFillEnabled,
    presets,
  ]);

  // Save preset to localStorage
  const savePreset = () => {
    if (!presetName.trim()) return;

    const newPreset: Preset = {
      id: Date.now().toString(),
      name: presetName,
      text,
      textColor,
      fontFamily,
      fontSize,
      scrollSpeed,
      edgeBlurEnabled,
      edgeBlurIntensity,
      shinyTextEnabled,
      noiseEnabled,
      noiseOpacity,
      noiseDensity,
      textStrokeEnabled,
      textStrokeWidth,
      textStrokeColor,
      textFillEnabled,
    };

    const updatedPresets = [newPreset, ...presets];
    setPresets(updatedPresets);
    localStorage.setItem("soulsign-presets", JSON.stringify(updatedPresets));

    setPresetName("");
    setShowPresetInput(false);
    setActivePresetId(newPreset.id);
  };

  // Update a specific preset with current settings
  const updatePreset = (presetId: string) => {
    const updatedPresets = presets.map((preset) => {
      if (preset.id === presetId) {
        return {
          ...preset,
          text,
          textColor,
          fontFamily,
          fontSize,
          scrollSpeed,
          edgeBlurEnabled,
          edgeBlurIntensity,
          shinyTextEnabled,
          noiseEnabled,
          noiseOpacity,
          noiseDensity,
          textStrokeEnabled,
          textStrokeWidth,
          textStrokeColor,
          textFillEnabled,
        };
      }
      return preset;
    });

    setPresets(updatedPresets);
    localStorage.setItem("soulsign-presets", JSON.stringify(updatedPresets));
  };

  // Delete preset
  const deletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedPresets = presets.filter((preset) => preset.id !== id);
    setPresets(updatedPresets);
    localStorage.setItem("soulsign-presets", JSON.stringify(updatedPresets));

    // Clear active preset if deleted
    if (activePresetId === id) {
      setActivePresetId(null);
    }
  };

  // Load a preset and set it as active
  const handleLoadPreset = (preset: Preset) => {
    onLoadPreset(preset);
    setActivePresetId(preset.id);
  };

  // get rendering status text
  const getRenderingStatusText = (isEnabled?: boolean) => {
    return isEnabled ? "开启" : "关闭";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-1">
        <p className="text-zinc-300 text-sm font-medium select-none">
          预设管理
        </p>

        <Button
          size="sm"
          variant={"ghost"}
          onClick={() => {
            setShowPresetInput(true);
            setTimeout(() => presetInputRef.current?.focus(), 10);
          }}
          // className=" px-2 py-1 rounded-md text-xs font-sans bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 transition-colors"
        >
          <Save size={14} className="mr-1" />
          保存
        </Button>
      </div>
      <AnimatePresence>
        {showPresetInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 px-2 mt-2"
          >
            <input
              ref={presetInputRef}
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && savePreset()}
              placeholder="预设名称..."
              className="flex-1 px-2 py-1 text-sm bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300 focus:outline-none focus:border-zinc-700"
            />
            <Button
              size="sm"
              onClick={savePreset}
              className="px-2 py-1 rounded-md text-xs bg-zinc-100 hover:bg-white text-black"
            >
              保存
            </Button>
            <Button
              size="sm"
              onClick={() => setShowPresetInput(false)}
              className="px-2 py-1 rounded-md text-xs bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300"
            >
              取消
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {presets.length === 0 ? (
        <p className="text-zinc-500 text-xs italic px-2 py-1">暂无保存的预设</p>
      ) : (
        <div className="mt-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
          <Accordion type="multiple" className="w-full">
            {presets.map((preset) => (
              <AccordionItem
                key={preset.id}
                value={preset.id}
                className="border-b-0 mb-2"
              >
                <div
                  className={cn(
                    "flex w-full items-center rounded-md gap-2 px-3 sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-sm"
                  )}
                >
                  <div className="flex-1">
                    <AccordionTrigger
                      className={cn(
                        "w-full text-zinc-200 text-sm flex items-center transition-colors hover:no-underline"
                      )}
                    >
                      <div className="flex py-1 items-center gap-1 w-full">
                        <p className="max-w-40 font-sans text-xs">
                          {activePresetId === preset.id && (
                            <span className="pr-2 text-zinc-400 text-xs">
                              当前
                            </span>
                          )}
                          {preset.name}
                        </p>
                      </div>
                    </AccordionTrigger>
                  </div>
                  <div className="flex">
                    {activePresetId === preset.id ? (
                      <Button
                        size="sm"
                        variant={"ghost"}
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePreset(preset.id);
                        }}
                        // className="px-2 py-1 text-xs bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 rounded-md"
                        title="更新预设"
                      >
                        <RefreshCw size={14} />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant={"ghost"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadPreset(preset);
                        }}
                        // className="px-2 py-1 text-xs bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 rounded-md"
                        title="载入预设"
                      >
                        <Download size={14} />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant={"ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePreset(preset.id, e);
                      }}
                      // className="px-2 py-1 text-xs bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 rounded-md"
                      title="删除预设"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <AccordionContent className="bg-zinc-900/50 rounded-md mt-1 p-3">
                  <div className="text-xs text-zinc-400 space-y-1">
                    <p>
                      文字内容: {preset.text.substring(0, 30)}
                      {preset.text.length > 30 ? "..." : ""}
                    </p>
                    <p>字体: {getFontFamilyLabel(preset.fontFamily)}</p>
                    <p>颜色: {getFontColorLabel(preset.textColor)}</p>
                    <p>字号: {getFontSizeLabel(preset.fontSize)}</p>
                    <p>滚动速度: {getScrollSpeedLabel(preset.scrollSpeed)}</p>
                    <p>聚焦: {preset.edgeBlurEnabled ? "开启" : "关闭"}</p>
                    <p>闪光: {preset.shinyTextEnabled ? "开启" : "关闭"}</p>
                    <p>噪点: {preset.noiseEnabled ? "开启" : "关闭"}</p>
                    <p>
                      填充: {getRenderingStatusText(preset.textFillEnabled)}
                    </p>
                    <p>
                      描边: {getRenderingStatusText(preset.textStrokeEnabled)}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
