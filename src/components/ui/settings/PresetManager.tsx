import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button/button";
import { Save, Download, Trash2, ChevronDown, RefreshCw } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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
  // backgroundColor?: string;
  backgroundImage?: string | null;
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
  // backgroundColor,
  backgroundImage,
  onLoadPreset,
}: PresetManagerProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const presetInputRef = useRef<HTMLInputElement>(null);

  // 值到标签的映射
  const getFontSizeLabel = (size: string) => {
    switch(size) {
      case "5rem": return "S";
      case "8rem": return "M";
      case "10rem": return "L";
      case "16rem": return "XL";
      default: return size;
    }
  };
  
  const getScrollSpeedLabel = (speed: number) => {
    switch(speed) {
      case 3: return "0.3x";
      case 5: return "0.5x";
      case 10: return "1x";
      case 15: return "1.5x";
      case 20: return "2x";
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
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error("Failed to parse saved presets", e);
      }
    }
  }, []);

  // Check if current settings match the active preset
  useEffect(() => {
    if (!activePresetId) return;
    
    // Check if settings changed for active preset
    const activePreset = presets.find(p => p.id === activePresetId);
    if (activePreset) {
      const settingsChanged = 
        activePreset.text !== text ||
        activePreset.textColor !== textColor ||
        activePreset.fontFamily !== fontFamily ||
        activePreset.fontSize !== fontSize ||
        activePreset.scrollSpeed !== scrollSpeed;
    }
  }, [activePresetId, text, textColor, fontFamily, fontSize, scrollSpeed, presets]);

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
      // backgroundColor,
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
    const updatedPresets = presets.map(preset => {
      if (preset.id === presetId) {
        return {
          ...preset,
          text,
          textColor,
          fontFamily,
          fontSize,
          scrollSpeed,
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
    const updatedPresets = presets.filter(preset => preset.id !== id);
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

  return (
    <div className="space-y-2 pt-2 border-t border-zinc-800">
      <div className="flex items-center justify-between">
        <p className="text-zinc-300 text-sm font-medium select-none">
          预设管理
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              setShowPresetInput(true);
              setTimeout(() => presetInputRef.current?.focus(), 10);
            }}
            className="px-2 py-1 rounded-md text-xs font-sans bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            <Save size={14} />
            保存
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {showPresetInput && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 mt-2"
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
        <p className="text-zinc-500 text-xs italic">暂无保存的预设</p>
      ) : (
        <div className="mt-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
          <Accordion type="multiple" className="w-full">
            {presets.map((preset) => (
              <AccordionItem key={preset.id} value={preset.id} className="border-b-0 mb-2">
                <div className="flex w-full items-center gap-1">
                  <div className="flex-1">
                    <AccordionTrigger 
                      className={cn(
                        "py-2 px-3 w-full bg-zinc-800/50 hover:bg-zinc-800 rounded-md text-zinc-200 text-sm transition-colors hover:no-underline",
                        activePresetId === preset.id && "border border-zinc-700"
                      )}
                    >
                      <div className="flex items-center gap-1 w-full">
                        <p className="max-w-40">
                          {activePresetId === preset.id && (
                            <span className="pr-2 text-zinc-400 text-xs">当前</span>
                          )}
                          {preset.name}
                        </p>
                      </div>
                    </AccordionTrigger>
                  </div>
                  {activePresetId === preset.id ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePreset(preset.id);
                      }}
                      className="px-2 py-1 text-xs bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 rounded-md"
                      title="更新预设"
                    >
                      <RefreshCw size={14} />
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadPreset(preset);
                      }}
                      className="px-2 py-1 text-xs bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 rounded-md"
                      title="载入预设"
                    >
                      <Download size={14} />
                    </Button>
                  )}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePreset(preset.id, e);
                    }}
                    className="px-2 py-1 text-xs bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 rounded-md"
                    title="删除预设"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                <AccordionContent className="bg-zinc-900/50 rounded-md mt-1 p-2">
                  <div className="text-xs text-zinc-400 space-y-1">
                    <p>文字内容: {preset.text.substring(0, 30)}{preset.text.length > 30 ? "..." : ""}</p>
                    <p>字体: {getFontFamilyLabel(preset.fontFamily)}</p>
                    <p>颜色: {getFontColorLabel(preset.textColor)}</p>
                    <p>字号: {getFontSizeLabel(preset.fontSize)}</p>
                    <p>滚动速度: {getScrollSpeedLabel(preset.scrollSpeed)}</p>
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