import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/layout/button";
import {
  Save,
  Plus,
  Trash2,
  RefreshCw,
  CircleAlert,
  AlertCircle,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/layout/alert";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/layout/accordion";
import { cn } from "@/lib/utils";
import { ShareSetting } from "@/components/ui/settings/settingsComponent/ShareSetting";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { getPresetDetailedInfo } from "@/lib/preset-utils";

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
  fontWeight: string;
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
  fontWeight: string;
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
  onActivePresetChange?: (preset: Preset | null) => void; // Callback for active preset changes
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
  fontWeight,
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
  onActivePresetChange,
}: PresetManagerProps) {
  const { updateTextSettings, updateEffectsSettings } = useSettings();

  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  // Track which preset is currently in delete confirmation mode
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isAlert, setIsAlert] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const presetInputRef = useRef<HTMLInputElement>(null);

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
        localStorage.setItem("sign-presets", JSON.stringify(updatedPresets));
      } catch (e) {
        console.error("Failed to parse saved presets", e);
      }
    }
  }, []);

  // Check if current settings match the active preset
  useEffect(() => {
    if (!activePresetId) {
      setHasUnsavedChanges(false);
      return;
    }

    // Check if settings changed for active preset
    const activePreset = presets.find((p) => p.id === activePresetId);
    if (activePreset) {
      const settingsChanged =
        activePreset.text !== text ||
        activePreset.textColor !== textColor ||
        activePreset.fontFamily !== fontFamily ||
        activePreset.fontSize !== fontSize ||
        activePreset.fontWeight !== fontWeight ||
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

      setHasUnsavedChanges(settingsChanged);
    }
  }, [
    activePresetId,
    text,
    textColor,
    fontFamily,
    fontSize,
    fontWeight,
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

  // Notify parent component when active preset changes
  useEffect(() => {
    if (onActivePresetChange) {
      const activePreset = activePresetId
        ? presets.find((p) => p.id === activePresetId) || null
        : null;
      onActivePresetChange(activePreset);
    }
  }, [activePresetId, presets, onActivePresetChange]);

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
      fontWeight,
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
    setHasUnsavedChanges(false);
  };

  // Show delete confirmation
  const confirmDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  // Execute preset deletion
  const executeDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const updatedPresets = presets.filter((preset) => preset.id !== id);
    setPresets(updatedPresets);
    localStorage.setItem("soulsign-presets", JSON.stringify(updatedPresets));

    // Clear active preset if deleted
    if (activePresetId === id) {
      setActivePresetId(null);
    }

    // Clear delete confirmation
    setDeleteConfirmId(null);
  };

  // Cancel delete operation
  const cancelDeletePreset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
  };

  // Load a preset and set it as active
  const handleLoadPreset = (preset: Preset) => {
    onLoadPreset(preset);
    setActivePresetId(preset.id);
  };

  return (
    <div className="space-y-2 relative">
      <div className="flex items-center justify-between py-1">
        <p className=" text-sm font-bold select-none">预设管理</p>
        <Button
          size="sm"
          variant={"ghost"}
          className="py-0 text-xs"
          onClick={() => {
            // Generate current date in YYYYMMDD format
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const dateString = `${year}${month}${day}`;

            setPresetName(dateString);
            setShowPresetInput(true);
            setTimeout(() => presetInputRef.current?.focus(), 10);
          }}
        >
          <Save size={14} className="mr-1" />
          保存
        </Button>
      </div>

      {isAlert && (
        <Alert className="my-2">
          <CircleAlert size={12} />
          <AlertTitle className="text-xs">提示</AlertTitle>
          <AlertDescription className="text-xs">
            <p>- 预设保存在您的浏览器LocalStorage，不保证持久性</p>
            <p>- 分享预设PIN码有效期24小时</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Share functionality section */}
      <div className="space-y-2">
        <ShareSetting
          activePreset={
            activePresetId
              ? presets.find((p) => p.id === activePresetId) || null
              : null
          }
        />
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
              className="flex-1 px-2 py-1 text-xs bg-muted rounded-md focus:outline-none focus:border-zinc-700"
            />
            <Button
              size="sm"
              onClick={savePreset}
              variant={"secondary"}
              className="px-2 py-1 rounded-md text-xs"
            >
              确认
            </Button>
            <Button
              size="sm"
              variant={"secondary"}
              onClick={() => setShowPresetInput(false)}
              className="px-2 py-1 rounded-md text-xs"
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
                    "flex w-full items-center rounded-md gap-2 px-3 sticky top-0 z-10 bg-muted overflow-hidden"
                  )}
                >
                  <div className="flex-1">
                    <AccordionTrigger
                      className={cn(
                        "w-full text-sm flex items-center transition-colors hover:no-underline"
                      )}
                    >
                      <div className="flex py-1 items-center gap-1 w-full">
                        <p className="max-w-40 font-sans text-xs">
                          {activePresetId === preset.id && (
                            <span className="pr-2  text-xs">当前</span>
                          )}
                          {preset.name}
                        </p>
                      </div>
                    </AccordionTrigger>
                  </div>

                  {/* Action buttons with delete confirmation */}
                  <div className="flex relative items-center">
                    {/* Normal action buttons */}
                    <AnimatePresence mode="wait">
                      {deleteConfirmId !== preset.id ? (
                        <motion.div
                          className="flex"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                          key="normal-actions"
                        >
                          {activePresetId === preset.id ? (
                            <Button
                              size="sm"
                              // variant={hasUnsavedChanges?"outline":"ghost"}
                              disabled={!hasUnsavedChanges}
                              variant="ghost"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                updatePreset(preset.id);
                              }}
                              title="更新预设"
                              className={cn(
                                "relative",
                                hasUnsavedChanges ? "ring-1 ring-green-500" : ""
                              )}
                            >
                              <RefreshCw size={14} />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant={"ghost"}
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                handleLoadPreset(preset);
                              }}
                              title="载入预设"
                            >
                              <Plus size={14} />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant={"ghost"}
                            onClick={(e: React.MouseEvent) =>
                              confirmDeletePreset(preset.id, e)
                            }
                            title="删除预设"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="flex"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                          key="confirm-actions"
                        >
                          <div className="flex items-center gap-1 px-1 py-1 rounded-md">
                            <Button
                              size="sm"
                              variant={"ghost"}
                              className=" px-2 text-xs"
                              onClick={(e: React.MouseEvent) =>
                                executeDeletePreset(preset.id, e)
                              }
                              title="确认"
                            >
                              删除
                            </Button>
                            <Button
                              size="sm"
                              variant={"ghost"}
                              className=" px-2 text-xs"
                              onClick={(e: React.MouseEvent) =>
                                cancelDeletePreset(e)
                              }
                              title="取消"
                            >
                              取消
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <AccordionContent className="border rounded-md mt-1 p-3">
                  <div className="text-xs space-y-1 font-sans p-2">
                    {getPresetDetailedInfo(preset).map((detail, index) => (
                      <p key={index}>{detail}</p>
                    ))}
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
